import Link from 'next/link';

export default function SetupInvalidPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold text-white">!</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#111111]">
          Invalid or expired link
        </h1>
        <p className="text-gray-500 mt-3">
          This setup link is no longer valid. If you think this is a mistake, contact support.
        </p>
        <a
          href="mailto:support@yourplatform.co.il"
          className="inline-block mt-8 px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Contact support
        </a>
        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#111111] transition-colors">
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
