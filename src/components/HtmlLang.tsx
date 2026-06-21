'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export function HtmlLang() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
