import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import { mockBarber } from '@/lib/mock';
import { LanguageProvider } from '@/lib/i18n/context';
import { HtmlLang } from '@/components/HtmlLang';

const heebo = Heebo({ subsets: ['latin', 'hebrew'] });

export const metadata: Metadata = {
  title: mockBarber.name,
  description: mockBarber.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="ltr" suppressHydrationWarning>
      <body className={heebo.className}>
        <LanguageProvider>
          <HtmlLang />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
