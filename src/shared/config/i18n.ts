// i18n configuration - minimal implementation
const messages: Record<string, string> = {
  'toasts.category.created': 'Категория успешно создана',
  'toasts.category.createError': 'Ошибка при создании категории',
  'toasts.category.updated': 'Категория успешно обновлена',
  'toasts.category.updateError': 'Ошибка при обновлении категории',
  'toasts.category.deleted': 'Категория успешно удалена',
  'toasts.category.deleteError': 'Ошибка при удалении категории',
}

export default {
  t: (key: string): string => messages[key] || key,
}
