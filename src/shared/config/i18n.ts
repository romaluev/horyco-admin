import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { en, ru, uz } from './locales';

export type LocaleOptions = 'en' | 'ru' | 'uz';

export const i18nConfig = {
  locales: ['en', 'ru', 'uz'],
  defaultLocale: 'ru'
};

export const STORE_LANGUAGE_KEY = 'NEXT_LOCALE';

export const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en }
};

export const initTranslations = async (i18nInstance?: i18n) => {
  const instance = i18nInstance || createInstance();

  instance.use(initReactI18next);

  await instance.init({
    lng: 'ru',
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    preload: resources ? [] : i18nConfig.locales
  });

  return {
    i18n: instance,
    resources,
    t: instance.t
  };
};
