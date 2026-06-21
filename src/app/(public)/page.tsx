'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { TeamMemberCard } from '@/components/TeamMemberCard';

export default function HomePage() {
  const { t } = useLanguage();
  const barber = t.barber;
  const previewServices = barber.services.slice(0, 3);
  const hasTeam = barber.teamMembers.length > 0;

  return (
    <div>
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={barber.heroImageUrl}
          alt={barber.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white">
            {barber.name}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mt-3">{barber.tagline}</p>
          <p className="text-xs uppercase tracking-widest text-white/60 mt-2">
            {barber.neighborhood}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-3 bg-white text-[#111111] font-semibold rounded-full hover:bg-gray-50 transition-colors"
            >
              {t.common.bookNow}
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-3 border border-white/70 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              {t.common.viewServices}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111111] mb-6">
            {t.home.whatWeDo}
          </h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {previewServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <p className="font-medium text-[#111111]">{service.name}</p>
                <p className="font-semibold text-[#111111]">{service.priceDisplay}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link
              href="/services"
              className="text-sm text-gray-500 hover:text-[#111111] transition-colors"
            >
              {t.home.seeAllServices}
            </Link>
          </div>
        </div>
      </section>

      {hasTeam && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold tracking-tight text-[#111111] mb-8">
              {t.home.theTeam}
            </h2>
            <div className="flex flex-wrap gap-10">
              {barber.teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} variant="circle" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-[#111111]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6">
            {t.home.ctaTitle}
          </h2>
          <Link
            href="/booking"
            className="inline-block px-8 py-3 bg-white text-[#111111] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            {t.common.bookNow}
          </Link>
        </div>
      </section>
    </div>
  );
}
