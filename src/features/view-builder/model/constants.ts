/**
 * View Builder Constants
 * Dataset configurations for creating analytics views
 */

import { Dataset, GroupBy, PeriodType, SortBy, SortDirection } from '@/shared/api/graphql'

import type { IColumnDef, IFilterDef, IViewConfig } from '@/entities/view'

// ============================================
// DATASET CONFIGURATION
// ============================================

export interface IDatasetConfig {
  key: Dataset
  label: string
  labelEn: string
  icon: string
  description: string
  defaultColumns: string[]
  columns: IColumnDef[]
  filters: IFilterDef[]
  sortOptions: SortBy[]
  groupByOptions: GroupBy[]
}

export const DATASET_CONFIG: Record<Dataset, IDatasetConfig> = {
  [Dataset.ORDERS]: {
    key: Dataset.ORDERS,
    label: 'Заказы',
    labelEn: 'Orders',
    icon: 'shoppingBag',
    description: 'Анализ заказов, статусов и оплат',
    defaultColumns: ['id', 'createdAt', 'total', 'status', 'paymentMethod'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true, defaultVisible: true },
      { key: 'orderNumber', label: 'Номер заказа', type: 'text', sortable: true },
      { key: 'createdAt', label: 'Дата', type: 'date', sortable: true, defaultVisible: true },
      { key: 'total', label: 'Сумма', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'status', label: 'Статус', type: 'status', sortable: true, defaultVisible: true },
      { key: 'paymentMethod', label: 'Способ оплаты', type: 'text', defaultVisible: true },
      { key: 'branch', label: 'Филиал', type: 'text', sortable: true },
      { key: 'customerName', label: 'Клиент', type: 'text' },
      { key: 'itemsCount', label: 'Позиций', type: 'number', sortable: true },
    ],
    filters: [
      {
        field: 'status',
        label: 'Статус',
        type: 'multiSelect',
        options: [
          { value: 'pending', label: 'Ожидает' },
          { value: 'preparing', label: 'Готовится' },
          { value: 'ready', label: 'Готов' },
          { value: 'completed', label: 'Завершен' },
          { value: 'cancelled', label: 'Отменен' },
        ],
      },
      {
        field: 'paymentMethod',
        label: 'Способ оплаты',
        type: 'multiSelect',
        options: [
          { value: 'cash', label: 'Наличные' },
          { value: 'card', label: 'Карта' },
          { value: 'payme', label: 'Payme' },
          { value: 'click', label: 'Click' },
        ],
      },
      { field: 'createdAt', label: 'Дата', type: 'dateRange' },
      { field: 'total', label: 'Сумма', type: 'number' },
    ],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.AVG_CHECK],
    groupByOptions: [GroupBy.HOUR, GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.PRODUCTS]: {
    key: Dataset.PRODUCTS,
    label: 'Продукты',
    labelEn: 'Products',
    icon: 'pizza',
    description: 'Анализ продаж продуктов и категорий',
    defaultColumns: ['name', 'category', 'orders', 'revenue', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Название', type: 'text', sortable: true, defaultVisible: true },
      { key: 'category', label: 'Категория', type: 'text', sortable: true, defaultVisible: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'quantity', label: 'Количество', type: 'number', sortable: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
      { key: 'avgPrice', label: 'Средняя цена', type: 'currency', sortable: true },
    ],
    filters: [
      { field: 'category', label: 'Категория', type: 'multiSelect', options: [] },
      { field: 'revenue', label: 'Выручка', type: 'number' },
      { field: 'orders', label: 'Заказов', type: 'number' },
    ],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.QUANTITY, SortBy.PERCENTAGE],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.CATEGORIES]: {
    key: Dataset.CATEGORIES,
    label: 'Категории',
    labelEn: 'Categories',
    icon: 'layoutGrid',
    description: 'Анализ категорий меню',
    defaultColumns: ['name', 'products', 'orders', 'revenue', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Название', type: 'text', sortable: true, defaultVisible: true },
      { key: 'products', label: 'Продуктов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
    ],
    filters: [
      { field: 'revenue', label: 'Выручка', type: 'number' },
      { field: 'orders', label: 'Заказов', type: 'number' },
    ],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.QUANTITY, SortBy.PERCENTAGE],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.STAFF]: {
    key: Dataset.STAFF,
    label: 'Персонал',
    labelEn: 'Staff',
    icon: 'user',
    description: 'Анализ производительности персонала',
    defaultColumns: ['name', 'orders', 'revenue', 'avgCheck', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Имя', type: 'text', sortable: true, defaultVisible: true },
      { key: 'role', label: 'Должность', type: 'text', sortable: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'avgCheck', label: 'Средний чек', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
      { key: 'tips', label: 'Чаевые', type: 'currency', sortable: true },
    ],
    filters: [
      { field: 'role', label: 'Должность', type: 'multiSelect', options: [] },
      { field: 'revenue', label: 'Выручка', type: 'number' },
    ],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.AVG_CHECK, SortBy.PERCENTAGE],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.CHANNELS]: {
    key: Dataset.CHANNELS,
    label: 'Каналы',
    labelEn: 'Channels',
    icon: 'hierarchy',
    description: 'Анализ каналов продаж',
    defaultColumns: ['name', 'orders', 'revenue', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Канал', type: 'text', sortable: true, defaultVisible: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
      { key: 'avgCheck', label: 'Средний чек', type: 'currency', sortable: true },
    ],
    filters: [],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.PERCENTAGE],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.PAYMENT_METHODS]: {
    key: Dataset.PAYMENT_METHODS,
    label: 'Способы оплаты',
    labelEn: 'Payment Methods',
    icon: 'billing',
    description: 'Анализ способов оплаты',
    defaultColumns: ['name', 'orders', 'revenue', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Способ оплаты', type: 'text', sortable: true, defaultVisible: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
    ],
    filters: [],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.PERCENTAGE],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.DELIVERY_TYPES]: {
    key: Dataset.DELIVERY_TYPES,
    label: 'Типы доставки',
    labelEn: 'Delivery Types',
    icon: 'shoppingBag',
    description: 'Анализ типов обслуживания',
    defaultColumns: ['name', 'orders', 'revenue', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Тип', type: 'text', sortable: true, defaultVisible: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
      { key: 'avgTime', label: 'Среднее время', type: 'text', sortable: true },
    ],
    filters: [],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.PERCENTAGE],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.CUSTOMERS]: {
    key: Dataset.CUSTOMERS,
    label: 'Клиенты',
    labelEn: 'Customers',
    icon: 'user2',
    description: 'Анализ клиентской базы',
    defaultColumns: ['name', 'orders', 'revenue', 'avgCheck', 'lastVisit'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Имя', type: 'text', sortable: true, defaultVisible: true },
      { key: 'phone', label: 'Телефон', type: 'text' },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Потрачено', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'avgCheck', label: 'Средний чек', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'lastVisit', label: 'Последний визит', type: 'date', sortable: true, defaultVisible: true },
      { key: 'segment', label: 'Сегмент', type: 'status' },
    ],
    filters: [
      {
        field: 'segment',
        label: 'Сегмент',
        type: 'multiSelect',
        options: [
          { value: 'champions', label: 'Чемпионы' },
          { value: 'loyal', label: 'Лояльные' },
          { value: 'at_risk', label: 'В зоне риска' },
          { value: 'new', label: 'Новые' },
          { value: 'lost', label: 'Потерянные' },
        ],
      },
      { field: 'orders', label: 'Заказов', type: 'number' },
      { field: 'revenue', label: 'Потрачено', type: 'number' },
      { field: 'lastVisit', label: 'Последний визит', type: 'dateRange' },
    ],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.CUSTOMERS],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },

  [Dataset.BRANCHES]: {
    key: Dataset.BRANCHES,
    label: 'Филиалы',
    labelEn: 'Branches',
    icon: 'hierarchy',
    description: 'Сравнение филиалов',
    defaultColumns: ['name', 'orders', 'revenue', 'avgCheck', 'percentage'],
    columns: [
      { key: 'id', label: 'ID', type: 'text', sortable: true },
      { key: 'name', label: 'Филиал', type: 'text', sortable: true, defaultVisible: true },
      { key: 'orders', label: 'Заказов', type: 'number', sortable: true, defaultVisible: true },
      { key: 'revenue', label: 'Выручка', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'avgCheck', label: 'Средний чек', type: 'currency', sortable: true, defaultVisible: true },
      { key: 'percentage', label: 'Доля', type: 'percentage', sortable: true, defaultVisible: true },
      { key: 'growth', label: 'Рост', type: 'percentage', sortable: true },
    ],
    filters: [],
    sortOptions: [SortBy.REVENUE, SortBy.ORDERS, SortBy.AVG_CHECK, SortBy.GROWTH],
    groupByOptions: [GroupBy.DAY, GroupBy.WEEK, GroupBy.MONTH],
  },
}

// ============================================
// VIEW TYPE CARDS
// ============================================

export const VIEW_TYPE_CARDS = Object.values(DATASET_CONFIG)

// ============================================
// DEFAULT VIEW CONFIG
// ============================================

export const DEFAULT_VIEW_CONFIG: IViewConfig = {
  timeframe: {
    type: PeriodType.LAST_7_DAYS,
  },
  filters: [],
  columns: [],
  sorting: {
    field: 'revenue',
    direction: SortDirection.DESC,
  },
  display: 'TABLE',
}

// ============================================
// PERIOD OPTIONS
// ============================================

export const PERIOD_OPTIONS = [
  { value: PeriodType.TODAY, label: 'Сегодня' },
  { value: PeriodType.YESTERDAY, label: 'Вчера' },
  { value: PeriodType.THIS_WEEK, label: 'Эта неделя' },
  { value: PeriodType.LAST_WEEK, label: 'Прошлая неделя' },
  { value: PeriodType.LAST_7_DAYS, label: 'Последние 7 дней' },
  { value: PeriodType.THIS_MONTH, label: 'Этот месяц' },
  { value: PeriodType.LAST_MONTH, label: 'Прошлый месяц' },
  { value: PeriodType.LAST_30_DAYS, label: 'Последние 30 дней' },
  { value: PeriodType.LAST_90_DAYS, label: 'Последние 90 дней' },
  { value: PeriodType.THIS_QUARTER, label: 'Этот квартал' },
  { value: PeriodType.THIS_YEAR, label: 'Этот год' },
  { value: PeriodType.CUSTOM, label: 'Произвольный период' },
]

// ============================================
// SORT DIRECTION OPTIONS
// ============================================

export const SORT_DIRECTION_OPTIONS = [
  { value: SortDirection.DESC, label: 'По убыванию' },
  { value: SortDirection.ASC, label: 'По возрастанию' },
]

// ============================================
// GROUP BY OPTIONS
// ============================================

export const GROUP_BY_OPTIONS = [
  { value: GroupBy.HOUR, label: 'По часам' },
  { value: GroupBy.DAY, label: 'По дням' },
  { value: GroupBy.WEEK, label: 'По неделям' },
  { value: GroupBy.MONTH, label: 'По месяцам' },
]
