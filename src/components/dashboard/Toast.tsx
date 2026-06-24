'use client';

import { useEffect } from 'react';

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 bg-[#111111] text-white text-sm rounded-xl shadow-lg animate-toast-in">
      {message}
    </div>
  );
}
