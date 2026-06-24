'use client';

import { useMemo, useState } from 'react';
import { ScheduleCalendar } from '@/components/dashboard/ScheduleCalendar';
import { Modal } from '@/components/dashboard/Modal';
import { useDashboard } from '@/lib/dashboard/context';
import { useLanguage } from '@/lib/i18n/context';
import { getDaysOffForDate, useDaysOff } from '@/lib/days-off/store';
import {
  filterAppointmentsForDay,
  formatDateHeading,
  formatTime,
  getGapMinutes,
  getNextAvailableSlot,
} from '@/lib/dashboard/utils';
import type { Appointment, AppointmentStatus, SiteLanguage } from '@/lib/mock';

const LANGUAGE_OPTIONS: Array<{
  id: SiteLanguage;
  flag: string;
  label: string;
}> = [
  { id: 'he', flag: '🇮🇱', label: 'עברית' },
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'ar', flag: '🇸🇦', label: 'العربية' },
  { id: 'ru', flag: '🇷🇺', label: 'Русский' },
];

function StatusBadge({
  status,
  label,
}: {
  status: AppointmentStatus;
  label: string;
}) {
  const styles: Record<AppointmentStatus, string> = {
    CONFIRMED: 'bg-green-50 text-green-700',
    PENDING: 'bg-yellow-50 text-yellow-700',
    CANCELLED: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {label}
    </span>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { t } = useLanguage();
  const cancelled = appointment.status === 'CANCELLED';

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 flex gap-4 ${
        cancelled ? 'opacity-60' : ''
      }`}
    >
      <div className="flex-shrink-0 w-16">
        <p className={`text-lg font-semibold text-[#111111] ${cancelled ? 'line-through' : ''}`}>
          {formatTime(appointment.startTime)}
        </p>
        <p className="text-sm text-gray-400">{formatTime(appointment.endTime)}</p>
      </div>

      <div className={`flex-1 min-w-0 ${cancelled ? 'line-through' : ''}`}>
        <p className="font-medium text-[#111111]">{appointment.clientName}</p>
        <p className="text-sm text-gray-500">{appointment.service.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {t.dashboard.schedule.with.replace(
            '{name}',
            appointment.teamMember?.name ?? t.dashboard.schedule.ownerName,
          )}
        </p>
      </div>

      <div className="flex-shrink-0">
        <StatusBadge
          status={appointment.status}
          label={t.dashboard.status[appointment.status]}
        />
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { user, barber } = useDashboard();
  const { locale, t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [staffFilter, setStaffFilter] = useState('all');
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SiteLanguage>(barber.language);
  const { daysOff } = useDaysOff();

  const appointments = useMemo(
    () => filterAppointmentsForDay(barber.appointments ?? [], selectedDate, user, staffFilter),
    [barber.appointments, selectedDate, user, staffFilter],
  );

  const daysOffNotice = useMemo(
    () => getDaysOffForDate(selectedDate),
    [selectedDate, daysOff],
  );

  const activeAppointments = appointments.filter((a) => a.status !== 'CANCELLED');
  const nextAvailable = getNextAvailableSlot(activeAppointments, barber, selectedDate);

  const teamFilterOptions = [
    { value: 'all', label: t.dashboard.schedule.all },
    { value: 'owner', label: 'Eduardo' },
    ...barber.teamMembers
      .filter((m) => m.inviteAccepted && m.isActive)
      .map((m) => ({ value: m.id, label: m.name.split(' ')[0] })),
  ];
  const currentLanguage =
    LANGUAGE_OPTIONS.find((option) => option.id === selectedLanguage) ?? LANGUAGE_OPTIONS[0];

  function saveLanguage() {
    // TODO [ASAF]: PATCH /api/barber/{id}/language
    console.log('Language changed to', selectedLanguage);
    setLanguageModalOpen(false);
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#111111]">{t.dashboard.schedule.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDateHeading(selectedDate, locale)}
          </p>
        </div>

        {user.role === 'OWNER' && (
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700"
          >
            {teamFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {user.role === 'OWNER' && daysOffNotice.length > 0 && (
        <div className="mb-6 flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-900">{t.dashboard.schedule.staffDaysOff}</p>
            <ul className="mt-1 space-y-0.5">
              {daysOffNotice.map((entry) => (
                <li key={entry.id} className="text-sm text-amber-800">
                  {t.dashboard.schedule.isOff.replace('{name}', entry.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0 order-2 lg:order-1">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <p className="text-gray-500">{t.dashboard.schedule.noAppointments}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt, idx) => {
                const prev = idx > 0 ? appointments[idx - 1] : null;
                const gap = prev ? getGapMinutes(prev, appt) : 0;

                return (
                  <div key={appt.id}>
                    {gap >= 30 && (
                      <div className="flex items-center gap-3 py-3">
                        <div className="flex-1 border-t border-dashed border-gray-300" />
                        <span className="text-xs text-gray-400">
                          {t.dashboard.schedule.break.replace(
                            '{minutes}',
                            String(Math.round(gap)),
                          )}
                        </span>
                        <div className="flex-1 border-t border-dashed border-gray-300" />
                      </div>
                    )}
                    <AppointmentCard appointment={appt} />
                  </div>
                );
              })}
            </div>
          )}

          {appointments.length > 0 && (
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 text-sm text-gray-600">
              {activeAppointments.length === 1
                ? t.dashboard.schedule.appointmentCountOne
                : t.dashboard.schedule.appointmentCount.replace(
                    '{count}',
                    String(activeAppointments.length),
                  )}
              {nextAvailable && (
                <span className="text-gray-400">
                  {' · '}
                  {t.dashboard.schedule.nextAvailable.replace('{time}', nextAvailable)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
          <ScheduleCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            workingDays={barber.workingDays}
            labels={t.dashboard.schedule}
          />
        </div>
      </div>

      {user.role === 'OWNER' && (
        <div className="mt-8 max-w-xl rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#111111]">Site language</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <span className="text-2xl" aria-hidden>
                  {currentLanguage.flag}
                </span>
                <span>{currentLanguage.label}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLanguageModalOpen(true)}
              className="text-sm font-medium text-[#111111] hover:underline"
            >
              Change
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Changing the language updates all platform text. Your custom content (bio,
            descriptions, names) won't be translated — you'll need to update them manually.
          </p>
        </div>
      )}

      <Modal
        open={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        className="max-w-lg"
      >
        <div>
          <h2 className="text-xl font-semibold text-[#111111]">Site language</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose the language visitors will see on your site.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = selectedLanguage === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedLanguage(option.id)}
                  className={`rounded-xl border p-4 text-start transition-colors ${
                    selected ? 'border-[#111111] bg-gray-50' : 'border-gray-200 bg-white'
                  }`}
                  aria-pressed={selected}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>
                      {option.flag}
                    </span>
                    <span className="text-sm font-medium text-[#111111]">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Changing the language updates all platform text. Your custom content (bio,
            descriptions, names) won't be translated — you'll need to update them manually.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setLanguageModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveLanguage}
              className="rounded-xl bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
