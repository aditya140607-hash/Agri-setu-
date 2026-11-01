import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/index.js';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  appName: { en: 'AGRI-SETU', hi: 'कृषि-सेतु' },
  appTagline: { en: 'Connecting Farmers to Right Support', hi: 'किसानों को सही समय पर सही सहयोग' },
  home: { en: 'Home', hi: 'होम' },
  about: { en: 'About Us', hi: 'हमारे बारे में' },
  dashboard: { en: 'Farmer Dashboard', hi: 'किसान डैशबोर्ड' },
  cropDetection: { en: 'AI Crop Doctor', hi: 'एआई फसल डॉक्टर' },
  schemes: { en: 'Govt Schemes', hi: 'सरकारी योजनाएं' },
  schemeChecker: { en: 'Eligibility Checker', hi: 'पात्रता जांच' },
  weather: { en: 'Agri Weather', hi: 'कृषि मौसम' },
  mandi: { en: 'Mandi Prices', hi: 'मंडी भाव' },
  guidance: { en: 'Crop Calendar', hi: 'फसल मार्गदर्शन' },
  insurance: { en: 'Crop Insurance', hi: 'फसल बीमा' },
  experts: { en: 'KVK Experts', hi: 'कृषि विशेषज्ञ' },
  chatbot: { en: 'Agri-Setu Mitra', hi: 'कृषि-सेतु मित्र AI' },
  notifications: { en: 'Alerts', hi: 'सूचनाएं' },
  profile: { en: 'My Profile', hi: 'मेरी प्रोफाइल' },
  admin: { en: 'Admin Portal', hi: 'व्यवस्थापक पोर्टल' },
  contact: { en: 'Contact', hi: 'संपर्क' },
  help: { en: 'Help & Support', hi: 'सहायता' },
  login: { en: 'Login', hi: 'लॉग इन' },
  register: { en: 'Farmer Register', hi: 'किसान पंजीकरण' },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  heroTitle: {
    en: 'Smart Farming. Right Support. Better Future.',
    hi: 'स्मार्ट खेती। सही सहयोग। समृद्ध भविष्य।',
  },
  heroSubtitle: {
    en: 'Empowering Indian farmers with instant Gemini AI crop disease diagnostics, live Mandi rates, weather intelligence, and direct government scheme benefits.',
    hi: 'भारतीय किसानों के लिए जेमिनी एआई रोग जांच, वास्तविक समय मंडी भाव, सटीक मौसम पूर्वानुमान और सरकारी योजनाओं का सीधा लाभ।',
  },
  getStarted: { en: 'Get Started Free', hi: 'निःशुल्क शुरू करें' },
  exploreServices: { en: 'Explore Services', hi: 'सेवाएं देखें' },
  quickDemoFarmer: { en: 'Demo Farmer Login', hi: 'डेमो किसान लॉगिन' },
  quickDemoAdmin: { en: 'Demo Admin Login', hi: 'डेमो एडमिन लॉगिन' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'HI',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('agri_setu_lang') as Language) || 'HI';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agri_setu_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return language === 'HI' ? translations[key].hi : translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
