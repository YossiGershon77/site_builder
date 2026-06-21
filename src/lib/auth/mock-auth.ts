'use client';

import {
  mockCurrentUser,
  mockStaffUsers,
  type MockUser,
} from '@/lib/mock';

const MOCK_AUTH_EMAIL_KEY = 'cutsite.mockAuthEmail';

export function findMockUserByEmail(email: string): MockUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    [mockCurrentUser, ...mockStaffUsers].find(
      (user) => user.email.toLowerCase() === normalized,
    ) ?? null
  );
}

export function setMockAuthenticatedUser(email: string): MockUser | null {
  const user = findMockUserByEmail(email);
  if (!user || typeof window === 'undefined') return user;

  localStorage.setItem(MOCK_AUTH_EMAIL_KEY, user.email);
  window.dispatchEvent(new Event('cutsite-auth-change'));
  return user;
}

export function getMockAuthenticatedUser(): MockUser | null {
  if (typeof window === 'undefined') return null;
  const email = localStorage.getItem(MOCK_AUTH_EMAIL_KEY);
  return email ? findMockUserByEmail(email) : null;
}

export function clearMockAuthenticatedUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MOCK_AUTH_EMAIL_KEY);
  window.dispatchEvent(new Event('cutsite-auth-change'));
}
