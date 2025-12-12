// Language configuration from environment variables
const envLanguages = import.meta.env.VITE_SUPPORTED_LANGUAGES || 'en,zh';
const envDefaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';

// Parse supported languages from environment with validation
const parsedLanguages = envLanguages
  .split(',')
  .map((lang: string) => lang.trim())
  .filter((lang: string) => lang.length > 0); // Remove empty strings

// Ensure we have at least the default language
export const SUPPORTED_LANGUAGES = parsedLanguages.length > 0 
  ? (parsedLanguages as readonly string[])
  : (['en'] as readonly string[]);

export const DEFAULT_LANGUAGE = envDefaultLanguage.trim() || 'en';

// Get non-default languages for dynamic checks
export const NON_DEFAULT_LANGUAGES = SUPPORTED_LANGUAGES.filter(lang => lang !== DEFAULT_LANGUAGE);