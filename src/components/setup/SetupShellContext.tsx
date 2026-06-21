'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { getSetupTranslations } from '@/lib/setup/translations';
import { useLanguage } from '@/lib/i18n/context';

interface SetupShellContextValue {
  progress: number;
  setProgress: (value: number) => void;
  registerSaveHandler: (handler: () => void) => void;
}

const SetupShellContext = createContext<SetupShellContextValue | null>(null);

export function SetupShellProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(16.6);
  const saveHandlerRef = useRef<() => void>(() => {});

  return (
    <SetupShellContext.Provider
      value={{
        progress,
        setProgress,
        registerSaveHandler: (handler) => {
          saveHandlerRef.current = handler;
        },
      }}
    >
      <SetupShell onSaveExit={() => saveHandlerRef.current()}>
        {children}
      </SetupShell>
    </SetupShellContext.Provider>
  );
}

export function useSetupShell() {
  const context = useContext(SetupShellContext);
  if (!context) {
    throw new Error('useSetupShell must be used within SetupShellProvider');
  }
  return context;
}

function SetupShell({
  children,
  onSaveExit,
}: {
  children: ReactNode;
  onSaveExit: () => void;
}) {
  const { progress } = useSetupShell();
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-[#111111]">CutSite</span>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={onSaveExit}
              className="text-sm text-gray-500 hover:text-[#111111] transition-colors whitespace-nowrap"
            >
              {t.saveExit}
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-[#111111] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
