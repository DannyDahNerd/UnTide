import { useState } from "react";
import Loader from "@/components/shared/Loader"; // your Loader component

type ProfileUploaderProps = {
  fieldChange: (file: File) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [filePreview, setFilePreview] = useState<string>(mediaUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

      // Pass file back to parent form
      setIsUploading(true);
      fieldChange(file);

      // Fake upload time (optional if you want a smooth animation effect)
      setTimeout(() => {
        setIsUploading(false);
      }, 1500); // Adjust time if needed
    }
  };

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      {/* Profile Image */}
      <label
        htmlFor="profile-photo"
        className="relative w-full h-full cursor-pointer group"
      >
        <img
          src={filePreview}
          alt="profile photo"
          className="rounded-full object-cover w-full h-full group-hover:brightness-75 transition-all duration-300"
        />

        {/* Hover text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-semibold">Change Photo</p>
        </div>

        {/* Upload Spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <Loader />
          </div>
        )}
      </label>

      {/* Hidden File Input */}
      <input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileUploader;
