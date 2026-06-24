'use client';

import { useState } from 'react';
import type { SetupInvite } from '@/lib/mock';
import { useLanguage } from '@/lib/i18n/context';
import { getSetupTranslations } from '@/lib/setup/translations';
import { validateEmail } from '@/lib/setup/validation';
import { FieldError } from './FieldError';

interface InviteFormProps {
  onInvite: (invite: SetupInvite) => void;
  existingEmails: string[];
}

export function InviteForm({ onInvite, existingEmails }: InviteFormProps) {
  const { locale } = useLanguage();
  const t = getSetupTranslations(locale);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  function handleSubmit() {
    let valid = true;
    if (!name.trim()) {
      setNameError(t.invite.enterName);
      valid = false;
    } else {
      setNameError(null);
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      valid = false;
    } else if (existingEmails.includes(email.trim().toLowerCase())) {
      setEmailError(t.invite.alreadyInvited);
      valid = false;
    } else {
      setEmailError(null);
    }

    if (!valid) return;

    const invite: SetupInvite = {
      id: `invite-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    // TODO [ASAF]: Replace with real API call
    console.log('Invite sent to', invite.email);
    onInvite(invite);
    setName('');
    setEmail('');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${nameError ? 'text-red-500' : 'text-[#111111]'}`}>
            {t.invite.fullName}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
              nameError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          <FieldError message={nameError} />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${emailError ? 'text-red-500' : 'text-[#111111]'}`}>
            {t.invite.emailAddress}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
              emailError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          <FieldError message={emailError} />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t.invite.sendInvite}
        </button>
      </div>
    </div>
  );
}
