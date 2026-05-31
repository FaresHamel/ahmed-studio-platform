'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation, isRTL } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: getTranslation('en'),
  isRTL: false
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('language');
    return saved === 'en' || saved === 'ar' ? saved : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  };

  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      t: getTranslation(language),
      isRTL: isRTL(language)
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
