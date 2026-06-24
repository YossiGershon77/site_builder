'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { getSetupTranslations } from '@/lib/setup/translations';

export default function SetupExpiredPage() {
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-[#111111]">
          {t.linkPages.expiredTitle}
        </h1>
        <p className="text-gray-500 mt-3">
          {t.linkPages.expiredSub}
        </p>
        <Link
          href="/login"
          className="inline-block mt-8 px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t.linkPages.goDashboard}
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#111111] transition-colors">
            {t.linkPages.visitSite}
          </Link>
        </div>
      </div>
    </div>
  );
}
