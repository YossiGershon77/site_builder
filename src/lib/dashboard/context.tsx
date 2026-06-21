'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mockBarber, mockCurrentUser, type MockBarber, type MockUser } from '@/lib/mock';
import { getMockAuthenticatedUser } from '@/lib/auth/mock-auth';

interface DashboardContextValue {
  user: MockUser;
  barber: MockBarber;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<MockUser>(mockCurrentUser);

  useEffect(() => {
    const syncUser = () => {
      setActiveUser(getMockAuthenticatedUser() ?? mockCurrentUser);
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
    <DashboardContext.Provider value={{ user: activeUser, barber: mockBarber }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
