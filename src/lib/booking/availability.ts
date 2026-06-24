import type { MockBarber, TeamMember } from '@/lib/mock';
import { isMemberOff } from '@/lib/days-off/store';

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export interface MockBooking {
  memberId: string;
  date: string;
  time: string;
  durationMinutes: number;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function memberOffersService(member: TeamMember, serviceId: string): boolean {
  return member.services.some((entry) => entry.service.id === serviceId);
}

export function getQualifiedMembers(
  barber: MockBarber,
  serviceId: string,
  memberId: string | 'anyone',
): TeamMember[] {
  const activeMembers = barber.teamMembers.filter((m) => m.isActive && m.inviteAccepted);

  if (memberId === 'anyone') {
    return activeMembers.filter((m) => memberOffersService(m, serviceId));
  }

  const member = activeMembers.find((m) => m.id === memberId);
  return member && memberOffersService(member, serviceId) ? [member] : [];
}

function generateDaySlots(
  durationMinutes: number,
  bufferMinutes: number,
  workStart: string,
  workEnd: string,
  breakStart: string | null,
  breakEnd: string | null,
): string[] {
  const slots: string[] = [];
  const start = timeToMinutes(workStart);
  const end = timeToMinutes(workEnd);
  const hasBreak = !!breakStart && !!breakEnd;
  const breakFrom = hasBreak ? timeToMinutes(breakStart) : 0;
  const breakTo = hasBreak ? timeToMinutes(breakEnd) : 0;
  const step = durationMinutes + bufferMinutes;

  let current = start;
  while (current + durationMinutes <= end) {
    const slotEnd = current + durationMinutes;
    if (hasBreak && current < breakTo && slotEnd > breakFrom) {
      current = breakTo;
      continue;
    }
    slots.push(minutesToTime(current));
    current += step;
  }

  return slots;
}

function slotsOverlap(
  slotStart: number,
  slotEnd: number,
  bookingStart: number,
  bookingEnd: number,
): boolean {
  return slotStart < bookingEnd && slotEnd > bookingStart;
}

function isSlotBooked(
  memberId: string,
  dateKey: string,
  slotTime: string,
  durationMinutes: number,
  bookings: MockBooking[],
): boolean {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + durationMinutes;

  return bookings.some((booking) => {
    if (booking.memberId !== memberId || booking.date !== dateKey) return false;
    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + booking.durationMinutes;
    return slotsOverlap(slotStart, slotEnd, bookingStart, bookingEnd);
  });
}

export function isWorkingDay(date: Date, workingDays: string[]): boolean {
  return workingDays.some((day) => DAY_INDEX[day] === date.getDay());
}

export function getAvailableSlots(
  barber: MockBarber,
  serviceId: string,
  memberId: string | 'anyone',
  date: Date,
  durationMinutes: number,
  bookings: MockBooking[],
): string[] {
  if (!isWorkingDay(date, barber.workingDays)) return [];

  let qualifiedMembers = getQualifiedMembers(barber, serviceId, memberId);
  qualifiedMembers = qualifiedMembers.filter((member) => !isMemberOff(member.id, date));
  const isSoloBarber = barber.teamMembers.filter((m) => m.isActive && m.inviteAccepted).length === 0;

  if (memberId !== 'anyone' && isMemberOff(memberId, date)) return [];

  if (qualifiedMembers.length === 0 && !isSoloBarber) return [];

  const dateKey = formatDateKey(date);
  const allSlots = generateDaySlots(
    durationMinutes,
    barber.bufferMinutes,
    barber.workStartTime,
    barber.workEndTime,
    barber.breakStart,
    barber.breakEnd,
  );

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return allSlots.filter((slot) => {
    if (isToday && timeToMinutes(slot) <= nowMinutes) return false;
    if (isSoloBarber) return true;

    return qualifiedMembers.some(
      (member) => !isSlotBooked(member.id, dateKey, slot, durationMinutes, bookings),
    );
  });
}

export function getMockBookings(): MockBooking[] {
  const today = formatDateKey(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    { memberId: 't1', date: today, time: '10:00', durationMinutes: 60 },
    { memberId: 't1', date: today, time: '14:00', durationMinutes: 45 },
    { memberId: 't2', date: today, time: '11:15', durationMinutes: 30 },
    { memberId: 't3', date: today, time: '12:00', durationMinutes: 30 },
    { memberId: 't4', date: today, time: '15:30', durationMinutes: 60 },
    { memberId: 't2', date: formatDateKey(tomorrow), time: '10:30', durationMinutes: 45 },
    { memberId: 't4', date: formatDateKey(tomorrow), time: '14:00', durationMinutes: 30 },
  ];
}

export function isDateUnavailableForBooking(
  barber: MockBarber,
  serviceId: string,
  memberId: string | 'anyone',
  date: Date,
  durationMinutes: number,
  bookings: MockBooking[],
): boolean {
  return getAvailableSlots(
    barber,
    serviceId,
    memberId,
    date,
    durationMinutes,
    bookings,
  ).length === 0;
}

export function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}
