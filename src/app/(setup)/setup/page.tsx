// TODO [ASAF]: Replace with real API call
'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  mockSetupSession,
  type SetupData,
} from '@/lib/mock';
import {
  validateAbout,
  validateAddress,
  validateGoogleMapsUrl,
  validateHours,
  validateSubdomain,
} from '@/lib/setup/validation';
import { SetupStepper } from '@/components/setup/SetupStepper';
import { SubdomainInput } from '@/components/setup/SubdomainInput';
import { ServiceSelector, validateSelectedServices } from '@/components/setup/ServiceSelector';
import { DayPicker } from '@/components/setup/DayPicker';
import { TimeRangeInput } from '@/components/setup/TimeRangeInput';
import { TimelinePreview } from '@/components/setup/TimelinePreview';
import { PhotoUploader } from '@/components/setup/PhotoUploader';
import { ProfilePhotoUploader } from '@/components/setup/ProfilePhotoUploader';
import { InviteForm } from '@/components/setup/InviteForm';
import { InviteList } from '@/components/setup/InviteList';
import { SetupComplete } from '@/components/setup/SetupComplete';
import { Toast, type ToastState } from '@/components/setup/Toast';
import { FieldError } from '@/components/setup/FieldError';
import { SetupShellProvider, useSetupShell } from '@/components/setup/SetupShellContext';
import { useLanguage } from '@/lib/i18n/context';
import { getSetupTranslations } from '@/lib/setup/translations';

export default function SetupPage() {
  return (
    <SetupShellProvider>
      <Suspense
        fallback={
          <div className="py-12 text-center text-gray-400 text-sm">Loading setup…</div>
        }
      >
        <SetupWizard />
      </Suspense>
    </SetupShellProvider>
  );
}

function SetupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setProgress, registerSaveHandler } = useSetupShell();
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);

  const [currentStep, setCurrentStep] = useState(mockSetupSession.currentStep);
  const [data, setData] = useState<SetupData>(() =>
    structuredClone(mockSetupSession.data),
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [shakeNext, setShakeNext] = useState(false);
  const [highlightRequired, setHighlightRequired] = useState(false);

  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleWarning, setGoogleWarning] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [hoursErrors, setHoursErrors] = useState<Record<string, string>>({});

  const tokenChecked = useRef(false);

  useEffect(() => {
    if (tokenChecked.current) return;
    tokenChecked.current = true;

    const token = searchParams.get('token');
    // TODO [ASAF]: Replace with real token validation API
    if (!token || token !== mockSetupSession.token) {
      router.replace('/setup/invalid');
      return;
    }
    if (mockSetupSession.status === 'COMPLETED') {
      router.replace('/setup/expired');
    }
  }, [searchParams, router]);

  useEffect(() => {
    setProgress((currentStep / 6) * 100);
  }, [currentStep, setProgress]);

  const saveState = useCallback(() => {
    // TODO [ASAF]: Replace with real progress saving to database
    console.log('Setup saved', { currentStep, data });
    setToast({
      message: 'Progress saved. Use your setup link to continue anytime.',
      variant: 'success',
    });
  }, [currentStep, data]);

  useEffect(() => {
    registerSaveHandler(saveState);
  }, [registerSaveHandler, saveState]);

  function scrollToFirstError(selector: string) {
    const el = document.querySelector(selector);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el instanceof HTMLElement) {
      const input = el.querySelector('input, textarea, select');
      if (input instanceof HTMLElement) input.focus();
    }
  }

  function triggerInvalidNext() {
    setShakeNext(true);
    setTimeout(() => setShakeNext(false), 300);
  }

  function isStep1Valid(): boolean {
    const subErr = validateSubdomain(data.details.subdomain);
    const addrErr = validateAddress(data.details.address);
    const aboutErr = validateAbout(data.details.about);
    const { error: gErr } = validateGoogleMapsUrl(data.details.googleMapsUrl);
    return !subErr && !addrErr && !aboutErr && !gErr;
  }

  async function handleNext() {
    if (currentStep === 1) {
      const subErr = validateSubdomain(data.details.subdomain);
      const addrErr = validateAddress(data.details.address);
      const aboutErr = validateAbout(data.details.about);
      const { error: gErr, warning: gWarn } = validateGoogleMapsUrl(
        data.details.googleMapsUrl,
      );

      setSubdomainError(subErr);
      setAddressError(addrErr);
      setAboutError(aboutErr);
      setGoogleError(gErr);
      setGoogleWarning(gWarn);

      if (subErr || addrErr || aboutErr || gErr) {
        setHighlightRequired(true);
        triggerInvalidNext();
        if (subErr) scrollToFirstError('[data-field="subdomain"]');
        else if (addrErr) scrollToFirstError('[data-field="address"]');
        return;
      }
    }

    if (currentStep === 2) {
      if (
        data.services.selectedServices.length === 0 ||
        !validateSelectedServices(
          data.services.selectedServices,
          data.services.globalShowPrices,
        )
      ) {
        setToast({
          message: t.step2.selectOne,
          variant: 'error',
        });
        triggerInvalidNext();
        return;
      }
    }

    if (currentStep === 3) {
      const errors = validateHours(data.hours);
      setHoursErrors(errors);
      if (Object.keys(errors).length > 0) {
        triggerInvalidNext();
        scrollToFirstError('[data-field="hours"]');
        return;
      }
    }

    setSaving(true);
    // TODO [ASAF]: Replace with real API call
    console.log(`Step ${currentStep} data:`, data);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  function handleComplete() {
    setSaving(true);
    console.log('Completing setup', data);
    setTimeout(() => {
      setSaving(false);
      setCurrentStep(6);
    }, 500);
  }

  if (currentStep === 6) {
    return <SetupComplete data={data} onDone={() => {}} />;
  }

  const step1Ready = isStep1Valid();
  const step2Ready =
    data.services.selectedServices.length > 0 &&
    validateSelectedServices(
      data.services.selectedServices,
      data.services.globalShowPrices,
    );
  const step3Ready = Object.keys(validateHours(data.hours)).length === 0;

  const nextDisabled =
    saving ||
    (currentStep === 1 && !step1Ready) ||
    (currentStep === 2 && !step2Ready) ||
    (currentStep === 3 && !step3Ready);

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <SetupStepper
        currentStep={currentStep}
        onStepClick={(step) => step < currentStep && setCurrentStep(step)}
        labels={t.stepper}
      />

      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111111]">{t.step1.title}</h1>
            <p className="text-gray-500 mt-1">{t.step1.sub}</p>
          </div>

          <div data-field="subdomain">
            <SubdomainInput
              value={data.details.subdomain}
              onChange={(v) =>
                setData((d) => ({ ...d, details: { ...d.details, subdomain: v } }))
              }
              error={subdomainError}
              onErrorChange={setSubdomainError}
              showRequiredHighlight={highlightRequired && !data.details.subdomain}
              label={t.step1.subdomainLabel}
              sitePreviewLabel={t.step1.sitePreview}
              availableLabel={t.step1.available}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#111111] mb-1.5">
              {t.step1.googleLabel}
              <span className="text-xs font-normal text-gray-400">{t.optional}</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">{t.step1.googleSub}</p>
            <input
              type="url"
              value={data.details.googleMapsUrl}
              onChange={(e) => {
                const v = e.target.value;
                setData((d) => ({ ...d, details: { ...d.details, googleMapsUrl: v } }));
                const { error, warning } = validateGoogleMapsUrl(v);
                setGoogleError(error);
                setGoogleWarning(warning);
              }}
              placeholder={t.step1.googlePlaceholder}
              className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
                googleError ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <FieldError message={googleError} />
            {googleWarning && !googleError && (
              <p className="text-sm text-yellow-600 mt-1 flex items-start gap-1 animate-fade-in">
                <span aria-hidden>⚠</span>
                {googleWarning}
              </p>
            )}
          </div>

          <div data-field="address">
            <label className={`block text-sm font-medium mb-1.5 ${addressError ? 'text-red-500' : 'text-[#111111]'}`}>
              {t.step1.addressLabel}
            </label>
            <p className="text-xs text-gray-500 mb-2">{t.step1.addressSub}</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
                📍
              </span>
              <input
                type="text"
                value={data.details.address}
                onChange={(e) => {
                  const v = e.target.value;
                  setData((d) => ({ ...d, details: { ...d.details, address: v } }));
                  setAddressError(validateAddress(v));
                  setHighlightRequired(false);
                }}
                placeholder={t.step1.addressPlaceholder}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none ${
                  addressError || (highlightRequired && !data.details.address)
                    ? 'border-red-500'
                    : 'border-gray-200'
                }`}
              />
            </div>
            {/* TODO [ASAF]: Replace with Google Places Autocomplete */}
            <FieldError message={addressError} />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#111111] mb-1.5">
              {t.step1.aboutLabel}
              <span className="text-xs font-normal text-gray-400">{t.optional}</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">{t.step1.aboutSub}</p>
            <textarea
              rows={4}
              value={data.details.about}
              onChange={(e) => {
                const v = e.target.value;
                setData((d) => ({ ...d, details: { ...d.details, about: v } }));
                setAboutError(validateAbout(v));
              }}
              placeholder={t.step1.aboutPlaceholder}
              className={`w-full px-4 py-3 text-sm rounded-xl border outline-none resize-none ${
                aboutError ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <div className="flex justify-between mt-1">
              <FieldError message={aboutError} />
              <span
                className={`text-xs ml-auto ${
                  data.details.about.length > 500
                    ? 'text-red-500'
                    : data.details.about.length > 450
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                }`}
              >
                {data.details.about.length} / 500
              </span>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6 pb-24">
          <div>
            <h1 className="text-2xl font-semibold text-[#111111]">{t.step2.title}</h1>
            <p className="text-gray-500 mt-1">{t.step2.sub}</p>
          </div>
          <ServiceSelector
            selectedServices={data.services.selectedServices}
            globalShowPrices={data.services.globalShowPrices}
            globalShowDurations={data.services.globalShowDurations}
            labels={t.step2}
            onGlobalShowPricesChange={(v) =>
              setData((d) => ({
                ...d,
                services: { ...d.services, globalShowPrices: v },
              }))
            }
            onGlobalShowDurationsChange={(v) =>
              setData((d) => ({
                ...d,
                services: { ...d.services, globalShowDurations: v },
              }))
            }
            onSelectedServicesChange={(selectedServices) =>
              setData((d) => ({
                ...d,
                services: { ...d.services, selectedServices },
              }))
            }
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {data.services.selectedServices.length} {t.step2.selected}
              </span>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6" data-field="hours">
          <div>
            <h1 className="text-2xl font-semibold text-[#111111]">{t.step3.title}</h1>
            <p className="text-gray-500 mt-1">{t.step3.sub}</p>
          </div>

          <DayPicker
            selectedDays={data.hours.workingDays}
            onChange={(workingDays) => {
              setData((d) => ({ ...d, hours: { ...d.hours, workingDays } }));
              setHoursErrors((e) => ({ ...e, workingDays: '' }));
            }}
            error={hoursErrors.workingDays}
          />

          <TimeRangeInput
            startLabel={t.step3.opensAt}
            endLabel={t.step3.closesAt}
            startValue={data.hours.workStartTime}
            endValue={data.hours.workEndTime}
            locale={locale}
            selectPlaceholder={t.select}
            onStartChange={(workStartTime) => {
              setData((d) => ({
                ...d,
                hours: {
                  ...d.hours,
                  workStartTime,
                  breakStart: '',
                  breakEnd: '',
                },
              }));
              setHoursErrors({});
            }}
            onEndChange={(workEndTime) => {
              setData((d) => ({
                ...d,
                hours: {
                  ...d.hours,
                  workEndTime,
                  breakStart: '',
                  breakEnd: '',
                },
              }));
              setHoursErrors({});
            }}
            error={hoursErrors.workHours}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.hours.hasBreak}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  hours: { ...d.hours, hasBreak: e.target.checked },
                }))
              }
              className="w-4 h-4 rounded accent-[#111111]"
            />
            <span className="text-sm font-medium text-[#111111]">{t.step3.addBreak}</span>
          </label>

          {data.hours.hasBreak && (
            <TimeRangeInput
              startLabel={t.step3.breakFrom}
              endLabel={t.step3.breakUntil}
              startValue={data.hours.breakStart}
              endValue={data.hours.breakEnd}
              locale={locale}
              selectPlaceholder={t.select}
              minTime={data.hours.workStartTime}
              maxTime={data.hours.workEndTime}
              disabled={!data.hours.workStartTime || !data.hours.workEndTime}
              disabledTitle="Set opening and closing times first"
              onStartChange={(breakStart) => {
                setData((d) => ({ ...d, hours: { ...d.hours, breakStart } }));
                setHoursErrors({});
              }}
              onEndChange={(breakEnd) => {
                setData((d) => ({ ...d, hours: { ...d.hours, breakEnd } }));
                setHoursErrors({});
              }}
              error={hoursErrors.breakHours || hoursErrors.breakStart || hoursErrors.breakEnd}
            />
          )}

          <TimelinePreview
            workStartTime={data.hours.workStartTime}
            workEndTime={data.hours.workEndTime}
            hasBreak={data.hours.hasBreak}
            breakStart={data.hours.breakStart}
            breakEnd={data.hours.breakEnd}
            locale={locale}
            previewLabel={t.step3.preview}
            previewEmpty={t.step3.previewEmpty}
            breakLabel={t.step3.break}
          />
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#111111]">{t.step4.title}</h1>
            <p className="text-gray-500 mt-1">{t.step4.sub}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">
              {t.step4.shopPhotosLabel}
            </label>
            <p className="text-xs text-gray-500 mb-3">{t.step4.shopPhotosSub}</p>
            <PhotoUploader
              photos={data.gallery.placePhotos}
              onChange={(placePhotos) =>
                setData((d) => ({ ...d, gallery: { ...d.gallery, placePhotos } }))
              }
              clickUploadLabel={t.step4.clickUpload}
              fileTypesLabel={t.step4.fileTypes}
              photoHintLabel={t.step4.photoHint}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">{t.step4.profileLabel}</label>
            <p className="text-xs text-gray-500 mb-4">{t.step4.profileSub}</p>
            <ProfilePhotoUploader
              photo={data.gallery.profilePhoto}
              onChange={(profilePhoto) =>
                setData((d) => ({ ...d, gallery: { ...d.gallery, profilePhoto } }))
              }
              uploadLabel={t.step4.uploadPhoto}
              removeLabel={t.step4.remove}
            />
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111111]">{t.step5.title}</h1>
            <p className="text-gray-500 mt-1">{t.step5.sub}</p>
          </div>

          <InviteForm
            existingEmails={data.staff.invites.map((i) => i.email)}
            onInvite={(invite) => {
              setData((d) => ({
                ...d,
                staff: { invites: [...d.staff.invites, invite] },
              }));
              setToast({ message: `Invite sent to ${invite.name}`, variant: 'success' });
            }}
          />

          <InviteList
            invites={data.staff.invites}
            onRemove={(id) => {
              setData((d) => ({
                ...d,
                staff: { invites: d.staff.invites.filter((i) => i.id !== id) },
              }));
              setToast({ message: 'Invite removed', variant: 'success' });
            }}
          />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-[#111111] transition-colors"
          >
            {t.back}
          </button>
        ) : (
          <span />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={() => {
              if (nextDisabled) {
                triggerInvalidNext();
                if (currentStep === 1) setHighlightRequired(true);
                if (currentStep === 2) {
                  setToast({
                    message: t.step2.selectOne,
                    variant: 'error',
                  });
                }
                return;
              }
              handleNext();
            }}
            disabled={saving}
            title={nextDisabled ? 'Complete required fields to continue' : undefined}
            className={`px-8 py-3 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              shakeNext ? 'animate-shake' : ''
            } ${!nextDisabled ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.saving}
              </span>
            ) : (
              t.next
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleComplete}
            disabled={saving}
            className="px-8 py-3 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? t.saving : data.staff.invites.length > 0 ? t.step5.complete : t.step5.skipComplete}
          </button>
        )}
      </div>
    </>
  );
}
