'use client';

import { useState } from 'react';
import type { SetupInvite } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';
import { getSetupTranslations } from '@/lib/setup/translations';

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
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (invites.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
        <span className="text-3xl block mb-3" aria-hidden>👥</span>
        <p className="font-medium text-[#111111]">{t.invite.emptyTitle}</p>
        <p className="text-sm text-gray-500 mt-1">
          {t.invite.emptySub}
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
                  {t.invite.pending}
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmId(invite.id)}
                  className="text-sm text-red-500 hover:text-red-600 flex-shrink-0"
                >
                  {t.invite.remove}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between w-full gap-3">
                <p className="text-sm text-red-700">
                  {t.invite.removeQuestion.replace('{name}', invite.name)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onRemove(invite.id);
                      setConfirmId(null);
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    {t.invite.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {t.invite.cancel}
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
