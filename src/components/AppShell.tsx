'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { NavBar } from '@/components/NavBar';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const barber = t.barber;

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-1.5 px-4">
          {t.common.demoBanner}
        </div>
      )}

      <NavBar barberName={barber.name} />

      <main>{children}</main>

      <footer className="border-t border-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-1">
          <p className="text-sm text-gray-400">
            {barber.name} · {barber.neighborhood}
          </p>
          {barber.whatsappNumber && (
            <Link
              href={`https://wa.me/${barber.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t.common.whatsapp}
            </Link>
          )}
          <p className="text-xs text-gray-400">{t.common.poweredBy}</p>
        </div>
      </footer>

      <WhatsAppButton whatsappNumber={barber.whatsappNumber} />
    </>
  );
}
