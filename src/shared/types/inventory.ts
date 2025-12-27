/**
 * Shared Inventory Types
 * Common enums and types used across inventory entities
 */

// Stock Movement Types
export enum MovementType {
  PURCHASE_RECEIVE = 'PURCHASE_RECEIVE',
  SALE_DEDUCTION = 'SALE_DEDUCTION',
  SALE_REVERSAL = 'SALE_REVERSAL',
  WRITEOFF = 'WRITEOFF',
  COUNT_ADJUSTMENT = 'COUNT_ADJUSTMENT',
  PRODUCTION_OUT = 'PRODUCTION_OUT',
  PRODUCTION_IN = 'PRODUCTION_IN',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  OPENING_BALANCE = 'OPENING_BALANCE',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
}

// Purchase Order Status
export enum POStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIAL = 'PARTIAL',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

// Writeoff Reasons
export enum WriteoffReason {
  SPOILAGE = 'SPOILAGE',
  THEFT = 'THEFT',
  DAMAGE = 'DAMAGE',
  STAFF_MEAL = 'STAFF_MEAL',
  SAMPLE = 'SAMPLE',
  EXPIRED = 'EXPIRED',
  PRODUCTION = 'PRODUCTION',
  OTHER = 'OTHER',
}

// Writeoff Status
export enum WriteoffStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Inventory Count Type
export enum CountType {
  FULL = 'FULL',
  CYCLE = 'CYCLE',
  SPOT = 'SPOT',
}

// Inventory Count Status
export enum CountStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// Production Order Status
export enum ProductionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Common status for approval workflows
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Recipe link types
export enum RecipeLinkType {
  PRODUCT = 'PRODUCT',
  MODIFIER = 'MODIFIER',
  ITEM = 'ITEM',
}

// Inventory item categories (commonly used)
export const ITEM_CATEGORIES = [
  'vegetables',
  'fruits',
  'dairy',
  'meat',
  'poultry',
  'seafood',
  'dry_goods',
  'oils',
  'spices',
  'beverages',
  'bakery',
  'frozen',
  'packaging',
  'cleaning',
  'other',
] as const

export type ItemCategory = (typeof ITEM_CATEGORIES)[number]

// Common units for inventory items
export const INVENTORY_UNITS = [
  'kg',
  'g',
  'liter',
  'ml',
  'pcs',
  'box',
  'pack',
  'bottle',
  'can',
  'bag',
  'case',
  'dozen',
  'portion',
] as const

export type InventoryUnit = (typeof INVENTORY_UNITS)[number]

// Label mappings for UI display
export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  [MovementType.PURCHASE_RECEIVE]: 'Приход по закупке',
  [MovementType.SALE_DEDUCTION]: 'Списание по заказу',
  [MovementType.SALE_REVERSAL]: 'Возврат по отмене',
  [MovementType.WRITEOFF]: 'Списание',
  [MovementType.COUNT_ADJUSTMENT]: 'Корректировка инвентаризации',
  [MovementType.PRODUCTION_OUT]: 'Расход на производство',
  [MovementType.PRODUCTION_IN]: 'Приход от производства',
  [MovementType.MANUAL_ADJUSTMENT]: 'Ручная корректировка',
  [MovementType.OPENING_BALANCE]: 'Начальный остаток',
  [MovementType.TRANSFER_OUT]: 'Перемещение (расход)',
  [MovementType.TRANSFER_IN]: 'Перемещение (приход)',
}

export const PO_STATUS_LABELS: Record<POStatus, string> = {
  [POStatus.DRAFT]: 'Черновик',
  [POStatus.SENT]: 'Отправлен',
  [POStatus.PARTIAL]: 'Частично получен',
  [POStatus.RECEIVED]: 'Получен',
  [POStatus.CANCELLED]: 'Отменён',
}

export const WRITEOFF_REASON_LABELS: Record<WriteoffReason, string> = {
  [WriteoffReason.SPOILAGE]: 'Порча',
  [WriteoffReason.THEFT]: 'Кража',
  [WriteoffReason.DAMAGE]: 'Повреждение',
  [WriteoffReason.STAFF_MEAL]: 'Питание персонала',
  [WriteoffReason.SAMPLE]: 'Дегустация',
  [WriteoffReason.EXPIRED]: 'Истёк срок',
  [WriteoffReason.PRODUCTION]: 'Производство',
  [WriteoffReason.OTHER]: 'Другое',
}

export const WRITEOFF_STATUS_LABELS: Record<WriteoffStatus, string> = {
  [WriteoffStatus.DRAFT]: 'Черновик',
  [WriteoffStatus.PENDING]: 'На рассмотрении',
  [WriteoffStatus.APPROVED]: 'Одобрено',
  [WriteoffStatus.REJECTED]: 'Отклонено',
}

export const COUNT_TYPE_LABELS: Record<CountType, string> = {
  [CountType.FULL]: 'Полная',
  [CountType.CYCLE]: 'Циклическая',
  [CountType.SPOT]: 'Выборочная',
}

export const COUNT_STATUS_LABELS: Record<CountStatus, string> = {
  [CountStatus.IN_PROGRESS]: 'В процессе',
  [CountStatus.COMPLETED]: 'Завершена',
  [CountStatus.PENDING_APPROVAL]: 'На утверждении',
  [CountStatus.APPROVED]: 'Утверждена',
  [CountStatus.REJECTED]: 'Отклонена',
  [CountStatus.CANCELLED]: 'Отменена',
}

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  [ProductionStatus.PLANNED]: 'Запланировано',
  [ProductionStatus.IN_PROGRESS]: 'В процессе',
  [ProductionStatus.COMPLETED]: 'Завершено',
  [ProductionStatus.CANCELLED]: 'Отменено',
}

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  vegetables: 'Овощи',
  fruits: 'Фрукты',
  dairy: 'Молочные',
  meat: 'Мясо',
  poultry: 'Птица',
  seafood: 'Морепродукты',
  dry_goods: 'Сухие продукты',
  oils: 'Масла',
  spices: 'Специи',
  beverages: 'Напитки',
  bakery: 'Выпечка',
  frozen: 'Замороженные',
  packaging: 'Упаковка',
  cleaning: 'Хоз. товары',
  other: 'Другое',
}

export const UNIT_LABELS: Record<InventoryUnit, string> = {
  kg: 'кг',
  g: 'г',
  liter: 'л',
  ml: 'мл',
  pcs: 'шт',
  box: 'коробка',
  pack: 'упаковка',
  bottle: 'бутылка',
  can: 'банка',
  bag: 'мешок',
  case: 'ящик',
  dozen: 'дюжина',
  portion: 'порция',
}
