'use client';

import type { MockBarber, TeamMember } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';
import { Modal } from './Modal';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function InviteModal({ open, onClose, onSuccess }: InviteModalProps) {
  const { t } = useLanguage();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const name = String(form.get('name') ?? '');
    console.log('Invite sent:', { email, name });
    onClose();
    onSuccess(email);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold text-[#111111]">{t.dashboard.team.inviteModalTitle}</h2>
      <p className="text-sm text-gray-500 mt-1">
        {t.dashboard.team.inviteModalSub}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dashboard.team.email}</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dashboard.team.name}</label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t.dashboard.team.sendInvite}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700"
          >
            {t.dashboard.team.cancel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface EditServicesModalProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  barber: MockBarber;
}

export function EditServicesModal({ open, onClose, member, barber }: EditServicesModalProps) {
  const { t } = useLanguage();
  if (!member) return null;

  const activeMember = member;
  const memberServiceIds = new Set(activeMember.services.map((s) => s.service.id));

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const selected = barber.services
      .filter((s) => form.get(`service-${s.id}`) === 'on')
      .map((s) => s.id);
    console.log('Save services for', activeMember.name, selected);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <h2 className="text-xl font-semibold text-[#111111]">
        {t.dashboard.team.editServicesFor.replace('{name}', activeMember.name)}
      </h2>

      <form onSubmit={handleSave} className="mt-6 space-y-3 max-h-[50vh] overflow-y-auto">
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
                {service.durationMinutes} {t.common.min} · {service.priceDisplay}
              </p>
            </div>
          </label>
        ))}

        <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t.dashboard.team.save}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 text-sm text-gray-500">
            {t.dashboard.team.cancel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface EditHoursModalProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  barber: MockBarber;
}

export function EditHoursModal({ open, onClose, member, barber }: EditHoursModalProps) {
  const { locale, t } = useLanguage();
  if (!member) return null;

  const activeMember = member;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayLabels =
    locale === 'he'
      ? ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const memberDays = new Set(activeMember.workingDays ?? []);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Save hours for', activeMember.name, Object.fromEntries(new FormData(e.currentTarget)));
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <h2 className="text-xl font-semibold text-[#111111]">
        {t.dashboard.team.editHoursFor.replace('{name}', activeMember.name)}
      </h2>

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{t.dashboard.hours.workingDays}</p>
          <div className="flex flex-wrap gap-2">
            {days.map((day, idx) => {
              const shopClosed = !barber.workingDays.includes(day);
              return (
                <label
                  key={day}
                  className={`px-3 py-2 rounded-lg text-sm border cursor-pointer transition-colors ${
                    shopClosed
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : memberDays.has(day)
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="days"
                    value={day}
                    defaultChecked={memberDays.has(day)}
                    disabled={shopClosed}
                    className="sr-only"
                  />
                  {dayLabels[idx]}
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dashboard.hours.startTime}</label>
            <input
              name="workStartTime"
              type="time"
              defaultValue={member.workStartTime ?? barber.workStartTime}
              min={barber.workStartTime}
              max={barber.workEndTime}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dashboard.hours.endTime}</label>
            <input
              name="workEndTime"
              type="time"
              defaultValue={member.workEndTime ?? barber.workEndTime}
              min={barber.workStartTime}
              max={barber.workEndTime}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dashboard.hours.breakStart}</label>
            <input
              name="breakStart"
              type="time"
              defaultValue={member.breakStart ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dashboard.hours.breakEnd}</label>
            <input
              name="breakEnd"
              type="time"
              defaultValue={member.breakEnd ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t.dashboard.team.save}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 text-sm text-gray-500">
            {t.dashboard.team.cancel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface RemoveMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export function RemoveMemberDialog({ open, onClose, member }: RemoveMemberDialogProps) {
  const { t } = useLanguage();
  if (!member) return null;

  const activeMember = member;

  function handleRemove() {
    console.log('Remove member:', activeMember.name);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <h2 className="text-lg font-semibold text-[#111111]">
        {t.dashboard.team.removeQuestion.replace('{name}', activeMember.name)}
      </h2>
      <p className="text-sm text-gray-500 mt-2">
        {t.dashboard.team.removeSub}
      </p>
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleRemove}
          className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          {t.dashboard.team.remove}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          {t.dashboard.team.cancel}
        </button>
      </div>
    </Modal>
  );
}
