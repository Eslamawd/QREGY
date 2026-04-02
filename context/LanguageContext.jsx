"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import en from "../public/locales/en/common.json";
import ar from "../public/locales/ar/common.json";

// كل الترجمات في object واحد
const translations = { en, ar };
const DEFAULT_LANG = "ar";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("qregy-lang");
      if (savedLang === "ar" || savedLang === "en") {
        setLang(savedLang);
      }
    } catch {
      setLang(DEFAULT_LANG);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";

    try {
      localStorage.setItem("qregy-lang", lang);
    } catch {
      // Ignore storage errors in restricted browser modes.
    }
  }, [lang]);

  const resolveKey = useCallback(
    (key) => {
      if (!key) return undefined;

      return key
        .split(".")
        .reduce((value, segment) => value?.[segment], translations[lang]);
    },
    [lang],
  );

  // دالة الترجمة
  const t = useCallback(
    (key, fallback) => {
      const translated = resolveKey(key);

      if (translated !== undefined) {
        return translated;
      }

      if (fallback !== undefined) {
        return lang === "ar" ? key : fallback;
      }

      return key;
    },
    [lang, resolveKey],
  );

  // toggle اللغة
  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// hook للاستخدام بسهولة
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
