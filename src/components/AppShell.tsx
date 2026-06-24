'use client';

import { useLanguage } from '@/lib/i18n/context';
import { NavBar } from '@/components/NavBar';
import { PageTransition } from '@/components/PageTransition';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AdminEditBar } from '@/components/public/AdminEditBar';
import { Footer } from '@/components/public/Footer';

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
      <AdminEditBar />

      <main>
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer barber={barber} />

      {barber.whatsappNumber && <WhatsAppButton whatsappNumber={barber.whatsappNumber} />}
    </>
  );
}
