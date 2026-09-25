import { useSyncExternalStore } from "react";
import { getLocale, setLocale, subscribeLocale, t } from "./i18n-store.js";
import type { Locale } from "./translations.js";

/**
 * Subscribes the component to locale changes (so it re-renders when the
 * language is switched) and returns the translate function together with
 * the active locale. `t` itself is a plain function backed by a module
 * singleton, so it also works outside components (e.g. in the small helper
 * functions in RoomPage.tsx) as long as `t` is threaded through explicitly.
 */
export const useTranslation = (): { t: typeof t; locale: Locale; setLocale: typeof setLocale } => {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, getLocale);

  return { t, locale, setLocale };
};
