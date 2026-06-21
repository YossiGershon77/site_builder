import Link from 'next/link';

export default function SetupExpiredPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-[#111111]">
          This setup link has already been used
        </h1>
        <p className="text-gray-500 mt-3">
          Your site is live. Log in to your dashboard to make changes.
        </p>
        <Link
          href="/login"
          className="inline-block mt-8 px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Go to dashboard
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#111111] transition-colors">
            Visit your site
          </Link>
        </div>
      </div>
    </div>
  );
}
