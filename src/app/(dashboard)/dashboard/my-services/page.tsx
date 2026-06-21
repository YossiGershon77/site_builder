'use client';

import Link from 'next/link';
import { useDashboard } from '@/lib/dashboard/context';

export default function MyServicesPage() {
  const { user, barber } = useDashboard();

  if (user.role !== 'TEAM_MEMBER') {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <p className="text-gray-600">This page is only available to team members</p>
        <Link href="/dashboard" className="inline-block mt-4 text-sm font-medium text-[#111111] hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const member = barber.teamMembers.find((m) => m.id === user.teamMemberId);
  const memberServiceIds = new Set(member?.services.map((s) => s.service.id) ?? []);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const selected = barber.services
      .filter((s) => form.get(`service-${s.id}`) === 'on')
      .map((s) => s.id);
    console.log('Save my services:', selected);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-[#111111] mb-2">My services</h1>
      <p className="text-sm text-gray-500 mb-8">
        Choose which services you offer. Clients will only be able to book these with you.
      </p>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        {barber.services.map((service) => (
          <label
            key={service.id}
            className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              name={`service-${service.id}`}
              defaultChecked={memberServiceIds.has(service.id)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#111111]">{service.name}</p>
              <p className="text-xs text-gray-400">
                {service.durationMinutes} min · {service.priceDisplay}
              </p>
            </div>
          </label>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
