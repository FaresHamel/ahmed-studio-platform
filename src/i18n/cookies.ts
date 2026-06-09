export const LANGUAGE_COOKIE = "language";

export function setLanguageCookie(lang: "en" | "ar") {
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=31536000`;
}