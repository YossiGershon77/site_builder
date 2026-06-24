// TODO [ASAF]: Replace with real API call
'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  mockValidateToken,
  type SiteLanguage,
  type SetupData,
} from '@/lib/mock';
import {
  validateAbout,
  validateAddress,
  validateGoogleMapsUrl,
  validateHours,
  validateSetupName,
  validateSocialUrl,
  validateSubdomain,
  validateTagline,
  validateWhatsappNumber,
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

type AccountErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

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

const AUTH_SESSION_KEY = 'cutsite_session';
const LEGACY_SESSION_EMAIL_KEY = 'cutsite.mockAuthEmail';

function accountKey(token: string) {
  return `cutsite_setup_account:${token}`;
}

function progressKey(token: string) {
  return `cutsite_setup_progress:${token}`;
}

function hasCreatedSetupAccount(token: string) {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(accountKey(token)) === 'true';
}

function saveSetupProgress(token: string, currentStep: number, data: SetupData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    progressKey(token),
    JSON.stringify({
      currentStep,
      data,
    }),
  );
}

function readSetupProgress(token: string): { currentStep: number; data: SetupData } | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(progressKey(token));
  if (!stored) return null;

  try {
    return JSON.parse(stored) as { currentStep: number; data: SetupData };
  } catch {
    localStorage.removeItem(progressKey(token));
    return null;
  }
}

function saveSetupAccountSession(token: string, email: string) {
  if (typeof window === 'undefined') return;
  const user = {
    id: `setup-${email}`,
    email,
    name: email.split('@')[0],
    role: 'OWNER' as const,
    barberId: '1',
    teamMemberId: null,
  };

  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      user,
      loginAt: Date.now(),
    }),
  );
  localStorage.setItem(LEGACY_SESSION_EMAIL_KEY, email);
  localStorage.setItem(accountKey(token), 'true');
  window.dispatchEvent(new Event('cutsite-auth-change'));
}

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function getPasswordStrength(password: string): {
  bars: number;
  label: string;
  colorClass: string;
} {
  if (password.length < 8) return { bars: 0, label: '', colorClass: '' };

  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasNumber) return { bars: 1, label: 'Weak', colorClass: 'bg-red-500' };
  if (!hasSpecial) return { bars: 2, label: 'Fair', colorClass: 'bg-yellow-500' };
  if (password.length >= 12) return { bars: 4, label: 'Strong', colorClass: 'bg-green-500' };
  return { bars: 3, label: 'Good', colorClass: 'bg-green-500' };
}

export default function SetupPage() {
  return (
    <Suspense fallback={<SetupLoading />}>
      <SetupEntry />
    </Suspense>
  );
}

function SetupLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl font-semibold tracking-tight text-[#111111]">CutSite</p>
        <span className="h-5 w-5 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
        <p className="text-sm text-gray-400">Verifying your setup link...</p>
      </div>
    </div>
  );
}

function SetupEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [validatedSetup, setValidatedSetup] = useState<{
    token: string;
    currentStep: number;
    data: SetupData;
    needsAccount: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function validateToken() {
      const token = searchParams.get('token');
      if (!token) {
        router.replace('/setup/invalid');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (cancelled) return;

      const result = mockValidateToken(token);

      if (result.status === 'COMPLETED') {
        router.replace('/setup/expired');
        return;
      }

      if (result.status === 'EXPIRED' || result.status === 'INVALID' || !result.data) {
        router.replace('/setup/invalid');
        return;
      }

      const savedProgress = readSetupProgress(token);
      const needsAccount = !hasCreatedSetupAccount(token);

      setValidatedSetup({
        token,
        currentStep: savedProgress?.currentStep ?? result.currentStep,
        data: savedProgress?.data ?? result.data,
        needsAccount,
      });
    }

    validateToken();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (!validatedSetup) return <SetupLoading />;

  if (validatedSetup.needsAccount) {
    return (
      <AccountSetupGate
        token={validatedSetup.token}
        initialData={validatedSetup.data}
        onComplete={(data) =>
          setValidatedSetup((setup) =>
            setup
              ? {
                  ...setup,
                  currentStep: 1,
                  data,
                  needsAccount: false,
                }
              : setup,
          )
        }
      />
    );
  }

  return (
    <SetupShellProvider>
      <SetupWizardContent
        token={validatedSetup.token}
        initialStep={validatedSetup.currentStep}
        initialData={validatedSetup.data}
      />
    </SetupShellProvider>
  );
}

function AccountSetupGate({
  token,
  initialData,
  onComplete,
}: {
  token: string;
  initialData: SetupData;
  onComplete: (data: SetupData) => void;
}) {
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);
  const [data, setData] = useState<SetupData>(() => structuredClone(initialData));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<AccountErrors>({});
  const passwordStrength = getPasswordStrength(password);

  function validateEmail(email: string): string | undefined {
    if (!email.trim()) return t.step6.emailRequired;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return t.step6.emailInvalid;
    return undefined;
  }

  function validatePassword(value: string): string | undefined {
    if (!value) return t.step6.passwordRequired;
    if (value.length < 8) return t.step6.passwordMin;
    if (!/\d/.test(value)) return t.step6.passwordNumber;
    return undefined;
  }

  function validateConfirmPassword(value: string): string | undefined {
    if (!value) return t.step6.confirmRequired;
    if (password !== value) return t.step6.confirmMismatch;
    return undefined;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: AccountErrors = {
      email: validateEmail(data.account.email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword) return;

    // TODO [ASAF]: Create account with Supabase Auth before allowing setup access.
    console.log('Creating account', { email: data.account.email });
    saveSetupAccountSession(token, data.account.email);
    saveSetupProgress(token, 1, data);
    onComplete(data);
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-md">
        <p className="text-lg font-semibold text-[#111111]">CutSite</p>
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#111111]">{t.step6.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.step6.sub}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${
                  errors.email ? 'text-red-500' : 'text-[#111111]'
                }`}
              >
                {t.step6.email}
              </label>
              <input
                type="email"
                required
                value={data.account.email}
                onChange={(event) => {
                  const email = event.target.value;
                  setData((current) => ({
                    ...current,
                    account: { ...current.account, email },
                  }));
                  setErrors((current) => ({ ...current, email: validateEmail(email) }));
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              <FieldError message={errors.email ?? null} />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${
                  errors.password ? 'text-red-500' : 'text-[#111111]'
                }`}
              >
                {t.step6.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPassword(value);
                    setErrors((current) => ({
                      ...current,
                      password: validatePassword(value),
                      confirmPassword: confirmPassword
                        ? value === confirmPassword
                          ? undefined
                          : t.step6.confirmMismatch
                        : current.confirmPassword,
                    }));
                  }}
                  className={`w-full rounded-xl border py-3 pl-4 pr-11 text-sm outline-none ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? t.step6.hidePassword : t.step6.showPassword}
                >
                  <PasswordVisibilityIcon visible={showPassword} />
                </button>
              </div>
              <FieldError message={errors.password ?? null} />

              <div className="mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <span
                      key={bar}
                      className={`h-1 w-1/4 rounded-full ${
                        passwordStrength.bars >= bar
                          ? passwordStrength.colorClass
                          : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.bars > 0 && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    {passwordStrength.bars === 1 && t.step6.weak}
                    {passwordStrength.bars === 2 && t.step6.fair}
                    {passwordStrength.bars === 3 && t.step6.good}
                    {passwordStrength.bars === 4 && t.step6.strong}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${
                  errors.confirmPassword ? 'text-red-500' : 'text-[#111111]'
                }`}
              >
                {t.step6.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(event) => {
                    const value = event.target.value;
                    setConfirmPassword(value);
                    setErrors((current) => ({
                      ...current,
                      confirmPassword: validateConfirmPassword(value),
                    }));
                  }}
                  className={`w-full rounded-xl border py-3 pl-4 pr-11 text-sm outline-none ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? t.step6.hidePassword : t.step6.showPassword}
                >
                  <PasswordVisibilityIcon visible={showConfirmPassword} />
                </button>
              </div>
              <FieldError message={errors.confirmPassword ?? null} />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
              <p className="mb-3">{t.step6.infoTitle}</p>
              <div className="space-y-2">
                {[t.step6.manageSite, t.step6.manageBookings, t.step6.manageTeam].map((line) => (
                  <p key={line} className="flex items-start gap-2">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#111111] py-3.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {t.step6.createAccount}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SetupWizardContent({
  token,
  initialStep,
  initialData,
}: {
  token: string;
  initialStep: number;
  initialData: SetupData;
}) {
  const { setProgress, registerSaveHandler } = useSetupShell();
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [data, setData] = useState<SetupData>(() =>
    structuredClone(initialData),
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [shakeNext, setShakeNext] = useState(false);
  const [highlightRequired, setHighlightRequired] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [taglineError, setTaglineError] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleWarning, setGoogleWarning] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [instagramWarning, setInstagramWarning] = useState<string | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);
  const [facebookWarning, setFacebookWarning] = useState<string | null>(null);
  const [hoursErrors, setHoursErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProgress((currentStep / 6) * 100);
  }, [currentStep, setProgress]);

  useEffect(() => {
    if (currentStep < 6) {
      saveSetupProgress(token, currentStep, data);
    }
  }, [token, currentStep, data]);

  const saveState = useCallback(() => {
    // TODO [ASAF]: Replace with real progress saving to database
    console.log('Setup saved', { currentStep, data });
    setToast({
      message: t.toasts.progressSaved,
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
    const nameErr = validateSetupName(data.details.name);
    const taglineErr = validateTagline(data.details.tagline);
    const whatsappErr = validateWhatsappNumber(data.details.whatsappNumber);
    const subErr = validateSubdomain(data.details.subdomain);
    const addrErr = validateAddress(data.details.address);
    const aboutErr = validateAbout(data.details.about);
    const { error: gErr } = validateGoogleMapsUrl(data.details.googleMapsUrl);
    const { error: instagramErr } = validateSocialUrl(
      data.details.instagramUrl,
      'instagram.com',
    );
    const { error: facebookErr } = validateSocialUrl(
      data.details.facebookUrl,
      'facebook.com',
    );
    return (
      !nameErr &&
      !taglineErr &&
      !whatsappErr &&
      !subErr &&
      !addrErr &&
      !aboutErr &&
      !gErr &&
      !instagramErr &&
      !facebookErr
    );
  }

  async function handleNext() {
    if (currentStep === 1) {
      const nameErr = validateSetupName(data.details.name);
      const taglineErr = validateTagline(data.details.tagline);
      const whatsappErr = validateWhatsappNumber(data.details.whatsappNumber);
      const subErr = validateSubdomain(data.details.subdomain);
      const addrErr = validateAddress(data.details.address);
      const aboutErr = validateAbout(data.details.about);
      const { error: gErr, warning: gWarn } = validateGoogleMapsUrl(
        data.details.googleMapsUrl,
      );
      const { error: instagramErr, warning: instagramWarn } = validateSocialUrl(
        data.details.instagramUrl,
        'instagram.com',
      );
      const { error: facebookErr, warning: facebookWarn } = validateSocialUrl(
        data.details.facebookUrl,
        'facebook.com',
      );

      setNameError(nameErr);
      setTaglineError(taglineErr);
      setWhatsappError(whatsappErr);
      setSubdomainError(subErr);
      setAddressError(addrErr);
      setAboutError(aboutErr);
      setGoogleError(gErr);
      setGoogleWarning(gWarn);
      setInstagramError(instagramErr);
      setInstagramWarning(instagramWarn);
      setFacebookError(facebookErr);
      setFacebookWarning(facebookWarn);

      if (
        nameErr ||
        taglineErr ||
        whatsappErr ||
        subErr ||
        addrErr ||
        aboutErr ||
        gErr ||
        instagramErr ||
        facebookErr
      ) {
        setHighlightRequired(true);
        triggerInvalidNext();
        if (nameErr) scrollToFirstError('[data-field="name"]');
        else if (taglineErr) scrollToFirstError('[data-field="tagline"]');
        else if (whatsappErr) scrollToFirstError('[data-field="whatsapp"]');
        else if (subErr) scrollToFirstError('[data-field="subdomain"]');
        else if (addrErr) scrollToFirstError('[data-field="address"]');
        else if (instagramErr) scrollToFirstError('[data-field="instagram"]');
        else if (facebookErr) scrollToFirstError('[data-field="facebook"]');
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
    setDirection('forward');
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    if (currentStep > 1) {
      setDirection('back');
      setCurrentStep((s) => s - 1);
    }
  }

  function handleComplete() {
    setSaving(true);
    console.log('Completing setup', data);
    setTimeout(() => {
      setSaving(false);
      setDirection('forward');
      setCurrentStep(6);
    }, 500);
  }

  if (currentStep === 6) {
    return (
      <div className="animate-step-fade-up">
        <SetupComplete data={data} onDone={() => {}} />
      </div>
    );
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
        onStepClick={(step) => {
          if (step < currentStep) {
            setDirection('back');
            setCurrentStep(step);
          }
        }}
        labels={t.stepper}
      />

      <div
        key={currentStep}
        className={direction === 'back' ? 'animate-step-in-left' : 'animate-step-in-right'}
      >
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111111]">{t.step1.title}</h1>
            <p className="text-gray-500 mt-1">{t.step1.sub}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#111111]">
              {t.step1.languageLabel}
            </label>
            <p className="text-xs text-gray-500 mb-3">{t.step1.languageSub}</p>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGE_OPTIONS.map((option) => {
                const selected = data.details.language === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        details: { ...d.details, language: option.id },
                      }))
                    }
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
            <p className="mt-3 text-xs text-gray-500">
              {t.step1.languageNote.replace(
                '{language}',
                LANGUAGE_OPTIONS.find((option) => option.id === data.details.language)?.label ??
                  'עברית',
              )}
            </p>
          </div>

          <div data-field="name">
            <label className={`block text-sm font-medium mb-1.5 ${nameError ? 'text-red-500' : 'text-[#111111]'}`}>
              {t.step1.nameLabel}
            </label>
            <p className="text-xs text-gray-500 mb-2">{t.step1.nameSub}</p>
            <input
              type="text"
              value={data.details.name}
              onChange={(e) => {
                const value = e.target.value;
                setData((d) => ({ ...d, details: { ...d.details, name: value } }));
                setNameError(validateSetupName(value));
                setHighlightRequired(false);
              }}
              placeholder={t.step1.namePlaceholder}
              className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
                nameError || (highlightRequired && !data.details.name)
                  ? 'border-red-500'
                  : 'border-gray-200'
              }`}
            />
            <FieldError message={nameError} />
          </div>

          <div data-field="tagline">
            <label className={`flex items-center gap-2 text-sm font-medium mb-1.5 ${taglineError ? 'text-red-500' : 'text-[#111111]'}`}>
              {t.step1.taglineLabel}
              <span className="text-xs font-normal text-gray-400">{t.optional}</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">{t.step1.taglineSub}</p>
            <input
              type="text"
              value={data.details.tagline}
              maxLength={100}
              onChange={(e) => {
                const value = e.target.value;
                setData((d) => ({ ...d, details: { ...d.details, tagline: value } }));
                setTaglineError(validateTagline(value));
              }}
              placeholder={t.step1.taglinePlaceholder}
              className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
                taglineError ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <div className="flex justify-between mt-1">
              <FieldError message={taglineError} />
              <span
                className={`text-xs ml-auto ${
                  data.details.tagline.length > 80 ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {data.details.tagline.length} / 80
              </span>
            </div>
          </div>

          <div data-field="whatsapp">
            <label className={`block text-sm font-medium mb-1.5 ${whatsappError ? 'text-red-500' : 'text-[#111111]'}`}>
              {t.step1.whatsappLabel}
            </label>
            <p className="text-xs text-gray-500 mb-2">{t.step1.whatsappSub}</p>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M12.04 2C6.56 2 2.1 6.45 2.1 11.93c0 1.75.46 3.46 1.34 4.97L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.48 0 9.94-4.45 9.94-9.93C21.99 6.45 17.53 2 12.04 2zm5.84 14.19c-.25.7-1.47 1.34-2.03 1.39-.52.05-1.17.07-1.89-.12-.44-.12-1-.33-1.72-.65-3.03-1.31-5-4.36-5.15-4.56-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38h.58c.18.01.43-.07.67.51.25.6.85 2.08.92 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.16 1.36 2.46 1.51.3.15.48.13.66-.08.2-.23.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.36.08.13.08.75-.17 1.48z" />
              </svg>
              <input
                type="text"
                value={data.details.whatsappNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((d) => ({ ...d, details: { ...d.details, whatsappNumber: value } }));
                  setWhatsappError(validateWhatsappNumber(value));
                  setHighlightRequired(false);
                }}
                placeholder={t.step1.whatsappPlaceholder}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none ${
                  whatsappError || (highlightRequired && !data.details.whatsappNumber)
                    ? 'border-red-500'
                    : 'border-gray-200'
                }`}
              />
            </div>
            <FieldError message={whatsappError} />
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

          <div data-field="instagram">
            <label className="flex items-center gap-2 text-sm font-medium text-[#111111] mb-1.5">
              {t.step1.instagramLabel}
              <span className="text-xs font-normal text-gray-400">{t.optional}</span>
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3" />
                <path d="M16.5 7.5h.01" />
              </svg>
              <input
                type="url"
                value={data.details.instagramUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((d) => ({
                    ...d,
                    details: { ...d.details, instagramUrl: value },
                  }));
                  const { error, warning } = validateSocialUrl(value, 'instagram.com');
                  setInstagramError(error);
                  setInstagramWarning(warning);
                }}
                placeholder={t.step1.instagramPlaceholder}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none ${
                  instagramError ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            <FieldError message={instagramError} />
            {instagramWarning && !instagramError && (
              <p className="text-sm text-yellow-600 mt-1 flex items-start gap-1 animate-fade-in">
                <span aria-hidden>⚠</span>
                {instagramWarning}
              </p>
            )}
          </div>

          <div data-field="facebook">
            <label className="flex items-center gap-2 text-sm font-medium text-[#111111] mb-1.5">
              {t.step1.facebookLabel}
              <span className="text-xs font-normal text-gray-400">{t.optional}</span>
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
              <input
                type="url"
                value={data.details.facebookUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((d) => ({
                    ...d,
                    details: { ...d.details, facebookUrl: value },
                  }));
                  const { error, warning } = validateSocialUrl(value, 'facebook.com');
                  setFacebookError(error);
                  setFacebookWarning(warning);
                }}
                placeholder={t.step1.facebookPlaceholder}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none ${
                  facebookError ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            <FieldError message={facebookError} />
            {facebookWarning && !facebookError && (
              <p className="text-sm text-yellow-600 mt-1 flex items-start gap-1 animate-fade-in">
                <span aria-hidden>⚠</span>
                {facebookWarning}
              </p>
            )}
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
                services: {
                  ...d.services,
                  globalShowPrices: v,
                  selectedServices: d.services.selectedServices.map((service) => ({
                    ...service,
                    showPrice: v,
                  })),
                },
              }))
            }
            onGlobalShowDurationsChange={(v) =>
              setData((d) => ({
                ...d,
                services: {
                  ...d.services,
                  globalShowDurations: v,
                  selectedServices: d.services.selectedServices.map((service) => ({
                    ...service,
                    showDuration: v,
                  })),
                },
              }))
            }
            onSelectedServicesChange={(selectedServices) =>
              setData((d) => ({
                ...d,
                services: { ...d.services, selectedServices },
              }))
            }
            onCustomServiceAdded={(message) =>
              setToast({ message, variant: 'success' })
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
              setToast({
                message: t.toasts.inviteSent.replace('{name}', invite.name),
                variant: 'success',
              });
            }}
          />

          <InviteList
            invites={data.staff.invites}
            onRemove={(id) => {
              setData((d) => ({
                ...d,
                staff: { invites: d.staff.invites.filter((i) => i.id !== id) },
              }));
              setToast({ message: t.toasts.inviteRemoved, variant: 'success' });
            }}
          />
        </div>
      )}

      </div>

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
