import config from '../../../environments';

/**
 * Хук для доступа к переменным окружения
 * @returns Объект с переменными окружения
 */
export const useEnv = () => {
  return config;
};

export const env = config;
