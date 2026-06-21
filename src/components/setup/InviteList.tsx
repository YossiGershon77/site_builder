'use client';

import { useState } from 'react';
import type { SetupInvite } from '@/lib/mock';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function InviteList({
  invites,
  onRemove,
}: {
  invites: SetupInvite[];
  onRemove: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (invites.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
        <span className="text-3xl block mb-3" aria-hidden>👥</span>
        <p className="font-medium text-[#111111]">No team members yet</p>
        <p className="text-sm text-gray-500 mt-1">
          You can always invite people later from your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => {
        const confirming = confirmId === invite.id;

        return (
          <div
            key={invite.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
              confirming ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
            }`}
          >
            {!confirming ? (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                  {getInitials(invite.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111111] truncate">{invite.name}</p>
                  <p className="text-sm text-gray-400 truncate">{invite.email}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 flex-shrink-0">
                  Pending
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmId(invite.id)}
                  className="text-sm text-red-500 hover:text-red-600 flex-shrink-0"
                >
                  Remove
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between w-full gap-3">
                <p className="text-sm text-red-700">Remove {invite.name}?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onRemove(invite.id);
                      setConfirmId(null);
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
