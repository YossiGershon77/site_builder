'use client';

import Image from 'next/image';
import type { BarberService } from '@/lib/mock';
import type { ServiceBankItem } from '@/lib/service-bank';

interface ServiceBankCardProps {
  item: ServiceBankItem;
  barberService?: BarberService;
  showPrice: boolean;
  name: string;
  durationMinutes: number;
  minLabel: string;
  onClick: () => void;
}

export function ServiceBankCard({
  item,
  barberService,
  showPrice,
  name,
  durationMinutes,
  minLabel,
  onClick,
}: ServiceBankCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col text-start w-full"
    >
      <div className="relative aspect-[4/3] bg-gray-100 flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-base text-[#111111]">{name}</p>
        <p className="text-sm text-gray-500 mt-1">
          {durationMinutes} {minLabel}
        </p>
        {showPrice && barberService && (
          <div className="mt-auto pt-3">
            <p className="font-semibold text-[#111111]">{barberService.priceDisplay}</p>
          </div>
        )}
      </div>
    </button>
  );
}
