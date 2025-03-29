export const defaultLocale = 'en';
export const locales = ['en', 'fr', 'es'] as const;

export type Locale = (typeof locales)[number];

type TranslationKeys =
  | 'welcome'
  | 'enterName'
  | 'getStarted'
  | 'offline'
  | 'checkConnection'
  | 'tryAgain';

type Translations = {
  [locale in Locale]: {
    [namespace: string]: {
      [key in TranslationKeys]: string;
    };
  };
};

const translations: Translations = {
  en: {
    common: {
      welcome: 'Welcome to Cartooniser',
      enterName: 'Please enter your name to start your cartoon adventure',
      getStarted: "Let's Get Started!",
      offline: "You're Offline",
      checkConnection: 'Please check your internet connection and try again.',
      tryAgain: 'Try Again',
    },
  },
  fr: {
    common: {
      welcome: 'Bienvenue à Cartooniser',
      enterName: 'Veuillez entrer votre nom pour commencer votre aventure de dessin animé',
      getStarted: 'Commençons!',
      offline: 'Vous êtes hors ligne',
      checkConnection: 'Veuillez vérifier votre connexion Internet et réessayer.',
      tryAgain: 'Réessayer',
    },
  },
  es: {
    common: {
      welcome: 'Bienvenido a Cartooniser',
      enterName: 'Por favor, introduce tu nombre para comenzar tu aventura de dibujos animados',
      getStarted: '¡Vamos a empezar!',
      offline: 'Estás sin conexión',
      checkConnection: 'Por favor, comprueba tu conexión a Internet e inténtalo de nuevo.',
      tryAgain: 'Intentar de nuevo',
    },
  },
};

export function getTranslations(locale: Locale, namespace: string) {
  // Check if the locale exists in our translations
  if (!(locale in translations)) {
    return translations[defaultLocale][namespace];
  }

  // Check if the namespace exists for the locale
  if (!(namespace in translations[locale])) {
    return translations[defaultLocale][namespace];
  }

  return translations[locale][namespace];
}

export function useTranslation(locale: Locale = defaultLocale, namespace = 'common') {
  const translationObj = getTranslations(locale, namespace);

  const t = (key: TranslationKeys): string => {
    return translationObj[key] || key;
  };

  return { t };
}
