'use client';

import { DAY_ORDER, DAY_LABELS } from '@/lib/dashboard/utils';
import { useLanguage } from '@/lib/i18n/context';
import type { MockBarber } from '@/lib/mock';

const DAY_LABELS_HE: Record<string, string> = {
  Sunday: 'א׳',
  Monday: 'ב׳',
  Tuesday: 'ג׳',
  Wednesday: 'ד׳',
  Thursday: 'ה׳',
  Friday: 'ו׳',
  Saturday: 'ש׳',
};

interface WorkingHoursFormProps {
  barber: MockBarber;
  workingDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  bufferMinutes: number;
  constrainToShop?: boolean;
  labels: {
    workingDays: string;
    startTime: string;
    endTime: string;
    breakStart: string;
    breakEnd: string;
    optional: string;
    buffer: string;
    bufferHint: string;
  };
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function WorkingHoursForm({
  barber,
  workingDays,
  workStartTime,
  workEndTime,
  breakStart,
  breakEnd,
  bufferMinutes,
  constrainToShop = false,
  labels,
  onSubmit,
}: WorkingHoursFormProps) {
  const { locale } = useLanguage();
  const dayLabels = locale === 'he' ? DAY_LABELS_HE : DAY_LABELS;
  const selectedDays = new Set(workingDays);

  return (
    <form id="working-hours-form" onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{labels.workingDays}</p>
        <div className="flex flex-wrap gap-2">
          {DAY_ORDER.map((day) => {
            const shopClosed = constrainToShop && !barber.workingDays.includes(day);
            const selected = selectedDays.has(day);
            return (
              <label
                key={day}
                className={`px-3 py-2 rounded-lg text-sm border cursor-pointer transition-colors ${
                  shopClosed
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : selected
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  name="days"
                  value={day}
                  defaultChecked={selected}
                  disabled={shopClosed}
                  className="sr-only"
                />
                {dayLabels[day]}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.startTime}</label>
          <input
            name="workStartTime"
            type="time"
            defaultValue={workStartTime}
            min={constrainToShop ? barber.workStartTime : undefined}
            max={constrainToShop ? barber.workEndTime : undefined}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.endTime}</label>
          <input
            name="workEndTime"
            type="time"
            defaultValue={workEndTime}
            min={constrainToShop ? barber.workStartTime : undefined}
            max={constrainToShop ? barber.workEndTime : undefined}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {labels.breakStart} <span className="text-gray-400 font-normal">{labels.optional}</span>
          </label>
          <input
            name="breakStart"
            type="time"
            defaultValue={breakStart ?? ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {labels.breakEnd} <span className="text-gray-400 font-normal">{labels.optional}</span>
          </label>
          <input
            name="breakEnd"
            type="time"
            defaultValue={breakEnd ?? ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{labels.buffer}</label>
        <input
          name="bufferMinutes"
          type="number"
          min={0}
          max={60}
          defaultValue={bufferMinutes}
          className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
        />
        <p className="text-xs text-gray-400 mt-1">{labels.bufferHint}</p>
      </div>
    </form>
  );
}
