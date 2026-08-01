import en from "./en.json";
import ar from "./ar.json";

export const LANGUAGES = {
  EN: "en",
  AR: "ar",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const translations = {
  en,
  ar,
};

export function getTranslation(lang: Language) {
  return translations[lang];
}

export function isRTL(lang: Language) {
  return lang === LANGUAGES.AR;
}