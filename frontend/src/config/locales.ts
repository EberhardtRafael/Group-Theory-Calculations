export const SUPPORTED_LOCALES = ['en'] as const;
export const DEFAULT_LOCALE = 'en';

export type Locale = (typeof SUPPORTED_LOCALES)[number];
