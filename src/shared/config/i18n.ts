import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Russian
import enAnalytics from './locales/en/analytics.json'
import enAuth from './locales/en/auth.json'
import enCommon from './locales/en/common.json'
import enDashboard from './locales/en/dashboard.json'
import enInventory from './locales/en/inventory.json'
import enMenu from './locales/en/menu.json'
import enNavigation from './locales/en/navigation.json'
import enOrganization from './locales/en/organization.json'
import ruAnalytics from './locales/ru/analytics.json'
import ruAuth from './locales/ru/auth.json'
import ruCommon from './locales/ru/common.json'
import ruNavigation from './locales/ru/navigation.json'
import ruMenu from './locales/ru/menu.json'
import ruOnboarding from './locales/ru/onboarding.json'
import ruOrganization from './locales/ru/organization.json'
import ruInventory from './locales/ru/inventory.json'
import ruDashboard from './locales/ru/dashboard.json'
import ruViews from './locales/ru/views.json'

// English
import enOnboarding from './locales/en/onboarding.json'
import enViews from './locales/en/views.json'

// Uzbek
import uzAnalytics from './locales/uz/analytics.json'
import uzAuth from './locales/uz/auth.json'
import uzCommon from './locales/uz/common.json'
import uzDashboard from './locales/uz/dashboard.json'
import uzInventory from './locales/uz/inventory.json'
import uzMenu from './locales/uz/menu.json'
import uzNavigation from './locales/uz/navigation.json'
import uzOnboarding from './locales/uz/onboarding.json'
import uzOrganization from './locales/uz/organization.json'
import uzViews from './locales/uz/views.json'

export const SUPPORTED_LANGUAGES = ['ru', 'en', 'uz'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_NAMES: Record<Language, string> = {
  ru: 'Русский',
  en: 'English',
  uz: "O'zbek",
}

export const resources = {
  ru: {
    common: ruCommon,
    navigation: ruNavigation,
    auth: ruAuth,
    menu: ruMenu,
    organization: ruOrganization,
    inventory: ruInventory,
    dashboard: ruDashboard,
    onboarding: ruOnboarding,
    views: ruViews,
    analytics: ruAnalytics,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    menu: enMenu,
    organization: enOrganization,
    inventory: enInventory,
    dashboard: enDashboard,
    onboarding: enOnboarding,
    views: enViews,
    analytics: enAnalytics,
  },
  uz: {
    common: uzCommon,
    navigation: uzNavigation,
    auth: uzAuth,
    menu: uzMenu,
    organization: uzOrganization,
    inventory: uzInventory,
    dashboard: uzDashboard,
    onboarding: uzOnboarding,
    views: uzViews,
    analytics: uzAnalytics,
  },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'ru',
    supportedLngs: SUPPORTED_LANGUAGES,

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React handles escaping
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n
