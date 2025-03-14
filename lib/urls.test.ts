import { AppUrls, getUrl } from './urls';

describe('getUrl', () => {
  it('returns correct URL for given key and default locale', () => {
    const result = getUrl('home');
    expect(result).toBe('/home');
  });

  it('returns correct URL for given key and specified locale', () => {
    const result = getUrl('home', 'fr');
    expect(result).toBe('/accueil');
  });

  it('returns undefined for non-existent key', () => {
    const result = getUrl('nonExistentKey' as keyof AppUrls);
    expect(result).toBeUndefined();
  });

  it('throws error for non-existent locale', () => {
    expect(() => getUrl('home', 'nonExistentLocale')).toThrow();
  });
});
