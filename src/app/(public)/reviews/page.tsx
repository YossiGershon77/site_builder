'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 8.5L20 4M8.5 15.5L20 20M20 4L14 12M20 20L14 12" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-6.32-3.26M17 20H7m10 0v-2a5 5 0 00-10 0v2m0 0H2v-2a4 4 0 016.32-3.26M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 2a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM8 9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}

function OutlineStarIcon() {
  return (
    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.65 5.37 5.92.86-4.28 4.17 1.01 5.9L12 17l-5.3 2.8 1.01-5.9-4.28-4.17 5.92-.86L12 3.5z" />
    </svg>
  );
}

export default function ReviewsPage() {
  const { t } = useLanguage();
  const barber = t.barber;
  const googleReviewsUrl = barber.googleReviewsUrl;

  const trustIndicators = [
    {
      icon: <ScissorsIcon />,
      // TODO [ASAF]: Add yearsOfExperience field to barber profile
      stat: '25+',
      label: t.reviews.yearsExperience,
    },
    {
      icon: <UsersIcon />,
      stat: '1,000+',
      label: t.reviews.happyClients,
    },
    {
      icon: <OutlineStarIcon />,
      stat: '5.0',
      label: t.reviews.averageRating,
    },
  ];

  const valueCards = [
    {
      title: t.reviews.valuePrecisionTitle,
      description: t.reviews.valuePrecisionDescription,
    },
    {
      title: t.reviews.valueAtmosphereTitle,
      description: t.reviews.valueAtmosphereDescription,
    },
    {
      title: t.reviews.valueConsistencyTitle,
      description: t.reviews.valueConsistencyDescription,
    },
  ];

  return (
    <div>
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="uppercase tracking-widest text-xs text-gray-400">
            {t.reviews.reputation}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} className="w-10 h-10 text-[#F59E0B]" />
            ))}
          </div>
          <p className="mt-5 text-lg text-gray-500">
            {googleReviewsUrl ? t.reviews.seeOnGoogle : t.reviews.comingSoon}
          </p>
          <div className="mt-8">
            {googleReviewsUrl ? (
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                {t.reviews.readOnGoogle}
              </a>
            ) : (
              <p className="text-gray-400 text-lg">{t.reviews.comingSoon}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* TODO [ASAF]: Pull real stats from Google Places API */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {trustIndicators.map((indicator) => (
              <div
                key={indicator.label}
                className="flex flex-col items-center text-center py-8 first:pt-0 last:pb-0 md:py-0"
              >
                {indicator.icon}
                <p className="mt-4 text-3xl font-semibold text-[#111111]">
                  {indicator.stat}
                </p>
                <p className="mt-1 text-sm text-gray-500">{indicator.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111111] text-center">
            {t.reviews.loveTitle}
          </h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="relative bg-white rounded-2xl border border-gray-100 p-8 overflow-hidden"
              >
                <span className="absolute top-4 left-5 text-5xl text-gray-200 font-serif leading-none" aria-hidden>
                  &quot;
                </span>
                <div className="relative pt-8">
                  <h2 className="text-lg font-medium text-[#111111]">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-xs text-gray-400 text-center">
            {t.reviews.googleHint}
          </p>
        </div>
      </section>

      <section className="bg-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111111]">
            {t.reviews.ctaTitle}
          </h2>
          <p className="mt-2 text-gray-500">{t.reviews.ctaSub}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              {t.common.bookNow}
            </Link>
            {googleReviewsUrl && (
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 border border-[#111111] text-[#111111] font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                {t.reviews.readGoogleReviews}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
