// TODO [ASAF]: Replace with real API call
'use client';

import Image from 'next/image';

interface ProfilePhotoUploaderProps {
  photo: string | null;
  onChange: (photo: string | null) => void;
  uploadLabel?: string;
  removeLabel?: string;
}

export function ProfilePhotoUploader({
  photo,
  onChange,
  uploadLabel = 'Upload photo',
  removeLabel = 'Remove',
}: ProfilePhotoUploaderProps) {
  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png|jpg|webp)$/i.test(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;

    if (photo?.startsWith('blob:')) {
      URL.revokeObjectURL(photo);
    }

    onChange(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50">
        {photo ? (
          photo.startsWith('blob:') || photo.startsWith('data:') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <Image src={photo} alt="Profile" fill className="object-cover" sizes="128px" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            👤
          </div>
        )}
      </div>
      <label className="mt-4 px-4 py-2 text-sm font-medium bg-[#111111] text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {uploadLabel}
      </label>
      {photo && (
        <button
          type="button"
          onClick={() => {
            if (photo.startsWith('blob:')) URL.revokeObjectURL(photo);
            onChange(null);
          }}
          className="mt-2 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          {removeLabel}
        </button>
      )}
    </div>
  );
}
