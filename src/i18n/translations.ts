import en from './en.json';
import ar from './ar.json';

export type Language = 'en' | 'ar';

export const translations: Record<Language, typeof en> = {
  en,
  ar
};

export const getTranslation = (lang: Language) => translations[lang];

export const isRTL = (lang: Language) => lang === 'ar';
