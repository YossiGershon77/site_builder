// TODO [ASAF]: Replace with real API call
'use client';

import { useEffect, useState } from 'react';
import { SETUP_DOMAIN } from '@/lib/setup/constants';
import { validateSubdomain } from '@/lib/setup/validation';
import { FieldError } from './FieldError';

interface SubdomainInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onErrorChange: (error: string | null) => void;
  showRequiredHighlight?: boolean;
  label?: string;
  sitePreviewLabel?: string;
  availableLabel?: string;
}

export function SubdomainInput({
  value,
  onChange,
  error,
  onErrorChange,
  showRequiredHighlight,
  label = 'Choose your site address',
  sitePreviewLabel = 'Your site will be:',
  availableLabel = '✓ Available',
}: SubdomainInputProps) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!value || value.length < 3) {
      setAvailable(null);
      setChecking(false);
      return;
    }

    const validationError = validateSubdomain(value);
    if (validationError && validationError !== 'This address is already in use. Try another.') {
      setAvailable(null);
      setChecking(false);
      return;
    }

    setChecking(true);
    const timer = setTimeout(() => {
      // TODO [ASAF]: Replace with real subdomain availability check
      setAvailable(value !== 'taken');
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  function handleChange(raw: string) {
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange(cleaned);
    onErrorChange(validateSubdomain(cleaned));
  }

  const hasError = !!error;
  const borderClass = hasError || showRequiredHighlight
    ? 'border-red-500'
    : 'border-gray-200 focus-within:border-[#111111]';

  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${hasError ? 'text-red-500' : 'text-[#111111]'}`}>
        {label}
      </label>
      <div className={`flex rounded-xl border overflow-hidden ${borderClass}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="your-shop"
          className="flex-1 px-4 py-3 text-sm outline-none bg-white"
        />
        <span className="px-4 py-3 text-sm text-gray-400 bg-gray-50 border-l border-gray-200 flex items-center">
          .{SETUP_DOMAIN}
        </span>
        {checking && (
          <span className="flex items-center px-3">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-[#111111] rounded-full animate-spin" />
          </span>
        )}
      </div>
      {value && (
        <p className="text-sm text-green-600 mt-2">
          {sitePreviewLabel} {value || '…'}.{SETUP_DOMAIN}
        </p>
      )}
      {available && !hasError && value.length >= 3 && (
        <p className="text-sm text-green-600 mt-1">{availableLabel}</p>
      )}
      <FieldError message={error} />
    </div>
  );
}
