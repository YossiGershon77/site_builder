'use client';

import { DAY_ORDER, DAY_LABELS } from '@/lib/dashboard/utils';
import type { MockBarber } from '@/lib/mock';

interface WorkingHoursFormProps {
  barber: MockBarber;
  workingDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakStart: string;
  breakEnd: string;
  bufferMinutes: number;
  constrainToShop?: boolean;
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
  onSubmit,
}: WorkingHoursFormProps) {
  const selectedDays = new Set(workingDays);

  return (
    <form id="working-hours-form" onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Working days</p>
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
                {DAY_LABELS[day]}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Start time</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">End time</label>
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
            Break start <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            name="breakStart"
            type="time"
            defaultValue={breakStart}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Break end <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            name="breakEnd"
            type="time"
            defaultValue={breakEnd}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Buffer between appointments</label>
        <input
          name="bufferMinutes"
          type="number"
          min={0}
          max={60}
          defaultValue={bufferMinutes}
          className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
        />
        <p className="text-xs text-gray-400 mt-1">Minutes added between each booking</p>
      </div>
    </form>
  );
}
