'use client';

import type { Locale } from '@/lib/i18n/translations';
import { timeToMinutes } from '@/lib/setup/constants';
import { formatTimeForLocale } from '@/lib/setup/time-format';

export function TimelinePreview({
  workStartTime,
  workEndTime,
  hasBreak,
  breakStart,
  breakEnd,
  locale,
  previewLabel = 'Preview',
  previewEmpty = 'Set your hours above to see a preview',
  breakLabel = 'Break',
}: {
  workStartTime: string;
  workEndTime: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
  locale: Locale;
  previewLabel?: string;
  previewEmpty?: string;
  breakLabel?: string;
}) {
  if (!workStartTime || !workEndTime) {
    return (
      <div className="mt-6 p-6 rounded-xl bg-gray-50 border border-gray-100 text-center text-sm text-gray-400">
        {previewEmpty}
      </div>
    );
  }

  const dayStart = 5 * 60;
  const dayEnd = 24 * 60;
  const daySpan = dayEnd - dayStart;

  const workStart = timeToMinutes(workStartTime);
  const workEnd = timeToMinutes(workEndTime);
  const breakStartMin = breakStart ? timeToMinutes(breakStart) : 0;
  const breakEndMin = breakEnd ? timeToMinutes(breakEnd) : 0;

  function pct(minutes: number) {
    return ((minutes - dayStart) / daySpan) * 100;
  }

  const segments: { left: number; width: number; type: 'work' | 'break' }[] = [];

  if (hasBreak && breakStart && breakEnd && breakStartMin > workStart && breakEndMin < workEnd) {
    segments.push({
      left: pct(workStart),
      width: pct(breakStartMin) - pct(workStart),
      type: 'work',
    });
    segments.push({
      left: pct(breakStartMin),
      width: pct(breakEndMin) - pct(breakStartMin),
      type: 'break',
    });
    segments.push({
      left: pct(breakEndMin),
      width: pct(workEnd) - pct(breakEndMin),
      type: 'work',
    });
  } else {
    segments.push({
      left: pct(workStart),
      width: pct(workEnd) - pct(workStart),
      type: 'work',
    });
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-[#111111] mb-2">{previewLabel}</p>
      <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`absolute top-0 h-full ${
              seg.type === 'work'
                ? 'bg-green-400'
                : 'bg-gray-200 border-x border-dashed border-gray-400'
            }`}
            style={{ left: `${seg.left}%`, width: `${seg.width}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTimeForLocale(workStartTime, locale)}</span>
        {hasBreak && breakStart && breakEnd && (
          <span className="text-gray-500">
            {breakLabel} {formatTimeForLocale(breakStart, locale)}–
            {formatTimeForLocale(breakEnd, locale)}
          </span>
        )}
        <span>{formatTimeForLocale(workEndTime, locale)}</span>
      </div>
    </div>
  );
}
