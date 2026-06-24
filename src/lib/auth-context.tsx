'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  mockCurrentUser,
  mockCurrentUserAsStaff,
  mockCurrentUserAsStaff2,
} from '@/lib/mock';

export type UserRole = 'OWNER' | 'TEAM_MEMBER';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  barberId: string;
  teamMemberId: string | null;
};

type StoredSession = {
  user: AuthUser;
  loginAt: number;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const SESSION_KEY = 'cutsite_session';
const LEGACY_SESSION_EMAIL_KEY = 'cutsite.mockAuthEmail';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const AuthContext = createContext<AuthContextType | null>(null);

function findMockUser(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();

  if (normalized === 'eduardo@demo.com') return mockCurrentUser;
  if (normalized === 'yossi@demo.com') return mockCurrentUserAsStaff;
  if (normalized === 'amit@demo.com') return mockCurrentUserAsStaff2;

  return null;
}

function readStoredSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as StoredSession;

    // TODO [ASAF]: Session expiry will be handled by Supabase Auth token refresh. Remove
    // this manual check when real auth is implemented.
    if (Date.now() - session.loginAt > SESSION_MAX_AGE_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session.user;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredSession());
    setIsLoading(false);
  }, []);

  async function login(email: string, _password: string): Promise<boolean> {
    // TODO [ASAF]: Replace with Supabase Auth signInWithPassword()
    const authUser = findMockUser(email);
    if (!authUser) return false;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        user: authUser,
        loginAt: Date.now(),
      }),
    );
    localStorage.setItem(LEGACY_SESSION_EMAIL_KEY, authUser.email);
    setUser(authUser);
    window.dispatchEvent(new Event('cutsite-auth-change'));
    return true;
  }

  function logout() {
    // TODO [ASAF]: Replace with Supabase Auth signOut()
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_SESSION_EMAIL_KEY);
    setUser(null);
    window.dispatchEvent(new Event('cutsite-auth-change'));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
