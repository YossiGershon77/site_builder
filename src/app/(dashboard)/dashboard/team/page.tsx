'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDashboard } from '@/lib/dashboard/context';
import { useLanguage } from '@/lib/i18n/context';
import { DAY_LABELS, DAY_LABELS_HE, formatHoursSummary, getInitials } from '@/lib/dashboard/utils';
import type { TeamMember } from '@/lib/mock';
import {
  EditHoursModal,
  EditServicesModal,
  InviteModal,
  RemoveMemberDialog,
} from '@/components/dashboard/TeamModals';
import { Toast } from '@/components/dashboard/Toast';

function MemberMenu({
  member,
  onEditServices,
  onEditHours,
  onRemove,
  labels,
}: {
  member: TeamMember;
  onEditServices: () => void;
  onEditHours: () => void;
  onRemove: () => void;
  labels: ReturnType<typeof useLanguage>['t']['dashboard']['team'];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label={labels.options}
      >
        ⋯
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10"
            aria-label={labels.closeMenu}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
            <button
              type="button"
              onClick={() => { setOpen(false); onEditServices(); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {labels.editServices}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onEditHours(); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {labels.editHours}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onRemove(); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              {labels.removeFromTeam}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamPage() {
  const { user, barber } = useDashboard();
  const { locale, t } = useLanguage();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editServicesMember, setEditServicesMember] = useState<TeamMember | null>(null);
  const [editHoursMember, setEditHoursMember] = useState<TeamMember | null>(null);
  const [removeMember, setRemoveMember] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (user.role !== 'OWNER') {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <p className="text-gray-600">{t.dashboard.team.noPermission}</p>
        <Link href="/dashboard" className="inline-block mt-4 text-sm font-medium text-[#111111] hover:underline">
          {t.dashboard.team.backToDashboard}
        </Link>
      </div>
    );
  }

  const activeMembers = barber.teamMembers.filter((m) => m.inviteAccepted);
  const pendingInvites = barber.teamMembers.filter((m) => !m.inviteAccepted);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#111111]">{t.dashboard.team.title}</h1>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="px-4 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t.dashboard.team.invite}
        </button>
      </div>

      <div className="space-y-4">
        {activeMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-start"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {member.profileImageUrl ? (
                <Image src={member.profileImageUrl} alt={member.name} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-400">
                  {getInitials(member.name)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#111111]">{member.name}</p>
              {member.email && <p className="text-sm text-gray-400">{member.email}</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {member.services.map((s) => (
                  <span key={s.service.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {s.service.name}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {formatHoursSummary(member, {
                  dayLabels: locale === 'he' ? DAY_LABELS_HE : DAY_LABELS,
                  noDaysSet: t.dashboard.hours.noDaysSet,
                  hoursNotSet: t.dashboard.hours.hoursNotSet,
                  breakLabel: t.dashboard.hours.break,
                })}
              </p>
            </div>

            <MemberMenu
              member={member}
              onEditServices={() => setEditServicesMember(member)}
              onEditHours={() => setEditHoursMember(member)}
              onRemove={() => setRemoveMember(member)}
              labels={t.dashboard.team}
            />
          </div>
        ))}

        {pendingInvites.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center opacity-70"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-400 flex-shrink-0">
              {getInitials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-[#111111]">{member.name}</p>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">
                  {t.dashboard.team.invitationPending}
                </span>
              </div>
              {member.email && <p className="text-sm text-gray-400">{member.email}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => console.log('Resend invite', member.email)}
                className="text-xs text-gray-600 hover:text-[#111111]"
              >
                {t.dashboard.team.resendInvite}
              </button>
              <button
                type="button"
                onClick={() => console.log('Cancel invite', member.email)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                {t.dashboard.team.cancelInvite}
              </button>
            </div>
          </div>
        ))}
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={(email) =>
          setToast(t.dashboard.team.invitationSent.replace('{email}', email))
        }
      />
      <EditServicesModal
        open={!!editServicesMember}
        onClose={() => setEditServicesMember(null)}
        member={editServicesMember}
        barber={barber}
      />
      <EditHoursModal
        open={!!editHoursMember}
        onClose={() => setEditHoursMember(null)}
        member={editHoursMember}
        barber={barber}
      />
      <RemoveMemberDialog
        open={!!removeMember}
        onClose={() => setRemoveMember(null)}
        member={removeMember}
      />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
