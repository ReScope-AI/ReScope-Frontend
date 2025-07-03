import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import en from '@/utils/locales/en-US';
import vi from '@/utils/locales/vi-VN';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en-US',
    debug: false,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang, () => {
    window.location.reload();
  });
};

export { changeLanguage };

export default i18n;
