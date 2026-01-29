export const FEATURE_FLAG_LABELS: Record<
  string,
  { label: string; description: string }
> = {
  qrOrderingEnabled: {
    label: 'QR Заказы',
    description: 'Включить заказ через QR-код меню',
  },
  loyaltyEnabled: {
    label: 'Программа лояльности',
    description: 'Включить систему вознаграждений для клиентов',
  },
  deliveryEnabled: {
    label: 'Доставка',
    description: 'Включить заказы с доставкой',
  },
  dineInEnabled: {
    label: 'Обслуживание в зале',
    description: 'Включить обслуживание столиков',
  },
  takeawayEnabled: {
    label: 'Самовывоз',
    description: 'Включить заказы на вынос',
  },
  reservationsEnabled: {
    label: 'Бронирование столиков',
    description: 'Включить систему бронирования столов',
  },
  onlinePaymentEnabled: {
    label: 'Онлайн-оплата',
    description: 'Включить возможность онлайн-оплаты',
  },
  tipsEnabled: {
    label: 'Чаевые',
    description: 'Включить цифровые чаевые',
  },
  reviewsEnabled: {
    label: 'Отзывы',
    description: 'Включить систему отзывов клиентов',
  },
  multiLanguageEnabled: {
    label: 'Мультиязычность',
    description: 'Включить поддержку нескольких языков',
  },
  darkModeEnabled: {
    label: 'Темная тема',
    description: 'Включить темную тему интерфейса',
  },
  analyticsEnabled: {
    label: 'Аналитика',
    description: 'Включить панель аналитики',
  },
}
