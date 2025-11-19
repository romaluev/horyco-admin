# Требования к Backend API для Полного Dashboard

## Текущий эндпоинт: `GET /admin/analytics/dashboard`

Текущий API возвращает базовые данные. Для полноценного дашборда **необходимо добавить** следующие данные:

---

## 1. Статистика по Способам Оплаты (КРИТИЧНО)

**Добавить в response:**

```typescript
{
  paymentMethodStats: Array<{
    method: 'CASH' | 'CARD' | 'CREDIT' | 'PAYME' | 'CLICK' | 'UZUM' | 'BANK_TRANSFER' | 'MIXED'
    totalRevenue: number        // Общая выручка этим способом
    orderCount: number           // Количество заказов
    percentage: number           // % от общей выручки
    avgCheck: number            // Средний чек для этого способа
  }>
}
```

**Зачем:** Показать pie chart распределения платежей, понять какой способ популярнее.

---

## 2. Статистика по Статусам Заказов (КРИТИЧНО)

**Добавить в response:**

```typescript
{
  orderStatusStats: Array<{
    status: 'PAID' | 'PARTIALLY_PAID' | 'NOT_PAID'
    count: number               // Количество заказов
    totalAmount: number         // Общая сумма
    percentage: number          // % от всех заказов
  }>
}
```

**Зачем:** Показать сколько заказов не оплачено, есть ли проблемы с оплатой.

---

## 3. Детализация по Филиалам (ВАЖНО для scope=all_branches)

**Добавить в response (когда scope=all_branches):**

```typescript
{
  branchStats: Array<{
    branchId: number
    branchName: string
    revenue: number
    revenueChangePct: number | null
    orders: number
    ordersChangePct: number | null
    avgCheck: number
    topProduct: {              // Топ продукт филиала
      productId: number
      name: string
    } | null
  }>
}
```

**Зачем:** Сравнительная таблица филиалов, кто работает лучше/хуже.

---

## 4. Статистика по Категориям Продуктов (ЖЕЛАТЕЛЬНО)

**Добавить в response:**

```typescript
{
  categoryStats: Array<{
    categoryId: number
    categoryName: string
    revenue: number
    orderCount: number
    sharePct: number           // % от общей выручки
    avgCheck: number
    productCount: number       // Сколько продуктов в категории продано
  }>
}
```

**Зачем:** Понять какие категории приносят больше денег, bar chart по категориям.

---

## 5. Временные Паттерны / Peak Hours (ЖЕЛАТЕЛЬНО)

**Добавить в response:**

```typescript
{
  hourlyStats: Array<{
    hour: number              // 0-23
    revenue: number
    orderCount: number
    avgCheck: number
  }>
}
```

**Зачем:** Heatmap популярных часов, понять когда пик продаж (12-14, 19-21).

---

## 6. Статистика по Типам Заказов (ЖЕЛАТЕЛЬНО)

**Добавить в response:**

```typescript
{
  orderTypeStats: Array<{
    type: 'delivery' | 'takeaway' | 'dine-in'
    count: number
    revenue: number
    avgCheck: number
    percentage: number        // % от всех заказов
  }>
}
```

**Зачем:** Показать как распределяются заказы по типам, pie chart.

---

## 7. Информация о Клиентах в Заказах (ОПЦИОНАЛЬНО)

**Добавить в `recentOrders`:**

```typescript
{
  recentOrders: Array<{
    // ... существующие поля
    customer?: {
      name: string
      phone?: string
      isReturning?: boolean   // Повторный клиент?
    }
  }>
}
```

**Зачем:** Показать имя/телефон клиента в списке последних заказов.

---

## 8. Сводка по Эффективности (ОПЦИОНАЛЬНО)

**Добавить в response:**

```typescript
{
  efficiency: {
    returningCustomerRate: number  // % повторных клиентов
    abandonmentRate: number        // % незавершённых заказов
    avgPrepTime: number            // Среднее время приготовления (минуты)
    avgDeliveryTime: number        // Среднее время доставки (минуты)
  }
}
```

**Зачем:** KPI метрики качества обслуживания.

---

## Приоритеты Реализации

### Высокий приоритет (критично для дашборда):
1. Статистика по способам оплаты
2. Статистика по статусам заказов
3. Детализация по филиалам (для all_branches)

### Средний приоритет (желательно):
4. Статистика по категориям продуктов
5. Временные паттерны (peak hours)
6. Статистика по типам заказов

### Низкий приоритет (опционально):
7. Информация о клиентах
8. Сводка по эффективности

---

## Формат Response (Финальный)

```typescript
interface IDashboardAnalyticsResponse {
  // Существующие поля
  scope: 'branch' | 'all_branches'
  branch: { id: number, name: string } | null
  period: { type, startDate, endDate, compareTo }
  summary: { revenue, orders, avgCheck, topProduct, ... }
  chart: { groupBy, points }
  topProducts: Array<...>
  recentOrders: Array<...>

  // НОВЫЕ ПОЛЯ
  paymentMethodStats: Array<...>      // #1 КРИТИЧНО
  orderStatusStats: Array<...>        // #2 КРИТИЧНО
  branchStats?: Array<...>            // #3 ВАЖНО (если all_branches)
  categoryStats?: Array<...>          // #4 ЖЕЛАТЕЛЬНО
  hourlyStats?: Array<...>            // #5 ЖЕЛАТЕЛЬНО
  orderTypeStats?: Array<...>         // #6 ЖЕЛАТЕЛЬНО
  efficiency?: { ... }                // #8 ОПЦИОНАЛЬНО
}
```

---

## Итого

**Минимум для запуска:** Добавить пункты #1, #2, #3
**Оптимально:** Добавить пункты #1-#6
**Идеально:** Добавить все пункты #1-#8
