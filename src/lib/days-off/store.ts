'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { initialDaysOff } from '@/lib/mock';
import type { DayOff } from './types';
import { formatDateKey } from './types';

const STORAGE_KEY = 'cutsite-days-off';

type Listener = () => void;
const listeners = new Set<Listener>();

let cache: DayOff[] | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function readStore(): DayOff[] {
  if (typeof window === 'undefined') return initialDaysOff;
  if (cache) return cache;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      cache = JSON.parse(stored) as DayOff[];
      return cache;
    }
  } catch {
    // ignore corrupt storage
  }

  cache = [...initialDaysOff];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  return cache;
}

function writeStore(next: DayOff[]) {
  cache = next;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return readStore();
}

function getServerSnapshot() {
  return initialDaysOff;
}

export function getDaysOff(): DayOff[] {
  return readStore();
}

export function isMemberOff(memberId: string, date: Date): boolean {
  const key = formatDateKey(date);
  return readStore().some((entry) => entry.memberId === memberId && entry.date === key);
}

export function getDaysOffForDate(date: Date): DayOff[] {
  const key = formatDateKey(date);
  return readStore().filter((entry) => entry.date === key);
}

export function getMemberDaysOff(memberId: string): string[] {
  return readStore()
    .filter((entry) => entry.memberId === memberId)
    .map((entry) => entry.date);
}

export function toggleDayOff(memberId: string, name: string, date: Date): boolean {
  const key = formatDateKey(date);
  const current = readStore();
  const existing = current.find((entry) => entry.memberId === memberId && entry.date === key);

  if (existing) {
    writeStore(current.filter((entry) => entry.id !== existing.id));
    return false;
  }

  writeStore([
    ...current,
    {
      id: `do-${memberId}-${key}`,
      date: key,
      memberId,
      name,
    },
  ]);
  return true;
}

export function useDaysOff() {
  const daysOff = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((memberId: string, name: string, date: Date) => {
    toggleDayOff(memberId, name, date);
  }, []);

  return { daysOff, toggle };
}
