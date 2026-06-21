'use client';

import Image from 'next/image';
import type { BarberService } from '@/lib/mock';

interface ServiceCardProps {
  service: BarberService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="relative aspect-[4/3] bg-gray-100 flex-shrink-0">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl" aria-hidden>
              ✂️
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-base text-[#111111]">{service.name}</p>
        {service.description && (
          <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-3">
            {service.description}
          </p>
        )}
        <div className="mt-auto pt-3">
          <p className="font-semibold text-[#111111]">{service.priceDisplay}</p>
        </div>
      </div>
    </div>
  );
}
