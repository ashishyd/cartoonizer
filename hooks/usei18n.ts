'use client';

import { useEffect, useState } from 'react';
import { defaultLocale, locales, useTranslation, type Locale } from '@/i18n-config';

export function useI18n() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Get locale from localStorage or browser settings
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLocale = navigator.language.split('-')[0] as Locale;

    // Use saved locale if it exists and is valid, otherwise use browser locale if valid
    if (savedLocale && locales.includes(savedLocale)) {
      setLocale(savedLocale);
    } else if (browserLocale && locales.includes(browserLocale)) {
      setLocale(browserLocale);
    }
  }, []);

  const { t } = useTranslation(locale);

  const changeLocale = (newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  return {
    locale,
    t,
    changeLocale,
    locales,
  };
}
