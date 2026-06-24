export const SETUP_DOMAIN = 'mysite.co.il';

export const DAY_OPTIONS = [
  { key: 'Sunday', label: 'Sun', labelHe: 'א׳' },
  { key: 'Monday', label: 'Mon', labelHe: 'ב׳' },
  { key: 'Tuesday', label: 'Tue', labelHe: 'ג׳' },
  { key: 'Wednesday', label: 'Wed', labelHe: 'ד׳' },
  { key: 'Thursday', label: 'Thu', labelHe: 'ה׳' },
  { key: 'Friday', label: 'Fri', labelHe: 'ו׳' },
  { key: 'Saturday', label: 'Sat', labelHe: 'ש׳' },
] as const;

export const DEFAULT_SERVICE_PRICES: Record<string, number> = {
  'cuts-haircut': 80,
  'cuts-fade': 100,
  'cuts-buzz': 50,
  'cuts-kids': 60,
  'cuts-head-shave': 70,
  'cuts-design': 120,
  'beard-trim': 50,
  'beard-razor-shave': 80,
  'beard-mustache': 30,
  'combo-cut-beard': 120,
  'treat-wash-style': 40,
  'treat-color': 150,
  'treat-keratin': 350,
  'extra-nose-ear': 30,
  'extra-japanese': 500,
};

export function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 5; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 23 && minute > 45) break;
      options.push(
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      );
    }
  }
  return options;
}

export const TIME_OPTIONS = generateTimeOptions();

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatWorkingDaysSummary(days: string[]): string {
  if (days.length === 0) return '';
  const order = DAY_OPTIONS.map((d) => d.key);
  const sorted = [...days].sort(
    (a, b) => order.indexOf(a as (typeof order)[number]) - order.indexOf(b as (typeof order)[number]),
  );
  const indices = sorted.map((d) => order.indexOf(d as (typeof order)[number]));
  const labels = sorted.map(
    (d) => DAY_OPTIONS.find((opt) => opt.key === d)?.label ?? d.slice(0, 3),
  );

  if (labels.length === 1) return labels[0];

  const isConsecutive =
    indices.length > 1 &&
    indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1);

  if (isConsecutive) {
    return `${labels[0]}–${labels[labels.length - 1]}`;
  }

  return labels.join(', ');
}
