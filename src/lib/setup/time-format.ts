import type { Locale } from '@/lib/i18n/translations';

export function formatTimeForLocale(time: string, locale: Locale): string {
  if (!time) return time;
  if (locale === 'he') return time;

  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}
