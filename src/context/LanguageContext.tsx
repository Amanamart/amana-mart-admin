'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en/common.json';
import bn from '../locales/bn/common.json';

type Language = 'en' | 'bn';
type Translations = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const translations: Record<Language, Translations> = { en, bn };

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => en[key] || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    // 1. Check User Profile API (mocked)
    // 2. Check localStorage
    const savedLang = localStorage.getItem('amana_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('amana_language', newLang);
    
    // Set cookie for backend processing (optional, good for server components if needed later)
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
  };

  const t = (key: keyof Translations): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
