// Password validation regex patterns
export const PASSWORD_REGEX = {
  MIN_LENGTH: 8,
  HAS_UPPERCASE: /[A-Z]/,
  HAS_LOWERCASE: /[a-z]/,
  HAS_NUMBER: /[0-9]/,
  HAS_SPECIAL: /[^A-Za-z0-9]/,
}

// OTP configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_SECONDS: 180, // 3 minutes
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN: 60, // 1 minute
}

// Phone validation for Uzbekistan
export const PHONE_CONFIG = {
  COUNTRY_CODE: '+998',
  MIN_LENGTH: 12, // +998901234567
  MAX_LENGTH: 13,
  FORMAT_PATTERN: /^\+998\d{9}$/,
}
