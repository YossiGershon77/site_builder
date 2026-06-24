'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BarberService } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';
import { FALLBACK_SERVICE_IMAGE, getServiceById } from '@/lib/service-bank';

interface ServiceModalProps {
  service: BarberService | null;
  isOpen: boolean;
  onClose: () => void;
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0a9 9 0 0118 0z" />
    </svg>
  );
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  const { t } = useLanguage();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setShouldRender(false), 300);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || !service) return null;

  const bankItem = service.bankId ? getServiceById(service.bankId) : undefined;
  const imageUrl = service.imageUrl ?? bankItem?.defaultImageUrl ?? null;
  const bookingHref = service.bankId ? `/booking?service=${service.bankId}` : '/booking';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.serviceModal.closeDetails}
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl transition-all duration-300 ease-out sm:max-w-lg sm:rounded-2xl ${
          visible
            ? 'translate-y-0 opacity-100 sm:scale-100'
            : 'translate-y-full opacity-0 sm:translate-y-0 sm:scale-95'
        }`}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300 sm:hidden" />

        <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_SERVICE_IMAGE;
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">
              <span aria-hidden>{bankItem?.icon ?? '✂️'}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            aria-label={t.serviceModal.close}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#111111]">{service.name}</h2>

          <div className="mt-2 flex flex-wrap gap-4">
            {service.durationMinutes > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                <ClockIcon />
                {service.durationMinutes} {t.common.min}
              </span>
            )}
            {service.priceDisplay && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                {service.priceDisplay}
              </span>
            )}
          </div>

          {service.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{service.description}</p>
          )}

          {service.nameHe && (
            <p className="mt-2 text-sm text-gray-400">{service.nameHe}</p>
          )}

          <Link
            href={bookingHref}
            onClick={onClose}
            className="mt-6 block w-full rounded-xl bg-[#111111] py-3.5 text-center font-semibold text-white transition-colors hover:bg-gray-800"
          >
            {t.serviceModal.bookThisService}
          </Link>
        </div>
      </div>
    </div>
  );
}
