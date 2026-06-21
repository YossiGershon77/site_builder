'use client';

import type { Locale } from '@/lib/i18n/translations';
import { TIME_OPTIONS, timeToMinutes } from '@/lib/setup/constants';
import { formatTimeForLocale } from '@/lib/setup/time-format';

interface TimeRangeInputProps {
  startLabel: string;
  endLabel: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  error?: string | null;
  locale: Locale;
  selectPlaceholder?: string;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  disabledTitle?: string;
}

export function TimeRangeInput({
  startLabel,
  endLabel,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  error,
  locale,
  selectPlaceholder = 'Select',
  minTime,
  maxTime,
  disabled = false,
  disabledTitle,
}: TimeRangeInputProps) {
  const options = TIME_OPTIONS.filter((time) => {
    const minutes = timeToMinutes(time);
    if (minTime && minutes < timeToMinutes(minTime)) return false;
    if (maxTime && minutes > timeToMinutes(maxTime)) return false;
    return true;
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">{startLabel}</label>
          <select
            value={startValue}
            onChange={(e) => onStartChange(e.target.value)}
            disabled={disabled}
            title={disabled ? disabledTitle : undefined}
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
              error ? 'border-red-500' : 'border-gray-200'
            } ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'}`}
          >
            <option value="">{selectPlaceholder}</option>
            {options.map((time) => (
              <option key={time} value={time}>
                {formatTimeForLocale(time, locale)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">{endLabel}</label>
          <select
            value={endValue}
            onChange={(e) => onEndChange(e.target.value)}
            disabled={disabled}
            title={disabled ? disabledTitle : undefined}
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
              error ? 'border-red-500' : 'border-gray-200'
            } ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'}`}
          >
            <option value="">{selectPlaceholder}</option>
            {options.map((time) => (
              <option key={time} value={time}>
                {formatTimeForLocale(time, locale)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2 flex items-start gap-1 animate-fade-in">
          <span aria-hidden>✕</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
