'use client';

import type { Locale } from '@/lib/i18n/translations';
import { TIME_OPTIONS } from '@/lib/setup/constants';
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
}: TimeRangeInputProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">{startLabel}</label>
          <select
            value={startValue}
            onChange={(e) => onStartChange(e.target.value)}
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">{selectPlaceholder}</option>
            {TIME_OPTIONS.map((time) => (
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
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">{selectPlaceholder}</option>
            {TIME_OPTIONS.map((time) => (
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
