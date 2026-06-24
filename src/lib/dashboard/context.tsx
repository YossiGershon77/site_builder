'use client';

import { createContext, useContext } from 'react';
import { mockBarber, type MockBarber } from '@/lib/mock';
import { useAuth, type AuthUser } from '@/lib/auth-context';

interface DashboardContextValue {
  user: AuthUser;
  barber: MockBarber;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardContext.Provider value={{ user, barber: mockBarber }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
