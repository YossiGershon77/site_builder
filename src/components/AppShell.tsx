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
