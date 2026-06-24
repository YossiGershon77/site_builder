'use client';

import Image from 'next/image';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { getBarberServiceByBankId, type BarberService, type TeamMember } from '@/lib/mock';
import {
  getAvailableSlots,
  getCalendarDays,
  getMockBookings,
  isDateUnavailableForBooking,
  isWorkingDay,
  memberOffersService,
} from '@/lib/booking/availability';
import { useDaysOff } from '@/lib/days-off/store';

type WizardStep = 'service' | 'barber' | 'datetime' | 'details';
type StaffSelection = string | 'anyone';
type StepDirection = 'forward' | 'back';

function getSteps(): WizardStep[] {
  return ['service', 'barber', 'datetime', 'details'];
}

function getStepTitle(
  step: WizardStep,
  t: ReturnType<typeof useLanguage>['t'],
): string {
  switch (step) {
    case 'service':
      return t.booking.step1;
    case 'barber':
      return t.booking.step2;
    case 'datetime':
      return t.booking.step3;
    case 'details':
      return t.booking.step4;
  }
}

function StepHeader({
  title,
  showBack,
  onBack,
  backLabel,
  locale,
}: {
  title: string;
  showBack: boolean;
  onBack: () => void;
  backLabel: string;
  locale: 'he' | 'en';
}) {
  const isEn = locale === 'en';

  return (
    <div className="flex items-center justify-between gap-4 mb-6 min-h-[36px]">
      {isEn ? (
        <>
          <h2 className="text-lg font-semibold text-[#111111] text-start">{title}</h2>
          <div className="flex-shrink-0">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#111111] transition-colors -me-1 px-1 py-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {backLabel}
              </button>
            ) : (
              <span className="w-4" aria-hidden />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex-shrink-0">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#111111] transition-colors -ms-1 px-1 py-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {backLabel}
              </button>
            ) : (
              <span className="w-4" aria-hidden />
            )}
          </div>
          <h2 className="text-lg font-semibold text-[#111111] text-end">{title}</h2>
        </>
      )}
    </div>
  );
}
function TeamMemberAvatar({
  member,
  selected,
  onSelect,
}: {
  member: TeamMember;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-colors ${
          selected ? 'border-[#111111]' : 'border-gray-200 group-hover:border-gray-400'
        } bg-gray-100`}
      >
        {member.profileImageUrl ? (
          <Image
            src={member.profileImageUrl}
            alt={member.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 font-semibold text-sm">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <p className={`text-xs ${selected ? 'font-medium text-[#111111]' : 'text-gray-600'}`}>
        {member.name}
      </p>
    </button>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 px-4 max-w-2xl mx-auto">
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
      }
    >
      <BookingWizard />
    </Suspense>
  );
}

function BookingWizard() {
  const searchParams = useSearchParams();
  const { t, locale } = useLanguage();
  const barber = t.barber;
  const acceptedTeamMembers = barber.teamMembers.filter(
    (member) => member.isActive && member.inviteAccepted,
  );
  const hasTeam = acceptedTeamMembers.length > 0;
  const steps = getSteps();
  const mockBookings = useMemo(() => getMockBookings(), []);
  const { daysOff } = useDaysOff();

  const now = new Date();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<StepDirection>('forward');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<StaffSelection | null>(null);
  const [staffError, setStaffError] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const preselectedFromUrl = useRef(false);
  const didRenderInitialStep = useRef(false);
  const bookingWizardRef = useRef<HTMLDivElement | null>(null);
  const timesSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (preselectedFromUrl.current) return;
    const bankId = searchParams.get('service');
    if (!bankId) return;

    const service = getBarberServiceByBankId(bankId);
    if (!service) return;

    preselectedFromUrl.current = true;
    setSelectedServiceId(service.id);
    setStepIndex(1);
  }, [searchParams]);

  useLayoutEffect(() => {
    if (!didRenderInitialStep.current) {
      didRenderInitialStep.current = true;
      return;
    }

    scrollBookingWizardIntoView();
  }, [stepIndex]);

  const currentStep = steps[stepIndex];
  const selectedService = barber.services.find((s) => s.id === selectedServiceId) ?? null;

  const calendarDays = getCalendarDays(calendarYear, calendarMonth);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const availableSlots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    const memberId = hasTeam ? (selectedMemberId ?? 'anyone') : 'anyone';
    return getAvailableSlots(
      barber,
      selectedService.id,
      memberId,
      selectedDate,
      selectedService.durationMinutes,
      mockBookings,
    );
  }, [barber, selectedService, selectedDate, selectedMemberId, hasTeam, mockBookings, daysOff]);

  const stepLabels = [
    t.booking.wizardSteps.service,
    t.booking.wizardSteps.barber,
    t.booking.wizardSteps.datetime,
    t.booking.wizardSteps.details,
  ];

  function advanceStep() {
    setDirection('forward');
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function scrollBookingWizardIntoView() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const wizardTop = bookingWizardRef.current?.getBoundingClientRect().top;
        if (wizardTop === undefined) return;

        const top = Math.max(window.scrollY + wizardTop - 16, 0);
        const scroller = document.scrollingElement ?? document.documentElement;
        scroller.scrollTo({ top, behavior: 'auto' });
        window.scrollTo({ top, behavior: 'auto' });
      });
    });
  }

  function handleSelectService(service: BarberService) {
    setSelectedServiceId(service.id);
    setSelectedMemberId(null);
    setStaffError(false);
    setSelectedDate(null);
    setSelectedTime(null);
    advanceStep();
  }

  function handleSelectMember(memberId: StaffSelection) {
    setSelectedMemberId(memberId);
    setSelectedDate(null);
    setSelectedTime(null);

    if (memberId !== 'anyone' && selectedServiceId) {
      const member = acceptedTeamMembers.find((m) => m.id === memberId);
      if (member && !memberOffersService(member, selectedServiceId)) {
        setStaffError(true);
        return;
      }
    }

    setStaffError(false);
    advanceStep();
  }

  function handleSelectDate(day: number) {
    const date = new Date(calendarYear, calendarMonth, day);
    setSelectedDate(date);
    setSelectedTime(null);
    window.setTimeout(() => {
      timesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function handleSelectTime(slot: string) {
    setSelectedTime(slot);
    advanceStep();
  }

  function canConfirm(): boolean {
    return name.trim().length > 0 && phone.trim().length > 0;
  }

  function goBack() {
    if (stepIndex > 0) {
      setDirection('back');
      setStepIndex(stepIndex - 1);
    }
  }

  function shiftMonth(delta: number) {
    const next = new Date(calendarYear, calendarMonth + delta, 1);
    setCalendarMonth(next.getMonth());
    setCalendarYear(next.getFullYear());
    setSelectedDate(null);
    setSelectedTime(null);
  }

  function isPastDay(day: number): boolean {
    const date = new Date(calendarYear, calendarMonth, day);
    return date < todayStart;
  }

  function isSelectedDay(day: number): boolean {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === calendarYear &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getDate() === day
    );
  }

  const stepOfLabel = t.booking.stepOf
    .replace('{current}', String(stepIndex + 1))
    .replace('{total}', String(steps.length));

  const stepTitle = getStepTitle(currentStep, t);
  const stepAnimation =
    direction === 'forward' ? 'animate-step-in-right' : 'animate-step-in-left';

  return (
    <div ref={bookingWizardRef} className="py-12 px-4 max-w-2xl mx-auto">
      <div className="mb-8 animate-step-fade-up">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#111111]">
          {t.booking.title}
        </h1>
        <p className="text-gray-500 mt-2">{stepOfLabel}</p>
      </div>

      <div className="flex items-center gap-2 mb-10">
        {stepLabels.map((label, idx) => (
          <div key={label} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-500 ease-out ${
                idx < stepIndex
                  ? 'bg-[#111111] text-white scale-100'
                  : idx === stepIndex
                  ? 'bg-[#111111] text-white ring-4 ring-gray-100 scale-110'
                  : 'bg-gray-100 text-gray-400 scale-100'
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`text-xs truncate hidden sm:block transition-colors duration-300 ${
                idx === stepIndex ? 'font-medium text-[#111111]' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            {idx < stepLabels.length - 1 && (
              <div
                className={`h-px flex-1 min-w-2 transition-colors duration-500 ${
                  idx < stepIndex ? 'bg-[#111111]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="overflow-hidden">
        <div key={stepIndex} className={stepAnimation}>
          <StepHeader
            title={stepTitle}
            showBack={stepIndex > 0}
            onBack={goBack}
            backLabel={t.booking.back}
            locale={locale}
          />

      {currentStep === 'service' && (
        <section>
          <div className="space-y-3">
            {barber.services
              .filter((service) => service.isActive)
              .map((service) => {
                const selected = selectedServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleSelectService(service)}
                    className={`w-full p-4 border rounded-xl transition-all ${
                      locale === 'en' ? 'text-start' : 'text-end'
                    } ${
                      selected
                        ? 'border-[#111111] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div
                      className={`flex items-start justify-between gap-4 ${
                        locale === 'he' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#111111]">{service.name}</p>
                        {service.description && (
                          <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div
                        className={`flex-shrink-0 ${
                          locale === 'en' ? 'text-end' : 'text-start'
                        }`}
                      >
                        {service.priceDisplay && (
                          <p className="font-semibold text-[#111111]">{service.priceDisplay}</p>
                        )}
                        {service.showDuration && (
                          <p className="text-sm text-gray-500">
                            {service.durationMinutes} {t.common.min}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </section>
      )}

      {currentStep === 'barber' && (
        <section>
          {staffError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {t.booking.staffError}
            </div>
          )}

          <div className="flex flex-wrap gap-5">
            <button
              type="button"
              onClick={() => handleSelectMember('anyone')}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedMemberId === 'anyone'
                    ? 'border-[#111111] bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <svg
                  className="w-7 h-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p
                className={`text-xs ${
                  selectedMemberId === 'anyone' ? 'font-medium text-[#111111]' : 'text-gray-600'
                }`}
              >
                {t.booking.anyone}
              </p>
            </button>

            {acceptedTeamMembers.map((member) => (
                <TeamMemberAvatar
                  key={member.id}
                  member={member}
                  selected={selectedMemberId === member.id}
                  onSelect={() => handleSelectMember(member.id)}
                />
              ))}
          </div>
        </section>
      )}

      {currentStep === 'datetime' && (
        <section>
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[#111111]">
                {t.booking.monthNames[calendarMonth]} {calendarYear}
              </h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  disabled={
                    calendarYear === now.getFullYear() && calendarMonth === now.getMonth()
                  }
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {t.booking.dayNames.map((d) => (
                <div key={d} className="text-center text-xs text-gray-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((day, idx) => (
                <div key={idx} className="aspect-square flex items-center justify-center">
                  {day !== null && (() => {
                    const date = new Date(calendarYear, calendarMonth, day);
                    const past = isPastDay(day);
                    const closed = !isWorkingDay(date, barber.workingDays);
                    const memberId = hasTeam ? (selectedMemberId ?? 'anyone') : 'anyone';
                    const fullyBooked =
                      selectedService &&
                      !past &&
                      !closed &&
                      isDateUnavailableForBooking(
                        barber,
                        selectedService.id,
                        memberId,
                        date,
                        selectedService.durationMinutes,
                        mockBookings,
                      );
                    const disabled = past || closed || !!fullyBooked;
                    const selected = isSelectedDay(day);
                    const isToday =
                      day === now.getDate() &&
                      calendarMonth === now.getMonth() &&
                      calendarYear === now.getFullYear();

                    return (
                      <button
                        type="button"
                        onClick={() => !disabled && handleSelectDate(day)}
                        disabled={disabled}
                        className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors ${
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
          </div>

          <div ref={timesSectionRef} className="scroll-mt-6">
            {!selectedDate && (
              <p className="text-sm text-gray-400">{t.booking.selectDateHint}</p>
            )}

            {selectedDate && availableSlots.length === 0 && (
              <p className="text-sm text-gray-500">{t.booking.noTimesAvailable}</p>
            )}

            {selectedDate && availableSlots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSelectTime(slot)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selectedTime === slot
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {currentStep === 'details' && (
        <section>
          {selectedService && selectedDate && selectedTime && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm space-y-1">
              <p>
                <span className="text-gray-500">{t.booking.step1}: </span>
                <span className="font-medium">{selectedService.name}</span>
                {selectedService.priceDisplay && (
                  <span className="text-gray-500"> · {selectedService.priceDisplay}</span>
                )}
              </p>
              {hasTeam && selectedMemberId && (
                <p>
                  <span className="text-gray-500">{t.booking.step2}: </span>
                  <span className="font-medium">
                    {selectedMemberId === 'anyone'
                      ? t.booking.anyone
                      : acceptedTeamMembers.find((m) => m.id === selectedMemberId)?.name}
                  </span>
                </p>
              )}
              <p>
                <span className="text-gray-500">{t.booking.wizardSteps.datetime}: </span>
                <span className="font-medium">
                  {selectedDate.toLocaleDateString()} · {selectedTime}
                </span>
              </p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.booking.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.booking.namePlaceholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.booking.phone}
              </label>
              <p className="text-xs text-gray-400 mb-1.5">{t.booking.phoneHint}</p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.booking.phonePlaceholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.booking.notes}{' '}
                <span className="text-gray-400 font-normal">{t.booking.optional}</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.booking.notesPlaceholder}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none bg-white"
              />
            </div>
          </div>
        </section>
      )}
        </div>
      </div>

      {currentStep === 'details' && (
        <div className="mt-10 animate-step-fade-up">
          <button
            type="button"
            disabled={!canConfirm()}
            className="w-full py-4 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.booking.confirm}
          </button>
        </div>
      )}
    </div>
  );
}