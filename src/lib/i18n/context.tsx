'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { localizeBarberServices, mockBarber, type MockBarber } from '@/lib/mock';
import {
  defaultLocale,
  translations,
  type Locale,
  type Translations,
} from './translations';

const STORAGE_KEY = 'locale';

interface LanguageContextValue {
  locale: Locale;
  t: Omit<Translations, 'barber'> & { barber: MockBarber };
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'he' ? stored : defaultLocale;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, mounted]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const base = translations[locale];
    return {
      locale,
      t: {
        ...base,
        barber: {
          ...mockBarber,
          services: localizeBarberServices(mockBarber.services, locale),
        },
      },
      setLocale,
    };
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
