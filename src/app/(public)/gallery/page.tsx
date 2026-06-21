'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/context';
import { PageHeading } from '@/components/PageHeading';

export default function GalleryPage() {
  const { t } = useLanguage();
  const images = t.barber.galleryImages;

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <PageHeading title={t.gallery.title} />

      {images.length === 0 ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          {t.gallery.empty}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`break-inside-avoid mb-4 rounded-xl overflow-hidden ${
                img.isFeatured ? 'ring-2 ring-black/10' : ''
              }`}
            >
              <Image
                src={img.url}
                alt={t.gallery.imageAlt}
                width={img.isFeatured ? 1200 : 600}
                height={img.isFeatured ? 800 : 750}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
