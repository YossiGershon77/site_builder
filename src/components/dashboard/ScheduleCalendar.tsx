'use client';

import { useState } from 'react';
import { isSameDay } from '@/lib/dashboard/utils';

interface ScheduleCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  workingDays: string[];
}

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isWorkingDay(date: Date, workingDays: string[]): boolean {
  return workingDays.some((day) => DAY_INDEX[day] === date.getDay());
}

export function ScheduleCalendar({ selectedDate, onSelectDate, workingDays }: ScheduleCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  function shiftMonth(delta: number) {
    setViewMonth(new Date(year, month + delta, 1));
  }

  function handleSelectDay(day: number) {
    onSelectDate(new Date(year, month, day));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:sticky lg:top-6">
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
              const closed = !isWorkingDay(date, workingDays);
              const disabled = past || closed;
              const selected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);

              return (
                <button
                  type="button"
                  onClick={() => !disabled && handleSelectDay(day)}
                  disabled={disabled}
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors ${
                    selected
                      ? 'bg-[#111111] text-white font-semibold'
                      : isToday
                      ? 'ring-1 ring-[#111111] text-[#111111] font-semibold'
                      : disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })()}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onSelectDate(new Date(today))}
        className="w-full mt-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Today
      </button>
    </div>
  );
}
