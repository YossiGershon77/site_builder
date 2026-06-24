import { timeToMinutes } from './constants';

export function validateSetupName(value: string): string | null {
  if (!value.trim()) return 'Please enter your name';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}

export function validateTagline(value: string): string | null {
  if (value.length > 80) return 'Please keep it under 80 characters';
  return null;
}

export function validateWhatsappNumber(value: string): string | null {
  if (!value.trim()) return 'Please enter your WhatsApp number';
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Please enter a valid phone number';
  if (digits.length < 9) return 'Phone number seems too short';
  return null;
}

export function validateSubdomain(value: string): string | null {
  if (!value.trim()) return 'Please choose a site address';
  if (value.length < 3) return 'Must be at least 3 characters';
  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Only lowercase letters, numbers, and hyphens allowed';
  }
  if (value.startsWith('-') || value.endsWith('-')) {
    return 'Cannot start or end with a hyphen';
  }
  if (value === 'taken') return 'This address is already in use. Try another.';
  return null;
}

export function validateGoogleMapsUrl(value: string): {
  error: string | null;
  warning: string | null;
} {
  if (!value.trim()) return { error: null, warning: null };

  try {
    new URL(value);
  } catch {
    return { error: 'Please enter a valid URL', warning: null };
  }

  const isGoogleMaps =
    value.includes('google.com/maps') ||
    value.includes('maps.google') ||
    value.includes('goo.gl/maps');

  if (!isGoogleMaps) {
    return {
      error: null,
      warning: "This doesn't look like a Google Maps link. Are you sure?",
    };
  }

  return { error: null, warning: null };
}

export function validateSocialUrl(
  value: string,
  expectedDomain: 'instagram.com' | 'facebook.com',
): {
  error: string | null;
  warning: string | null;
} {
  if (!value.trim()) return { error: null, warning: null };

  try {
    new URL(value);
  } catch {
    return { error: 'Please enter a valid URL', warning: null };
  }

  if (!value.includes(expectedDomain)) {
    const platform = expectedDomain === 'instagram.com' ? 'Instagram' : 'Facebook';
    const article = expectedDomain === 'instagram.com' ? 'an' : 'a';
    return {
      error: null,
      warning: `This doesn't look like ${article} ${platform} link`,
    };
  }

  return { error: null, warning: null };
}

export function validateAddress(value: string): string | null {
  if (!value.trim()) return 'Please enter your shop address';
  if (value.trim().length < 5) return 'Please enter a full address';
  return null;
}

export function validateAbout(value: string): string | null {
  if (value.length > 500) return 'Please keep it under 500 characters';
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Please enter an email';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validateHours(data: {
  workingDays: string[];
  workStartTime: string;
  workEndTime: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (data.workingDays.length === 0) {
    errors.workingDays = 'Please select at least one working day';
  }

  if (!data.workStartTime || !data.workEndTime) {
    errors.workHours = 'Please set opening and closing times';
  } else {
    const start = timeToMinutes(data.workStartTime);
    const end = timeToMinutes(data.workEndTime);
    if (end <= start) {
      errors.workHours = 'Closing time must be after opening time';
    } else if (end - start < 60) {
      errors.workHours = 'Working day must be at least 1 hour';
    }
  }

  if (data.hasBreak) {
    if (!data.breakStart) errors.breakStart = 'Please set break start time';
    if (!data.breakEnd) errors.breakEnd = 'Please set break end time';

    if (data.breakStart && data.breakEnd && data.workStartTime && data.workEndTime) {
      const breakStart = timeToMinutes(data.breakStart);
      const breakEnd = timeToMinutes(data.breakEnd);
      const workStart = timeToMinutes(data.workStartTime);
      const workEnd = timeToMinutes(data.workEndTime);

      if (breakEnd <= breakStart) {
        errors.breakEnd = 'Break end must be after break start';
      } else if (breakStart < workStart || breakEnd > workEnd) {
        errors.breakHours = 'Break must be within your working hours';
      }
    }
  }

  return errors;
}
