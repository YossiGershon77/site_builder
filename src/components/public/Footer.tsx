'use client';

import type { MockBarber } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';

interface FooterProps {
  barber: MockBarber;
}

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_LABELS: Record<string, string> = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
};
const DAY_LABELS_HE: Record<string, string> = {
  Sunday: 'א׳',
  Monday: 'ב׳',
  Tuesday: 'ג׳',
  Wednesday: 'ד׳',
  Thursday: 'ה׳',
  Friday: 'ו׳',
  Saturday: 'ש׳',
};

function formatWorkingDays(days: string[], labels: Record<string, string>): string {
  if (days.length === 0) return '';

  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const isConsecutive = sorted.every(
    (day, index) =>
      index === 0 || DAY_ORDER.indexOf(day) === DAY_ORDER.indexOf(sorted[index - 1]) + 1,
  );

  if (isConsecutive && sorted.length > 1) {
    return `${labels[sorted[0]]}–${labels[sorted[sorted.length - 1]]}`;
  }

  return sorted.map((day) => labels[day] ?? day.slice(0, 3)).join(', ');
}

function Icon({
  children,
  className = 'text-gray-300',
  size = 14,
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M9 11a3 3 0 106 0a3 3 0 00-6 0" />
      <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    </Icon>
  );
}

function ClockIcon() {
  return (
    <Icon>
      <path d="M12 7v5l3 3" />
      <path d="M21 12a9 9 0 11-18 0a9 9 0 0118 0z" />
    </Icon>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="shrink-0 text-[#25D366]"
      width={14}
      height={14}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12.04 2C6.56 2 2.1 6.45 2.1 11.93c0 1.75.46 3.46 1.34 4.97L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.48 0 9.94-4.45 9.94-9.93C21.99 6.45 17.53 2 12.04 2zm5.84 14.19c-.25.7-1.47 1.34-2.03 1.39-.52.05-1.17.07-1.89-.12-.44-.12-1-.33-1.72-.65-3.03-1.31-5-4.36-5.15-4.56-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38h.58c.18.01.43-.07.67.51.25.6.85 2.08.92 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.16 1.36 2.46 1.51.3.15.48.13.66-.08.2-.23.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.36.08.13.08.75-.17 1.48z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <Icon size={18} className="text-gray-300 transition-colors group-hover:text-gray-600">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3" />
      <path d="M16.5 7.5h.01" />
    </Icon>
  );
}

function FacebookIcon() {
  return (
    <Icon size={18} className="text-gray-300 transition-colors group-hover:text-gray-600">
      <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </Icon>
  );
}

export function Footer({ barber }: FooterProps) {
  const { locale, t } = useLanguage();
  const days = formatWorkingDays(
    barber.workingDays,
    locale === 'he' ? DAY_LABELS_HE : DAY_LABELS,
  );
  const hours =
    days && barber.workStartTime && barber.workEndTime
      ? `${days}, ${barber.workStartTime}–${barber.workEndTime}`
      : '';
  const whatsappHref = `https://wa.me/${barber.whatsappNumber.replace(/[\s-]/g, '')}`;
  const instagramUrl = barber.instagramUrl?.trim() || null;
  const facebookUrl = barber.facebookUrl?.trim() || null;
  const hasSocials = !!instagramUrl || !!facebookUrl;
  const addressText = barber.address || t.footer.locationComingSoon;

  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-start">
          <div className="flex flex-col items-start">
            <p className="text-lg font-semibold text-gray-900 tracking-tight">{barber.name}</p>
            {barber.tagline && (
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{barber.tagline}</p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <MapPinIcon />
                {barber.googleMapsUrl ? (
                  <a
                    href={barber.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {addressText}
                  </a>
                ) : (
                  <span className={`text-sm ${barber.address ? 'text-gray-500' : 'text-gray-300'}`}>
                    {addressText}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2">
                <ClockIcon />
                <span className={`text-sm ${hours ? 'text-gray-500' : 'text-gray-300'}`}>
                  {hours || t.footer.hoursComingSoon}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h2 className="uppercase text-xs tracking-widest text-gray-400 font-medium mb-3">
              {t.footer.getInTouch}
            </h2>
            <div className="flex flex-col items-start gap-2">
              {barber.whatsappNumber && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <WhatsAppIcon />
                  {t.footer.whatsappUs}
                </a>
              )}

              {hasSocials && (
                <div className="flex flex-wrap items-center gap-3">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label={t.footer.instagram}
                  >
                    <InstagramIcon />
                    {t.footer.ourInstagram}
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label={t.footer.facebook}
                  >
                    <FacebookIcon />
                  </a>
                )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-center">
          <p className="text-xs text-gray-300">© 2026 {barber.name}</p>
          <a href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            {t.common.poweredBy}
          </a>
        </div>
      </div>
    </footer>
  );
}
