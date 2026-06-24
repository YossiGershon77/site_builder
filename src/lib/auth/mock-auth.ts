'use client';

import {
  mockCurrentUser,
  mockCurrentUserAsStaff2,
  mockStaffUsers,
  type MockUser,
} from '@/lib/mock';

const MOCK_AUTH_EMAIL_KEY = 'cutsite.mockAuthEmail';
const SESSION_KEY = 'cutsite_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function findMockUserByEmail(email: string): MockUser | null {
  const normalized = email.trim().toLowerCase();
  if (normalized === mockCurrentUserAsStaff2.email.toLowerCase()) return mockCurrentUserAsStaff2;

  return (
    [mockCurrentUser, mockCurrentUserAsStaff2, ...mockStaffUsers].find(
      (user) => user.email.toLowerCase() === normalized,
    ) ?? null
  );
}

export function setMockAuthenticatedUser(email: string): MockUser | null {
  const user = findMockUserByEmail(email);
  if (!user || typeof window === 'undefined') return user;

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user,
      loginAt: Date.now(),
    }),
  );
  localStorage.setItem(MOCK_AUTH_EMAIL_KEY, user.email);
  window.dispatchEvent(new Event('cutsite-auth-change'));
  return user;
}

export function getMockAuthenticatedUser(): MockUser | null {
  if (typeof window === 'undefined') return null;

  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    try {
      const parsed = JSON.parse(session) as { user?: MockUser; loginAt?: number };
      if (parsed.loginAt && Date.now() - parsed.loginAt > SESSION_MAX_AGE_MS) {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(MOCK_AUTH_EMAIL_KEY);
        return null;
      }
      if (parsed.user) return parsed.user;
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  const email = localStorage.getItem(MOCK_AUTH_EMAIL_KEY);
  return email ? findMockUserByEmail(email) : null;
}

export function clearMockAuthenticatedUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(MOCK_AUTH_EMAIL_KEY);
  window.dispatchEvent(new Event('cutsite-auth-change'));
}
