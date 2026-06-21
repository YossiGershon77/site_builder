export interface DayOff {
  id: string;
  date: string;
  memberId: string;
  name: string;
}

export const OWNER_MEMBER_ID = 'owner';

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateKeyOffset(dayOffset: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  return formatDateKey(date);
}

export function isSameDayKey(date: Date, dateKey: string): boolean {
  return formatDateKey(date) === dateKey;
}
