// TODO [ASAF]: Replace with real API call
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { SetupGalleryPhoto } from '@/lib/mock';

interface PhotoUploaderProps {
  photos: SetupGalleryPhoto[];
  onChange: (photos: SetupGalleryPhoto[]) => void;
  clickUploadLabel?: string;
  fileTypesLabel?: string;
  photoHintLabel?: string;
}

function isLocalUrl(url: string) {
  return url.startsWith('blob:') || url.startsWith('data:');
}

function PhotoThumbnail({ url }: { url: string }) {
  if (isLocalUrl(url)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
    );
  }

  return <Image src={url} alt="" fill className="object-cover" sizes="150px" />;
}

export function PhotoUploader({
  photos,
  onChange,
  clickUploadLabel = 'Click or drag photos here',
  fileTypesLabel = 'JPG, PNG up to 5MB each',
  photoHintLabel = 'We recommend at least 3 photos for the best looking gallery',
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addPhotosFromFiles(files: FileList | null) {
    if (!files) return;

    const newPhotos: SetupGalleryPhoto[] = [];

    Array.from(files).forEach((file) => {
      if (!/^image\/(jpeg|png|jpg|webp)$/i.test(file.type)) return;
      if (file.size > 5 * 1024 * 1024) return;

      const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const url = URL.createObjectURL(file);
      newPhotos.push({
        id,
        url,
        isFeatured: photos.length === 0 && newPhotos.length === 0,
      });
    });

    if (newPhotos.length > 0) {
      onChange([...photos, ...newPhotos]);
    }
  }

  function removePhoto(id: string) {
    const removed = photos.find((p) => p.id === id);
    if (removed?.url.startsWith('blob:')) {
      URL.revokeObjectURL(removed.url);
    }

    const next = photos.filter((p) => p.id !== id);
    if (next.length > 0 && !next.some((p) => p.isFeatured)) {
      next[0] = { ...next[0], isFeatured: true };
    }
    onChange(next);
  }

  function setFeatured(id: string) {
    onChange(photos.map((p) => ({ ...p, isFeatured: p.id === id })));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          addPhotosFromFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addPhotosFromFiles(e.dataTransfer.files);
        }}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
      >
        <span className="text-3xl block mb-2" aria-hidden>📷</span>
        <p className="text-sm font-medium text-[#111111]">{clickUploadLabel}</p>
        <p className="text-xs text-gray-400 mt-1">{fileTypesLabel}</p>
      </button>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`relative aspect-square rounded-lg overflow-hidden group ${
                photo.isFeatured ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <PhotoThumbnail url={photo.url} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                <button
                  type="button"
                  onClick={() => setFeatured(photo.id)}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Set as featured"
                >
                  ⭐
                </button>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove"
                >
                  ✕
                </button>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  ⠿
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && photos.length < 3 && (
        <div className="mt-3 rounded-lg p-3 bg-yellow-50 text-yellow-600 text-sm">
          {photoHintLabel}
        </div>
      )}
    </div>
  );
}
