'use client';

import { DashboardProvider } from '@/lib/dashboard/context';
import { DashboardMobileNav, DashboardSidebar } from '@/components/dashboard/DashboardNav';
import { PageTransition } from '@/components/PageTransition';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="md:pl-64 pb-20 md:pb-0">
          <main className="p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <DashboardMobileNav />
      </div>
    </DashboardProvider>
  );
}
