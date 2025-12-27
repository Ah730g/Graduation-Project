<?php

namespace App\Http\Controllers;

use App\Models\IdentityVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use ImageKit\ImageKit;
use Illuminate\Support\Facades\Log;

class IdentityVerificationController extends Controller
{
    /**
     * Submit identity verification documents
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Validate request
        $validated = $request->validate([
            'document_type' => ['required', Rule::in(['id_card', 'passport'])],
            'document_front' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'], // 5MB max
            'document_back' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            // Manual input fields
            'full_name' => ['required', 'string', 'max:255'],
            'document_number' => ['required', 'string', 'max:100'],
            'date_of_birth' => ['required', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        // Check if user already has a pending verification
        $existingPending = IdentityVerification::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existingPending) {
            return response()->json([
                'message' => 'You already have a pending verification request. Please wait for admin review.',
            ], 400);
        }

        // Upload front document to ImageKit
        $frontUrl = $this->uploadToImageKit(
            $request->file('document_front'),
            'identity_verifications/user_' . $user->id . '_front_' . time()
        );

        // Upload back document to ImageKit if provided
        $backUrl = null;
        if ($request->hasFile('document_back')) {
            $backUrl = $this->uploadToImageKit(
                $request->file('document_back'),
                'identity_verifications/user_' . $user->id . '_back_' . time()
            );
        }

        // Create verification record
        $verification = IdentityVerification::create([
            'user_id' => $user->id,
            'document_type' => $validated['document_type'],
            'document_front_url' => $frontUrl,
            'document_back_url' => $backUrl,
            'full_name' => $validated['full_name'],
            'document_number' => $validated['document_number'],
            'date_of_birth' => $validated['date_of_birth'],
            'place_of_birth' => $validated['place_of_birth'] ?? null,
            'nationality' => $validated['nationality'] ?? null,
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => 'pending',
        ]);

        // Update user identity status
        $user->update(['identity_status' => 'pending']);

        return response()->json([
            'message' => 'Identity verification submitted successfully. Please wait for admin review.',
            'verification' => $verification,
        ], 201);
    }

    /**
     * Get current user's verification status
     */
    public function show(Request $request)
    {
        $user = $request->user();

        $verification = IdentityVerification::where('user_id', $user->id)
            ->latest()
            ->first();

        return response()->json([
            'identity_status' => $user->identity_status,
            'verification' => $verification,
        ]);
    }

    /**
     * Admin: Get all pending verifications
     */
    public function getPending(Request $request)
    {
        $verifications = IdentityVerification::with(['user:id,name,email'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        // Ensure all fields are included in the response
        $verifications->transform(function ($verification) {
            return $verification->makeVisible([
                'full_name',
                'document_number',
                'date_of_birth',
                'place_of_birth',
                'nationality',
                'issue_date',
                'expiry_date',
                'address',
            ]);
        });

        return response()->json($verifications);
    }

    /**
     * Admin: Get all verifications
     */
    public function getAll(Request $request)
    {
        $verifications = IdentityVerification::with(['user:id,name,email', 'reviewer:id,name'])
            ->latest()
            ->paginate(20);

        // Ensure all fields are included in the response
        $verifications->getCollection()->transform(function ($verification) {
            return $verification->makeVisible([
                'full_name',
                'document_number',
                'date_of_birth',
                'place_of_birth',
                'nationality',
                'issue_date',
                'expiry_date',
                'address',
            ]);
        });

        return response()->json($verifications);
    }

    /**
     * Admin: Get single verification details
     */
    public function getDetails($id)
    {
        $verification = IdentityVerification::with(['user', 'reviewer:id,name'])
            ->findOrFail($id);

        return response()->json($verification);
    }

    /**
     * Admin: Approve verification
     */
    public function approve(Request $request, $id)
    {
        $admin = $request->user();
        $verification = IdentityVerification::findOrFail($id);

        if ($verification->status !== 'pending') {
            return response()->json([
                'message' => 'This verification has already been processed.',
            ], 400);
        }

        $verification->update([
            'status' => 'approved',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->input('notes', null),
        ]);

        // Update user identity status
        $verification->user->update(['identity_status' => 'approved']);

        return response()->json([
            'message' => 'Identity verification approved successfully.',
            'verification' => $verification->load(['user', 'reviewer']),
        ]);
    }

    /**
     * Admin: Reject verification
     */
    public function reject(Request $request, $id)
    {
        $admin = $request->user();
        $verification = IdentityVerification::findOrFail($id);

        if ($verification->status !== 'pending') {
            return response()->json([
                'message' => 'This verification has already been processed.',
            ], 400);
        }

        $validated = $request->validate([
            'notes' => ['required', 'string', 'min:10'],
        ]);

        $verification->update([
            'status' => 'rejected',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'admin_notes' => $validated['notes'],
        ]);

        // Update user identity status
        $verification->user->update(['identity_status' => 'rejected']);

        return response()->json([
            'message' => 'Identity verification rejected.',
            'verification' => $verification->load(['user', 'reviewer']),
        ]);
    }

    /**
     * Upload file to ImageKit
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $folderPath
     * @return string ImageKit URL
     * @throws \Exception
     */
    private function uploadToImageKit($file, $folderPath)
    {
        $publicKey = config('services.imagekit.public_key');
        $privateKey = config('services.imagekit.private_key');
        $urlEndpoint = config('services.imagekit.url_endpoint');

        if (empty($publicKey) || empty($privateKey) || empty($urlEndpoint)) {
            Log::error('ImageKit configuration missing for document upload');
            throw new \Exception('ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in your .env file.');
        }

        try {
            $imageKit = new ImageKit($publicKey, $privateKey, $urlEndpoint);
            
            // Read file contents
            $fileContents = file_get_contents($file->getRealPath());
            $fileName = $folderPath . '.' . $file->getClientOriginalExtension();
            
            // Upload to ImageKit
            $uploadResponse = $imageKit->upload([
                'file' => $fileContents,
                'fileName' => $fileName,
                'useUniqueFileName' => true,
                'folder' => '/identity_verifications',
            ]);

            if (isset($uploadResponse->success) && $uploadResponse->success) {
                return $uploadResponse->url;
            } else {
                $errorMessage = $uploadResponse->message ?? 'Unknown error during ImageKit upload';
                Log::error('ImageKit upload failed', [
                    'response' => $uploadResponse,
                    'file_name' => $fileName,
                ]);
                throw new \Exception('Failed to upload document to ImageKit: ' . $errorMessage);
            }
        } catch (\Exception $e) {
            Log::error('ImageKit upload exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new \Exception('Failed to upload document: ' . $e->getMessage());
        }
    }
}
