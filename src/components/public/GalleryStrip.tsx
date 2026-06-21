'use client';

import Image from 'next/image';
import Link from 'next/link';

interface GalleryStripProps {
  images: { id: string; url: string }[];
  linkTo?: string;
}

function buildLoopImages(images: GalleryStripProps['images']) {
  if (images.length === 0) return [];

  const baseImages = [...images];
  while (baseImages.length < 6) {
    baseImages.push(...images);
  }

  return [...baseImages, ...baseImages];
}

export function GalleryStrip({ images, linkTo = '/gallery' }: GalleryStripProps) {
  if (images.length === 0) return null;

  const loopImages = buildLoopImages(images);
  const cycleDuration = Math.max(images.length, 3) * 4;

  return (
    <div
      className="w-full overflow-x-auto overflow-y-hidden bg-white scrollbar-hide [-webkit-overflow-scrolling:touch] group"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      <div
        className="flex w-max gap-[6px] animate-gallery-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${cycleDuration}s` }}
      >
        {loopImages.map((image, index) => (
          <Link
            key={`${image.id}-${index}`}
            href={linkTo}
            className="relative h-[180px] w-[200px] md:h-[280px] md:w-[320px] flex-shrink-0 overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-white after:opacity-0 after:shadow-[0_0_10px_rgba(255,255,255,0.9)] after:transition-opacity after:duration-500 hover:after:opacity-100"
            aria-label="Open gallery"
          >
            <Image
              src={image.url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
              sizes="(max-width: 768px) 200px, 320px"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
