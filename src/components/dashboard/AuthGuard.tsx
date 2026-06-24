'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 text-gray-400">
        <span className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.user, router]);

  if (auth.isLoading) return <LoadingState />;
  if (!auth.user) return null;

  return <>{children}</>;
}
