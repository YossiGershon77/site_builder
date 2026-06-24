'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  return (
    <div key={`${pathname}-${locale}`} className="animate-page-fade-up motion-reduce:animate-none">
      {children}
    </div>
  );
}
