// TODO [ASAF]: Replace with real API call
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SETUP_DOMAIN, formatWorkingDaysSummary } from '@/lib/setup/constants';
import { formatTimeForLocale } from '@/lib/setup/time-format';
import type { SetupData } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';
import { Toast, type ToastState } from './Toast';

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ['#111111', '#9ca3af', '#e5e7eb'][i % 3],
    angle: (i / 40) * 360,
    size: 4 + (i % 3) * 2,
    delay: (i % 5) * 0.05,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute left-1/2 top-1/3 animate-confetti"
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: piece.id % 2 === 0 ? '50%' : '0',
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.angle}deg) translateY(0)`,
            ['--confetti-angle' as string]: `${piece.angle}deg`,
          }}
        />
      ))}
    </div>
  );
}

export function SetupComplete({
  data,
  onDone,
}: {
  data: SetupData;
  onDone: () => void;
}) {
  const { locale } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const subdomain = data.details.subdomain || 'your-shop';
  const siteUrl = `${subdomain}.${SETUP_DOMAIN}`;
  const daysSummary = formatWorkingDaysSummary(data.hours.workingDays);
  const hoursSummary =
    data.hours.workStartTime && data.hours.workEndTime
      ? `${daysSummary}, ${formatTimeForLocale(data.hours.workStartTime, locale)}–${formatTimeForLocale(data.hours.workEndTime, locale)}`
      : daysSummary;

  useEffect(() => {
    // TODO [ASAF]: POST /api/setup/{token}/complete
    console.log('Setup complete', data);
    onDone();

    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, [data, onDone]);

  async function copyUrl() {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setToast({ message: 'Link copied!', variant: 'success' });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="py-8 text-center">
        <h1 className="text-3xl font-semibold text-[#111111]">You&apos;re all set! 🎉</h1>
        <p className="text-gray-500 mt-2">Your site is ready. Here&apos;s a summary:</p>

        <div className="mt-8 bg-gray-50 rounded-2xl p-6 text-start space-y-3">
          {[
            `Site address: ${siteUrl}`,
            `${data.services.selectedServices.length} services configured`,
            data.hours.workingDays.length > 0
              ? `Open ${hoursSummary}`
              : 'Hours not configured',
            data.gallery.placePhotos.length > 0
              ? `${data.gallery.placePhotos.length} photos uploaded`
              : 'No photos yet',
            data.staff.invites.length > 0
              ? `${data.staff.invites.length} team members invited`
              : 'Solo shop',
          ].map((line) => (
            <p key={line} className="flex items-start gap-2 text-sm text-[#111111]">
              <span className="text-green-500 flex-shrink-0">✓</span>
              {line}
            </p>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-3">Your site is live at:</p>
          <div className="border-2 border-[#111111] rounded-xl p-4 flex items-center justify-between gap-3">
            <span className="text-xl font-mono text-[#111111] truncate">{siteUrl}</span>
            <button
              type="button"
              onClick={copyUrl}
              className="flex-shrink-0 w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Copy link"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex-1 py-3.5 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-center"
          >
            Visit your site →
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3.5 border-2 border-[#111111] text-[#111111] font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
