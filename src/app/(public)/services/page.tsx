'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { mockBarber } from '@/lib/mock';
import { PageHeading } from '@/components/PageHeading';
import { ServiceBankCard } from '@/components/ServiceBankCard';
import { ServiceDetailModal } from '@/components/ServiceDetailModal';
import {
  CATEGORY_META,
  getAllCategories,
  getLocalizedServiceBankItem,
  getServicesByCategory,
  type ServiceBankItem,
} from '@/lib/service-bank';

export default function ServicesPage() {
  const { t, locale } = useLanguage();
  const barber = t.barber;
  const [selectedItem, setSelectedItem] = useState<ServiceBankItem | null>(null);

  const barberByBankId = useMemo(
    () =>
      new Map(
        mockBarber.services
          .filter((service) => service.bankId)
          .map((service) => [service.bankId!, service]),
      ),
    [],
  );

  const selectedBarberService = selectedItem
    ? barberByBankId.get(selectedItem.id)
    : undefined;
  const selectedLocalized = selectedItem
    ? getLocalizedServiceBankItem(selectedItem, locale)
    : null;
  const selectedDuration =
    selectedBarberService?.durationMinutes ??
    selectedItem?.defaultDurationMinutes ??
    0;

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <PageHeading label={barber.neighborhood} title={t.services.title} />

      <div className="space-y-14">
        {getAllCategories().map((category) => {
          const meta = CATEGORY_META[category];
          const items = getServicesByCategory(category);

          return (
            <section key={category}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-[#111111]">
                  {locale === 'he' ? meta.labelHe : meta.label}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{meta.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {items.map((item) => {
                  const barberService = barberByBankId.get(item.id);
                  const localized = getLocalizedServiceBankItem(item, locale);
                  const durationMinutes =
                    barberService?.durationMinutes ?? item.defaultDurationMinutes;

                  return (
                    <ServiceBankCard
                      key={item.id}
                      item={item}
                      barberService={barberService}
                      showPrice={barber.showPrices}
                      name={localized.displayName}
                      durationMinutes={durationMinutes}
                      minLabel={t.common.min}
                      onClick={() => setSelectedItem(item)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[#111111]">
          {t.services.readyToBook}
        </h2>
        <p className="text-gray-500 mt-2">{t.services.chooseService}</p>
        <Link
          href="/booking"
          className="inline-block mt-6 px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
        >
          {t.common.bookNow}
        </Link>
      </div>

      <ServiceDetailModal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        name={selectedLocalized?.displayName ?? ''}
        description={selectedLocalized?.displayDescription ?? ''}
        durationMinutes={selectedDuration}
        barberService={selectedBarberService}
        showPrice={barber.showPrices}
        minLabel={t.common.min}
        bookLabel={t.common.bookNow}
      />
    </div>
  );
}
