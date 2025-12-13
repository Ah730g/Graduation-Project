import React, { useState } from 'react';
import ImageKit from 'imagekit-javascript';
import { useUserContext } from '../contexts/UserContext';
import AxiosClient from '../AxiosClient';
import { v4 as uuidv4 } from 'uuid';

export default function UploadWidget({ setAvatarURL, isMultiple = true }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useUserContext();

  const imagekit = new ImageKit({
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  });

  // SELECT MULTIPLE FILES
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    setPreviews(selectedFiles.map((f) => URL.createObjectURL(f)));
  };

  // UPLOAD MULTIPLE FILES
  const handleUpload = async () => {
    if (files.length === 0) return alert('Select at least one image');

    setUploading(true);

    try {
      const uploadedURLs = [];

      for (let f of files) {
        const auth = await AxiosClient.get('/imagekit/auth');
        const fileName = `user_${user.id}_${uuidv4()}_${f.name}`;

        const res = await imagekit.upload({
          file: f,
          fileName,
          ...auth.data,
        });

        uploadedURLs.push(res.url);
      }

      // send URLs to parent component
      setAvatarURL(uploadedURLs);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 flex-wrap justify-center">
        {previews &&
          previews.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-[calc(50%-12px)] rounded-md object-cover"
            />
          ))}
        {!isMultiple && !previews && (
          <img
            src={user.avatar || 'avatar.png'}
            className="w-[calc(50%-12px)] rounded-md object-cover"
          />
        )}
      </div>

      <div className="flex gap-4 justify-between mt-3">
        <label
          htmlFor="img"
          className="cursor-pointer w-1/2 border bg-[#3b82f6] py-3 px-5 text-white 
          rounded-md font-semibold text-center hover:bg-[#135dd3] transition"
        >
          <input
            type="file"
            accept="image/*"
            id="img"
            multiple={isMultiple}
            onChange={handleFileChange}
            className="hidden"
          />
          Choose Images
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="border bg-[#3b82f6] py-3 px-5 text-white rounded-md font-semibold 
          disabled:bg-[#444] flex-1 hover:bg-[#135dd3] transition"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>
    </div>
  );
}
