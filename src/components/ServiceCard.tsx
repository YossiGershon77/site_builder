'use client';

import Image from 'next/image';
import type { BarberService } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';
import { FALLBACK_SERVICE_IMAGE, getServiceById } from '@/lib/service-bank';

interface ServiceCardProps {
  service: BarberService;
  onClick?: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const { t } = useLanguage();
  const bankItem = service.bankId ? getServiceById(service.bankId) : undefined;
  const imageUrl = service.imageUrl ?? bankItem?.defaultImageUrl ?? null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group h-full w-full cursor-pointer overflow-hidden rounded-xl border border-gray-100 text-start transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-gray-100 flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_SERVICE_IMAGE;
            }}
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
          {service.priceDisplay && (
            <p className="font-semibold text-[#111111]">{service.priceDisplay}</p>
          )}
          {service.showDuration && (
            <p className="text-sm text-gray-500">
              {service.durationMinutes} {t.common.min}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
