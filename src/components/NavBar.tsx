'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/LanguageToggle';
import { getMockAuthenticatedUser } from '@/lib/auth/mock-auth';
import type { MockUser } from '@/lib/mock';

interface NavBarProps {
  barberName: string;
}

export function NavBar({ barberName }: NavBarProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<MockUser | null>(null);

  const navLinks = [
    { href: '/services', label: t.nav.services },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/about', label: t.nav.about },
    { href: '/reviews', label: t.nav.reviews },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      setAuthenticatedUser(getMockAuthenticatedUser());
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('cutsite-auth-change', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('cutsite-auth-change', syncUser);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link
            href="/"
            className="font-semibold text-[#111111] tracking-tight text-lg shrink-0"
          >
            {barberName}
          </Link>

          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-[#111111] transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            {authenticatedUser && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#111111] hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                {t.nav.manage}
              </Link>
            )}
            <Link
              href="/booking"
              className="bg-[#111111] text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              {t.common.bookNow}
            </Link>
            <LanguageToggle className="ml-2" />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button
              className="p-2 text-gray-500 hover:text-[#111111] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-3 text-sm text-gray-600 hover:text-[#111111] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {authenticatedUser && (
              <Link
                href="/dashboard"
                className="block px-2 py-3 text-sm font-medium text-[#111111] hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.manage}
              </Link>
            )}
            <Link
              href="/booking"
              className="block mt-2 bg-[#111111] text-white text-sm px-5 py-3 rounded-full text-center hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.common.bookNow}
            </Link>
            <div className="mt-4 pt-4 border-t border-gray-100 px-2">
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
