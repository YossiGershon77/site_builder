import type { Appointment, MockBarber, MockUser, TeamMember } from '@/lib/mock';

export const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const DAY_LABELS: Record<string, string> = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
};
export const DAY_LABELS_HE: Record<string, string> = {
  Sunday: 'א׳',
  Monday: 'ב׳',
  Tuesday: 'ג׳',
  Wednesday: 'ד׳',
  Thursday: 'ה׳',
  Friday: 'ו׳',
  Saturday: 'ש׳',
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDateHeading(date: Date, locale: 'he' | 'en' = 'en'): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const localeCode = locale === 'he' ? 'he-IL' : 'en-US';
  if (target.getTime() === today.getTime()) {
    const formatted = date.toLocaleDateString(localeCode, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return locale === 'he' ? `היום (${formatted})` : `Today (${formatted})`;
  }

  return date.toLocaleDateString(localeCode, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function filterAppointmentsForDay(
  appointments: readonly Appointment[],
  date: Date,
  user: MockUser,
  staffFilter: string = 'all',
): Appointment[] {
  return appointments
    .filter((appt) => isSameDay(appt.startTime, date))
    .filter((appt) => {
      if (user.role === 'OWNER') {
        if (staffFilter === 'all') return true;
        if (staffFilter === 'owner') return appt.teamMember === null;
        return appt.teamMember?.id === staffFilter;
      }
      if (!user.teamMemberId) return false;
      return appt.teamMember === null || appt.teamMember.id === user.teamMemberId;
    })
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

export function getGapMinutes(prev: Appointment, next: Appointment): number {
  return (next.startTime.getTime() - prev.endTime.getTime()) / 60000;
}

export function getNextAvailableSlot(
  appointments: Appointment[],
  barber: MockBarber,
  date: Date,
): string | null {
  const dayAppts = appointments.filter((a) => isSameDay(a.startTime, date) && a.status !== 'CANCELLED');
  const [startH, startM] = barber.workStartTime.split(':').map(Number);
  const [endH, endM] = barber.workEndTime.split(':').map(Number);
  const dayStart = new Date(date);
  dayStart.setHours(startH, startM, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(endH, endM, 0, 0);

  let cursor = dayStart;
  const now = new Date();
  if (isSameDay(date, now) && cursor < now) cursor = now;

  for (const appt of dayAppts.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())) {
    if (cursor < appt.startTime) return formatTime(cursor);
    if (appt.endTime > cursor) cursor = appt.endTime;
  }

  if (cursor < dayEnd) return formatTime(cursor);
  return null;
}

export function formatWorkingDaysSummary(
  days: string[] | null,
  labels: Record<string, string> = DAY_LABELS,
  emptyLabel = 'No days set',
): string {
  if (!days || days.length === 0) return emptyLabel;

  const indices = days
    .map((day) => DAY_ORDER.indexOf(day as (typeof DAY_ORDER)[number]))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);

  if (indices.length === 0) return emptyLabel;

  const ranges: string[] = [];
  let start = indices[0];
  let end = indices[0];

  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === end + 1) {
      end = indices[i];
    } else {
    ranges.push(formatDayRange(start, end, labels));
      start = indices[i];
      end = indices[i];
    }
  }
  ranges.push(formatDayRange(start, end, labels));
  return ranges.join(', ');
}

function formatDayRange(start: number, end: number, labels: Record<string, string>): string {
  if (start === end) return labels[DAY_ORDER[start]];
  return `${labels[DAY_ORDER[start]]}–${labels[DAY_ORDER[end]]}`;
}

export function formatHoursSummary(
  member: TeamMember,
  options?: {
    dayLabels?: Record<string, string>;
    noDaysSet?: string;
    hoursNotSet?: string;
    breakLabel?: string;
  },
): string {
  if (!member.workingDays || !member.workStartTime || !member.workEndTime) {
    return options?.hoursNotSet ?? 'Hours not set';
  }
  const days = formatWorkingDaysSummary(
    member.workingDays,
    options?.dayLabels ?? DAY_LABELS,
    options?.noDaysSet ?? 'No days set',
  );
  let summary = `${days}, ${member.workStartTime}–${member.workEndTime}`;
  if (member.breakStart && member.breakEnd) {
    summary += `, ${options?.breakLabel ?? 'break'} ${member.breakStart}–${member.breakEnd}`;
  }
  return summary;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
