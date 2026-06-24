'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { TeamMemberCard } from '@/components/TeamMemberCard';

function formatWorkingDays(days: string[]): string {
  if (days.length === 0) return '';

  const order = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const labels: Record<string, string> = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
  };

  const sorted = [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const isConsecutive = sorted.every(
    (day, index) => index === 0 || order.indexOf(day) === order.indexOf(sorted[index - 1]) + 1,
  );

  if (isConsecutive && sorted.length > 1) {
    return `${labels[sorted[0]]}–${labels[sorted[sorted.length - 1]]}`;
  }

  return sorted.map((day) => labels[day] ?? day.slice(0, 3)).join(', ');
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

function ClockIcon() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function AboutPage() {
  const { t } = useLanguage();
  const barber = t.barber;
  const acceptedTeamMembers = barber.teamMembers.filter((member) => member.inviteAccepted);

  const workDays = formatWorkingDays(barber.workingDays);
  const workHours =
    workDays && barber.workStartTime && barber.workEndTime
      ? `${workDays}, ${barber.workStartTime}–${barber.workEndTime}`
      : '';

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
                <span className="text-4xl font-semibold text-gray-400">
                  {getInitials(barber.name)}
                </span>
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
            <span className={`text-sm ${barber.address ? '' : 'text-gray-400'}`}>
              {barber.address || t.common.locationNotSet}
            </span>
          </div>

          {barber.bio && (
            <p className="text-gray-600 leading-relaxed mt-4">{barber.bio}</p>
          )}

          {workHours && (
            <div className="flex items-start gap-2 text-sm text-gray-400 mt-4">
              <ClockIcon />
              <div>
                <p>{workHours}</p>
                {barber.breakStart && barber.breakEnd && (
                  <p>Break: {barber.breakStart}–{barber.breakEnd}</p>
                )}
              </div>
            </div>
          )}

          <Link
            href="/booking"
            className="inline-block mt-6 px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            {t.about.bookAppointment}
          </Link>
        </div>
      </div>

      {acceptedTeamMembers.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111111] mb-8">
            {t.about.theTeam}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {acceptedTeamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} variant="circle" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
