'use client';

import { useState } from 'react';
import { formatDateKey, isSameDayKey } from '@/lib/days-off/types';
import { toggleDayOff, useDaysOff } from '@/lib/days-off/store';

interface DaysOffCalendarProps {
  memberId: string;
  memberName: string;
  workingDays?: string[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export function DaysOffCalendar({ memberId, memberName, workingDays }: DaysOffCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const { daysOff } = useDaysOff();

  const markedDates = new Set(
    daysOff.filter((entry) => entry.memberId === memberId).map((entry) => entry.date),
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  function isWorkingDay(date: Date): boolean {
    if (!workingDays || workingDays.length === 0) return true;
    return workingDays.some((day) => DAY_INDEX[day] === date.getDay());
  }

  function handleToggleDay(day: number) {
    const date = new Date(year, month, day);
    if (date < today) return;
    toggleDayOff(memberId, memberName, date);
  }

  function shiftMonth(delta: number) {
    setViewMonth(new Date(year, month + delta, 1));
  }

  const markedCount = [...markedDates].filter((key) => {
    const [y, m] = key.split('-').map(Number);
    return y === year && m === month + 1;
  }).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:sticky lg:top-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111111]">Days off</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tap a date to mark it as unavailable for bookings.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#111111] text-sm">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={year === today.getFullYear() && month === today.getMonth()}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, idx) => (
          <div key={idx} className="aspect-square flex items-center justify-center">
            {day !== null && (() => {
              const date = new Date(year, month, day);
              const past = date < today;
              const dateKey = formatDateKey(date);
              const marked = markedDates.has(dateKey);
              const isToday = isSameDayKey(date, formatDateKey(today));
              const isRegularWorkDay = isWorkingDay(date);

              return (
                <button
                  type="button"
                  onClick={() => !past && handleToggleDay(day)}
                  disabled={past}
                  title={
                    past
                      ? undefined
                      : marked
                      ? 'Remove day off'
                      : 'Mark as day off'
                  }
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors ${
                    marked
                      ? 'bg-amber-100 text-amber-800 font-semibold ring-1 ring-amber-300'
                      : isToday
                      ? 'ring-1 ring-[#111111] text-[#111111] font-semibold hover:bg-gray-100'
                      : past
                      ? 'text-gray-300 cursor-not-allowed'
                      : isRegularWorkDay
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              );
            })()}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-100 ring-1 ring-amber-300" />
          Day off
        </span>
        {markedCount > 0 && (
          <span className="text-gray-400">
            · {markedCount} marked this month
          </span>
        )}
      </div>
    </div>
  );
}
