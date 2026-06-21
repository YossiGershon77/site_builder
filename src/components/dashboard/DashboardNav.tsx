'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboard } from '@/lib/dashboard/context';

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    schedule: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    hours: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    services: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    team: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    external: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    ),
    more: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  ownerOnly?: boolean;
  staffOnly?: boolean;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, barber } = useDashboard();

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Schedule', icon: 'schedule' },
    { href: '/dashboard/my-hours', label: 'My Hours', icon: 'hours' },
    { href: '/dashboard/my-services', label: 'My Services', icon: 'services', staffOnly: true },
    { href: '/dashboard/team', label: 'Team', icon: 'team', ownerOnly: true },
  ];

  const visibleItems = navItems.filter((item) => {
    if (item.ownerOnly && user.role !== 'OWNER') return false;
    if (item.staffOnly && user.role !== 'TEAM_MEMBER') return false;
    return true;
  });

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-100">
        <p className="font-semibold text-[#111111]">{barber.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-gray-100 text-[#111111] font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#111111]'
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}

        <div className="my-4 border-t border-gray-100" />

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors"
        >
          <NavIcon name="external" />
          Back to site
        </Link>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors"
        >
          <NavIcon name="logout" />
          Sign out
        </button>
      </nav>
    </aside>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useDashboard();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryTabs: NavItem[] = [
    { href: '/dashboard', label: 'Schedule', icon: 'schedule' },
    { href: '/dashboard/my-hours', label: 'Hours', icon: 'hours' },
    user.role === 'OWNER'
      ? { href: '/dashboard/team', label: 'Team', icon: 'team' }
      : { href: '/dashboard/my-services', label: 'Services', icon: 'services' },
  ];

  const moreItems: NavItem[] = [
    ...(user.role === 'TEAM_MEMBER'
      ? [{ href: '/dashboard/my-services', label: 'My Services', icon: 'services' }]
      : []),
    ...(user.role === 'OWNER'
      ? [{ href: '/dashboard/team', label: 'Team', icon: 'team' }]
      : []),
    { href: '/', label: 'Back to site', icon: 'external' },
    { href: '/login', label: 'Sign out', icon: 'logout' },
  ].filter(
    (item, idx, arr) => arr.findIndex((other) => other.href === item.href) === idx,
  ) as NavItem[];

  const filteredMore = moreItems.filter(
    (item) => !primaryTabs.some((tab) => tab.href === item.href),
  );

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-sm">
        <div className="flex items-center justify-around px-2 py-2">
          {primaryTabs.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[64px] ${
                  active ? 'text-[#111111]' : 'text-gray-400'
                }`}
              >
                <NavIcon name={item.icon} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[64px] text-gray-400"
          >
            <NavIcon name="more" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-4 pb-8 space-y-1">
            {filteredMore.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  if (item.label === 'Sign out') router.push('/login');
                  else router.push(item.href);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                <NavIcon name={item.icon} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
