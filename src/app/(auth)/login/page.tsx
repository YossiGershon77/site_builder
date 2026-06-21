'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockLoginEmails } from '@/lib/mock';

const validEmails = mockLoginEmails;

function ScissorsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path strokeLinecap="round" d="M8.5 8.5L20 4M8.5 15.5L20 20M20 4L14 12M20 20L14 12" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const password = String(form.get('password') ?? '');

    console.log('Login attempt:', { email, password });

    if (validEmails.includes(email)) {
      router.push('/dashboard');
      return;
    }

    setError('Invalid email or password');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-[#111111] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <ScissorsIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-lg font-semibold tracking-tight">CutSite</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl xl:text-5xl font-semibold text-white leading-tight tracking-tight">
            Run your shop,<br />not your inbox.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Appointments, team schedules, and client management — all in one place.
          </p>
        </div>

        <p className="relative z-10 text-white/30 text-sm">
          Trusted by barbers across Israel
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center">
              <ScissorsIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#111111]">CutSite</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">Staff login</h1>
              <p className="text-sm text-gray-500 mt-1.5">
                For barbers and team members only
              </p>
            </div>

            <form onSubmit={handleSubmit} method="post" className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@shop.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-gray-400 transition-all bg-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-gray-400 transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 rounded-xl bg-white border border-dashed border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">Demo credentials</p>
              <div className="space-y-1 text-xs text-gray-400 font-mono">
                <p>Admin: eduardo@demo.com</p>
                <p>Staff: yossi@demo.com · amit@demo.com</p>
                <p>Staff: daniel@demo.com · ronen@demo.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
