'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDashboard } from '@/lib/dashboard/context';
import { formatHoursSummary, getInitials } from '@/lib/dashboard/utils';
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
}: {
  member: TeamMember;
  onEditServices: () => void;
  onEditHours: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Options"
      >
        ⋯
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
            <button
              type="button"
              onClick={() => { setOpen(false); onEditServices(); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit services
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onEditHours(); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit hours
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onRemove(); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Remove from team
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamPage() {
  const { user, barber } = useDashboard();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editServicesMember, setEditServicesMember] = useState<TeamMember | null>(null);
  const [editHoursMember, setEditHoursMember] = useState<TeamMember | null>(null);
  const [removeMember, setRemoveMember] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (user.role !== 'OWNER') {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <p className="text-gray-600">You don&apos;t have permission to view this page</p>
        <Link href="/dashboard" className="inline-block mt-4 text-sm font-medium text-[#111111] hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const activeMembers = barber.teamMembers.filter((m) => m.inviteAccepted);
  const pendingInvites = barber.teamMembers.filter((m) => !m.inviteAccepted);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-[#111111]">Team</h1>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="px-4 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Invite team member
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
              <p className="text-xs text-gray-400 mt-2">{formatHoursSummary(member)}</p>
            </div>

            <MemberMenu
              member={member}
              onEditServices={() => setEditServicesMember(member)}
              onEditHours={() => setEditHoursMember(member)}
              onRemove={() => setRemoveMember(member)}
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
                  Invitation pending
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
                Resend invite
              </button>
              <button
                type="button"
                onClick={() => console.log('Cancel invite', member.email)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Cancel invite
              </button>
            </div>
          </div>
        ))}
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={(email) => setToast(`Invitation sent to ${email}`)}
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
