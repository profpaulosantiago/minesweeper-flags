import { detectInitialLocale, writeStoredLocale } from "./detect-locale.js";
import {
  serverMessageTranslations,
  translations,
  type Locale,
  type TranslationDictionary
} from "./translations.js";

let currentLocale: Locale = detectInitialLocale();
const listeners = new Set<() => void>();

export const getLocale = (): Locale => currentLocale;

export const setLocale = (locale: Locale): void => {
  if (locale === currentLocale) {
    return;
  }

  currentLocale = locale;
  writeStoredLocale(locale);
  listeners.forEach((listener) => listener());
};

export const subscribeLocale = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getByPath = (dict: TranslationDictionary, path: string): string | undefined => {
  const segments = path.split(".");
  let current: string | TranslationDictionary | undefined = dict;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    current = current[segment];

    if (current === undefined) {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
};

const interpolate = (template: string, vars?: Record<string, string | number>): string => {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
};

/**
 * Looks up `key` (a dot path into translations.ts, e.g. "roomLobby.title")
 * in the current locale, falling back to English and then to the raw key
 * if nothing matches, so a missing translation never crashes the UI.
 */
export const t = (key: string, vars?: Record<string, string | number>): string => {
  const template = getByPath(translations[currentLocale], key) ?? getByPath(translations.en, key) ?? key;
  return interpolate(template, vars);
};

/**
 * Translates a message that came from the server or the realtime runtime as
 * a plain English string (see translations.ts for the source list). Returns
 * the original message unchanged when there is no known translation, so an
 * unexpected/uncatalogued message still displays instead of disappearing.
 */
export const translateServerMessage = (message: string | null | undefined): string | null => {
  if (!message) {
    return message ?? null;
  }

  if (currentLocale === "en") {
    return message;
  }

  return serverMessageTranslations[message] ?? message;
};
