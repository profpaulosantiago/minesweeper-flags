import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./translations.js";

const STORAGE_KEY = "minesweeper-flags:locale";

const normalizeLocale = (tag: string): Locale | null => {
  const lower = tag.toLowerCase();

  if (lower.startsWith("pt")) {
    return "pt-BR";
  }

  if (lower.startsWith("en")) {
    return "en";
  }

  return null;
};

const detectFromNavigator = (): Locale | null => {
  if (typeof navigator === "undefined") {
    return null;
  }

  const candidates =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);

    if (normalized) {
      return normalized;
    }
  }

  return null;
};

const readStoredLocale = (): Locale | null => {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && (SUPPORTED_LOCALES as string[]).includes(stored) ? (stored as Locale) : null;
  } catch {
    return null;
  }
};

export const writeStoredLocale = (locale: Locale): void => {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore storage failures (private browsing, quota, disabled storage, etc.).
  }
};

/**
 * Resolution order: an explicit choice made earlier in this browser
 * (localStorage) wins, otherwise the browser/system language list is
 * checked for a supported locale, otherwise English. Every browser API
 * touched here is guarded so this stays safe to call during SSR/tests,
 * where `window`/`navigator` are not defined.
 */
export const detectInitialLocale = (): Locale => readStoredLocale() ?? detectFromNavigator() ?? DEFAULT_LOCALE;
