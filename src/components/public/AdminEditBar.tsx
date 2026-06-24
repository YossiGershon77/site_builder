'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMockAuthenticatedUser } from '@/lib/auth/mock-auth';
import { useLanguage } from '@/lib/i18n/context';
import { mockSetupSession, type MockUser } from '@/lib/mock';

export function AdminEditBar() {
  const { t } = useLanguage();
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const syncUser = () => setUser(getMockAuthenticatedUser());

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('cutsite-auth-change', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('cutsite-auth-change', syncUser);
    };
  }, []);

  if (user?.role !== 'OWNER') return null;

  const setupToken = mockSetupSession.token;

  return (
    <div className="sticky top-16 z-40 border-b border-gray-200 bg-[#111111] text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm font-medium">{t.adminEditBar.title}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/setup?token=${setupToken}&step=1`}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
          >
            {t.adminEditBar.editDetails}
          </Link>
          <Link
            href={`/setup?token=${setupToken}&step=2`}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-gray-100 transition-colors"
          >
            {t.adminEditBar.editServices}
          </Link>
        </div>
      </div>
    </div>
  );
}
