'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { GalleryStrip } from '@/components/public/GalleryStrip';
import { ServiceGrid } from '@/components/public/ServiceGrid';
import type { MockBarber } from '@/lib/mock';

function getPopularServices(barber: MockBarber) {
  const counts = new Map<string, number>();

  for (const appointment of barber.appointments ?? []) {
    if (appointment.status === 'CANCELLED') continue;
    counts.set(appointment.service.id, (counts.get(appointment.service.id) ?? 0) + 1);
  }

  return [...barber.services]
    .filter((service) => service.isActive)
    .sort((a, b) => {
      const countDiff = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
      return countDiff || a.displayOrder - b.displayOrder;
    })
    .slice(0, 3);
}

export default function HomePage() {
  const { t } = useLanguage();
  const barber = t.barber;
  const previewServices = getPopularServices(barber);
  const acceptedTeamMembers = barber.teamMembers.filter((member) => member.inviteAccepted);
  const hasTeam = acceptedTeamMembers.length > 0;

  return (
    <div>
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden">
        {barber.heroImageUrl ? (
          <Image
            src={barber.heroImageUrl}
            alt={barber.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white">
            {barber.name}
          </h1>
          {barber.tagline && (
            <p className="text-lg md:text-xl text-white/80 mt-3">{barber.tagline}</p>
          )}
          <p className="text-xs uppercase tracking-widest text-white/60 mt-2">
            {barber.address || t.common.locationNotSet}
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

      <GalleryStrip images={barber.galleryImages} />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111111] mb-6">
            {t.home.whatWeDo}
          </h2>
          <ServiceGrid
            services={previewServices}
            columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
              {acceptedTeamMembers.map((member) => (
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
