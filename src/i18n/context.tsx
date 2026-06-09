"use client";
import{
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

import { useRouter } from "next/navigation";

import { Language, getTranslation, isRTL } from "./translations";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: getTranslation("en"),
  isRTL: false
});

type Props = {
  children: ReactNode;
  initialLanguage: Language;
};

export function I18nProvider({ children, initialLanguage }: Props) {
  const router = useRouter();

  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Sync HTML lang + dir
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL(language) ? "rtl" : "ltr";
  }, [language]);

  // Change language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    // Save cookie so server can read it
    document.cookie = `language=${lang}; path=/; max-age=31536000`;

    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";

    // Re-render server with new language
    router.refresh();
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,

        // 🔥 SAFE: prevents t undefined crash
        t: getTranslation(language) ?? getTranslation("en"),

        isRTL: isRTL(language)
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
