<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageKitController;
use App\Http\Controllers\postController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\SavedPostController;
use App\Http\Controllers\userController;
use App\Models\SavedPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("/signup",[AuthController::class, "signup"]);
Route::post("/login",[AuthController::class, "login"]);
Route::apiResource("/post",postController::class);
Route::get("/user-posts/{id}",[userController::class,"getUserPosts"]);
Route::get("/property",[PropertyController::class,"index"]);
Route::get("/is-post-saved",[SavedPostController::class,"isPostSaved"]);

Route::middleware("auth:sanctum")->group(function () {

        Route::post("/logout",[AuthController::class, "Logout"]);
        Route::get("/user",function(Request $request){
            return $request->user();
        });
        Route::apiResource("/users",userController::class);
        Route::get('/imagekit/auth', [ImageKitController::class, 'auth']);
        Route::post("/saved-posts",[SavedPostController::class,"store"]);
        Route::get("/saved-posts/{id}",[SavedPostController::class,"index"]);

        Route::delete("/saved-posts",[SavedPostController::class,"destroy"]);

}
);

