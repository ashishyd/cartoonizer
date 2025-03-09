import urls from '../../public/locales/en/urls.json';

export type AppUrls = typeof urls;

export const getUrl = (key: keyof AppUrls, locale: string = 'en') => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const urls = require(`../../public/locales/${locale}/urls.json`);
  return urls[key];
};
