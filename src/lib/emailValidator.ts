// Disposable & Temporary Email Domain List
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'getairmail.com',
  'throwawaymail.com',
  'fakemailgenerator.com',
  'maildrop.cc',
  'inboxalias.com',
  'crazymailing.com',
  'mytemp.email',
  'generator.email',
  'dropmail.me',
  'mohmal.com',
  'nada.ltd',
  'getnada.com',
  'temp-mail.io',
  'burnermail.io',
  'tempail.com',
  'disposablemail.com',
  'emailondeck.com',
  'tempinbox.com',
  '20minutemail.com',
  '33mail.com',
  'anonymbox.com',
  'binkmail.com',
  'get2mail.fr',
  'gishpuppy.com',
  'mailnesia.com',
  'mintemail.com',
  'mytrashmail.com',
  'spambox.us',
  'spamex.com',
  'spamgourmet.com',
  'spaml.de',
  'tempemail.co',
  'temporaryemail.net',
  'trashymail.com',
]);

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmailAddress(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: 'Email address is required.' };
  }

  // Basic RFC 5322 syntax regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address format.' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email address structure.' };
  }

  const [localPart, domain] = parts;

  if (localPart.length < 1 || localPart.length > 64) {
    return { valid: false, error: 'Email username must be between 1 and 64 characters.' };
  }

  if (domain.length < 3 || !domain.includes('.')) {
    return { valid: false, error: 'Please enter a valid domain name.' };
  }

  // Check disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'Disposable or temporary email addresses are not allowed. Please use a permanent email provider.',
    };
  }

  // Check for common test patterns or invalid placeholder domains
  if (domain === 'example.com' || domain === 'test.com' || domain === 'invalid.com') {
    return { valid: false, error: 'Please use a genuine, registered email address.' };
  }

  return { valid: true };
}
