'use client';

import { localeLabels, type Locale } from '@/lib/i18n/translations';
import { useLanguage } from '@/lib/i18n/context';

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === 'he') {
    return (
      <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden shrink-0" aria-hidden>
        <rect width="24" height="16" fill="#FFFFFF" />
        <rect y="3" width="24" height="2" fill="#0038B8" />
        <rect y="11" width="24" height="2" fill="#0038B8" />
        <polygon points="12,5.2 13.73,8.2 10.27,8.2" fill="#0038B8" />
        <polygon points="12,10.8 13.73,7.8 10.27,7.8" fill="#0038B8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden shrink-0" aria-hidden>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="2.4" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M12 0v16M0 8h24" stroke="#FFFFFF" strokeWidth="3.2" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="1.6" />
    </svg>
  );
}

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage();
  const nextLocale: Locale = locale === 'he' ? 'en' : 'he';

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors ${className}`}
      aria-label={`Switch to ${localeLabels[nextLocale]}`}
    >
      <FlagIcon locale={locale} />
      <span>{localeLabels[locale]}</span>
    </button>
  );
}
