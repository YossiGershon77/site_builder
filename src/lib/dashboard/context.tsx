'use client';

import { createContext, useContext } from 'react';
import { mockBarber, mockCurrentUser, type MockBarber, type MockUser } from '@/lib/mock';

// Swap mockCurrentUser with mockCurrentUserAsStaff to test the staff view
const activeUser = mockCurrentUser;

interface DashboardContextValue {
  user: MockUser;
  barber: MockBarber;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
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
