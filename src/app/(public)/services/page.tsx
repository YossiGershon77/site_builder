'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { PageHeading } from '@/components/PageHeading';
import { ServiceGrid } from '@/components/public/ServiceGrid';

export default function ServicesPage() {
  const { t } = useLanguage();
  const barber = t.barber;
  const activeServices = barber.services.filter((service) => service.isActive);

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <PageHeading
        label={barber.address || t.common.locationNotSet}
        title={t.services.title}
      />

      {activeServices.length === 0 ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          {t.services.comingSoon}
        </div>
      ) : (
        <ServiceGrid services={activeServices} />
      )}

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

    </div>
  );
}
