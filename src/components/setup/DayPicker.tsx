'use client';

import { DAY_OPTIONS } from '@/lib/setup/constants';
import { FieldError } from './FieldError';

export function DayPicker({
  selectedDays,
  onChange,
  error,
}: {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  error?: string | null;
}) {
  function toggleDay(key: string) {
    if (selectedDays.includes(key)) {
      onChange(selectedDays.filter((d) => d !== key));
    } else {
      onChange([...selectedDays, key]);
    }
  }

  return (
    <div>
      <label className={`block text-sm font-medium mb-3 ${error ? 'text-red-500' : 'text-[#111111]'}`}>
        Working days
      </label>
      <div className="flex flex-wrap gap-2">
        {DAY_OPTIONS.map((day) => {
          const selected = selectedDays.includes(day.key);
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => toggleDay(day.key)}
              className={`flex flex-col items-center min-w-[52px] px-3 py-2 rounded-xl border text-sm transition-colors ${
                selected
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="font-medium">{day.label}</span>
              <span className={`text-[10px] ${selected ? 'text-white/70' : 'text-gray-400'}`}>
                {day.labelHe}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}
