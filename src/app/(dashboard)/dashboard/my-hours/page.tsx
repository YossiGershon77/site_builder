'use client';

import { DaysOffCalendar } from '@/components/dashboard/DaysOffCalendar';
import { useDashboard } from '@/lib/dashboard/context';
import { OWNER_MEMBER_ID } from '@/lib/days-off/types';
import { formatHoursSummary } from '@/lib/dashboard/utils';
import { WorkingHoursForm } from '@/components/dashboard/WorkingHoursForm';

export default function MyHoursPage() {
  const { user, barber } = useDashboard();
  const isStaff = user.role === 'TEAM_MEMBER';

  const member = isStaff
    ? barber.teamMembers.find((m) => m.id === user.teamMemberId)
    : null;

  const memberId = isStaff ? (user.teamMemberId ?? '') : OWNER_MEMBER_ID;
  const memberName = user.name;

  const workingDays = member?.workingDays ?? barber.workingDays;
  const workStartTime = member?.workStartTime ?? barber.workStartTime;
  const workEndTime = member?.workEndTime ?? barber.workEndTime;
  const breakStart = member?.breakStart ?? barber.breakStart;
  const breakEnd = member?.breakEnd ?? barber.breakEnd;
  const bufferMinutes = barber.bufferMinutes;

  const summaryMember = {
    id: memberId,
    name: memberName,
    profileImageUrl: null,
    isActive: true,
    inviteAccepted: true,
    workingDays: [...workingDays],
    workStartTime,
    workEndTime,
    breakStart,
    breakEnd,
    services: [],
  };

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Save hours:', Object.fromEntries(new FormData(e.currentTarget)));
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-[#111111] mb-2">My working hours</h1>
      <p className="text-sm text-gray-500 mb-8">{formatHoursSummary(summaryMember)}</p>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <WorkingHoursForm
              barber={barber}
              workingDays={[...workingDays]}
              workStartTime={workStartTime}
              workEndTime={workEndTime}
              breakStart={breakStart}
              breakEnd={breakEnd}
              bufferMinutes={bufferMinutes}
              constrainToShop={isStaff}
              onSubmit={handleSave}
            />

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                type="submit"
                form="working-hours-form"
                className="px-6 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Save changes
              </button>
              <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
                Discard
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 shrink-0">
          <DaysOffCalendar
            memberId={memberId}
            memberName={memberName}
            workingDays={[...workingDays]}
          />
        </div>
      </div>
    </div>
  );
}
