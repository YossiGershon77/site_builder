'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/context';
import { PageHeading } from '@/components/PageHeading';

export default function GalleryPage() {
  const { t } = useLanguage();
  const images = [...t.barber.galleryImages].sort((a, b) => {
    if (a.isFeatured) return -1;
    if (b.isFeatured) return 1;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <PageHeading title={t.gallery.title} />

      {images.length === 0 ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          {t.gallery.empty}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative rounded-xl overflow-hidden bg-gray-100 transition-shadow duration-200 hover:shadow-lg ${
                img.isFeatured ? 'ring-2 ring-black/10' : ''
              } ${img.isFeatured ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}
            >
              <Image
                src={img.url}
                alt={t.gallery.imageAlt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
