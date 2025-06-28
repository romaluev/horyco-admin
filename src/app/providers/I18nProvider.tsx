'use client';

import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { initTranslations } from '@/shared/config/i18n';
import { useEffect } from 'react';

const I18NProvider = ({ children }: { children: React.ReactNode }) => {
  const i18n = createInstance();

  useEffect(() => {
    initTranslations(i18n);
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18NProvider;
