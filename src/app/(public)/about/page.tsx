'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { TeamMemberCard } from '@/components/TeamMemberCard';

function formatWorkingDays(days: string[], locale: 'he' | 'en'): string {
  if (days.length === 0) return '';

  if (locale === 'he') {
    const hebrewDays: Record<string, string> = {
      Sunday: 'א',
      Monday: 'ב',
      Tuesday: 'ג',
      Wednesday: 'ד',
      Thursday: 'ה',
      Friday: 'ו',
      Saturday: 'ש',
    };
    const first = hebrewDays[days[0]] ?? days[0].substring(0, 3);
    const last = hebrewDays[days[days.length - 1]] ?? days[days.length - 1].substring(0, 3);
    return first === last ? first : `${first}–${last}`;
  }

  const first = days[0].substring(0, 3);
  const last = days[days.length - 1].substring(0, 3);
  return first === last ? first : `${first}–${last}`;
}

function MapPinIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export default function AboutPage() {
  const { t, locale } = useLanguage();
  const barber = t.barber;

  const initials = barber.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const workDays = formatWorkingDays(barber.workingDays, locale);
  const workHours = `${workDays}, ${barber.workStartTime}–${barber.workEndTime}`;

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {barber.profileImageUrl ? (
              <Image
                src={barber.profileImageUrl}
                alt={barber.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-semibold text-gray-400">{initials}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            {t.about.label}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            {barber.name}
          </h1>

          <div className="flex items-center gap-1.5 mt-1 text-gray-500">
            <MapPinIcon />
            <span className="text-sm">{barber.neighborhood}</span>
          </div>

          <p className="text-gray-600 leading-relaxed mt-4">{barber.bio}</p>

          <p className="text-sm text-gray-400 mt-4">🗓 {workHours}</p>

          <Link
            href="/booking"
            className="inline-block mt-6 px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            {t.about.bookAppointment}
          </Link>
        </div>
      </div>

      {barber.teamMembers.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111111] mb-8">
            {t.about.theTeam}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {barber.teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} variant="circle" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
