'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function ReviewsPage() {
  const { t } = useLanguage();
  const barber = t.barber;

  return (
    <div className="py-24 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className="w-7 h-7 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#111111]">
          {t.reviews.title}
        </h1>
        <p className="mt-4 text-gray-500 text-lg leading-relaxed">
          {t.reviews.description}
        </p>

        <div className="mt-10">
          {barber.googleReviewsUrl ? (
            <a
              href={barber.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              {t.reviews.readGoogleReviews}
            </a>
          ) : (
            <p className="text-gray-400 text-lg">{t.reviews.comingSoon}</p>
          )}
        </div>
      </div>
    </div>
  );
}
