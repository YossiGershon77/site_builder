'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Modal } from '@/components/dashboard/Modal';
import type { BarberService } from '@/lib/mock';
import { FALLBACK_SERVICE_IMAGE, type ServiceBankItem } from '@/lib/service-bank';

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: ServiceBankItem | null;
  name: string;
  description: string;
  durationMinutes: number;
  barberService?: BarberService;
  showPrice: boolean;
  minLabel: string;
  bookLabel: string;
}

export function ServiceDetailModal({
  open,
  onClose,
  item,
  name,
  description,
  durationMinutes,
  barberService,
  showPrice,
  minLabel,
  bookLabel,
}: ServiceDetailModalProps) {
  if (!item) return null;

  const canBook = !!barberService;

  return (
    <Modal open={open} onClose={onClose} className="max-w-md p-0 overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={item.defaultImageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 448px"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_SERVICE_IMAGE;
          }}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#111111]">{name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {durationMinutes} {minLabel}
        </p>
        <p className="text-gray-600 mt-4 leading-relaxed">{description}</p>

        {showPrice && barberService && (
          <p className="text-lg font-semibold text-[#111111] mt-4">
            {barberService.priceDisplay}
          </p>
        )}

        {canBook ? (
          <Link
            href={`/booking?service=${item.id}`}
            onClick={onClose}
            className="mt-6 block w-full py-3.5 bg-[#111111] text-white text-center font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            {bookLabel}
          </Link>
        ) : (
          <p className="mt-6 text-sm text-center text-gray-400">
            {minLabel === 'דק׳'
              ? 'שירות זה אינו זמין כרגע לקביעת תור'
              : 'This service is not currently available for booking'}
          </p>
        )}
      </div>
    </Modal>
  );
}
