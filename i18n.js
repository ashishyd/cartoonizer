import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18n as nextI18NextConfig } from './next-i18next.config';

i18n.use(initReactI18next).init({
  ...nextI18NextConfig,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;
