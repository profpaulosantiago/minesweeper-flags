import { useTranslation } from "../lib/i18n/useTranslation.js";
import type { Locale } from "../lib/i18n/translations.js";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  "pt-BR": "PT"
};

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="language-switcher" role="group" aria-label="Language / Idioma">
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((option) => (
        <button
          key={option}
          type="button"
          className={["language-switcher-button", option === locale ? "is-active" : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setLocale(option)}
        >
          {LOCALE_LABELS[option]}
        </button>
      ))}
    </div>
  );
};
