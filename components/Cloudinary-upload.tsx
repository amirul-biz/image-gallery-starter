'use client'; // for app directory or if using React 18 features

import { CldUploadWidget } from 'next-cloudinary';

export default function UploadButton() {
  return (
    <CldUploadWidget
    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
    signatureEndpoint="/api/api-file-upload"
      options={{
        folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'amirul-aisyah'
      }}
    >
      {({ open }) => (
        <button className="btn btn-blue" onClick={() => open()} type="button">
          Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
}
