'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { getSetupTranslations } from '@/lib/setup/translations';

export default function SetupInvalidPage() {
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold text-white">!</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#111111]">
          {t.linkPages.invalidTitle}
        </h1>
        <p className="text-gray-500 mt-3">
          {t.linkPages.invalidSub}
        </p>
        <a
          href="mailto:support@yourplatform.co.il"
          className="inline-block mt-8 px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t.linkPages.contactSupport}
        </a>
        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#111111] transition-colors">
            {t.linkPages.goHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
