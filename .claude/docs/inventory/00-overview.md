# Обзор модуля инвентаризации

> Документация для frontend-разработчиков

---

## Что это

Модуль управления складом и запасами ресторана. Платный аддон `addon_inventory`.

**Base URL**: `/api/admin/inventory`

---

## Архитектура модуля

```
+-------------------------------------------------------------------------+
|                         INVENTORY MANAGEMENT                             |
+-------------------------------------------------------------------------+
|                                                                          |
|  +-------------+     +-------------+     +-----------------+             |
|  |  Warehouses |     |   Items     |     |   Suppliers     |             |
|  |  (Склады)   |     | (Товары)    |     | (Поставщики)    |             |
|  +------+------+     +------+------+     +--------+--------+             |
|         |                   |                     |                      |
|         v                   v                     v                      |
|  +---------------------------------------------------------------------+ |
|  |                        im_stock                                      | |
|  |              (Текущие остатки по складам)                           | |
|  +-----------------------------+---------------------------------------+ |
|                                |                                         |
|         +----------------------+----------------------+                  |
|         v                      v                      v                  |
|  +-------------+     +-----------------+     +-----------------+         |
|  |  Movements  |     |    Recipes      |     |  Purchase       |         |
|  |  (Движения) |     |  (Техкарты)     |     |  Orders (ЗП)    |         |
|  +-------------+     +-----------------+     +-----------------+         |
|                                                                          |
|  +-------------+     +-----------------+     +-----------------+         |
|  |  Writeoffs  |     | Inventory       |     |  Production     |         |
|  | (Списания)  |     | Counts (Инвент) |     |  Orders (Произв)|         |
|  +-------------+     +-----------------+     +-----------------+         |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Навигация по экранам

```
+-------------------+
|    Sidebar        |
+-------------------+
        |
        v
+-------------------+     +-------------------+     +-------------------+
|    Dashboard      | --> |    Warehouses     | --> |      Items        |
|   /inventory      |     | /inventory/wh     |     | /inventory/items  |
+-------------------+     +-------------------+     +-------------------+
        |
        v
+-------------------+     +-------------------+     +-------------------+
|   Stock Levels    | --> |    Movements      | --> |     Recipes       |
| /inventory/stock  |     | /inventory/moves  |     | /inventory/recipes|
+-------------------+     +-------------------+     +-------------------+
        |
        v
+-------------------+     +-------------------+     +-------------------+
|    Suppliers      | --> | Purchase Orders   | --> |    Receiving      |
| /inventory/suppl  |     | /inventory/po     |     | /inventory/recv   |
+-------------------+     +-------------------+     +-------------------+
        |
        v
+-------------------+     +-------------------+     +-------------------+
|    Writeoffs      | --> | Inventory Counts  | --> |   Production      |
| /inventory/wo     |     | /inventory/counts |     | /inventory/prod   |
+-------------------+     +-------------------+     +-------------------+
        |
        v
+-------------------+
|      Alerts       |
| /inventory/alerts |
+-------------------+
```

---

## Список экранов

| # | Экран | URL | Документ |
|---|-------|-----|----------|
| 10 | Dashboard | `/admin/inventory` | [10-dashboard.md](./screens/10-dashboard.md) |
| 11 | Warehouses | `/admin/inventory/warehouses` | [11-warehouses.md](./screens/11-warehouses.md) |
| 12 | Items | `/admin/inventory/items` | [12-items.md](./screens/12-items.md) |
| 13 | Stock Levels | `/admin/inventory/stock` | [13-stock-levels.md](./screens/13-stock-levels.md) |
| 14 | Movements | `/admin/inventory/movements` | [14-movements.md](./screens/14-movements.md) |
| 15 | Recipes | `/admin/inventory/recipes` | [15-recipes.md](./screens/15-recipes.md) |
| 16 | Suppliers | `/admin/inventory/suppliers` | [16-suppliers.md](./screens/16-suppliers.md) |
| 17 | Purchase Orders | `/admin/inventory/purchase-orders` | [17-purchase-orders.md](./screens/17-purchase-orders.md) |
| 18 | Receiving | `/admin/inventory/receiving` | [18-receiving.md](./screens/18-receiving.md) |
| 19 | Writeoffs | `/admin/inventory/writeoffs` | [19-writeoffs.md](./screens/19-writeoffs.md) |
| 20 | Inventory Counts | `/admin/inventory/counts` | [20-inventory-counts.md](./screens/20-inventory-counts.md) |
| 21 | Production | `/admin/inventory/production` | [21-production.md](./screens/21-production.md) |
| 22 | Alerts | `/admin/inventory/alerts` | [22-alerts.md](./screens/22-alerts.md) |

---

## Бизнес-логика

| Документ | Описание |
|----------|----------|
| [bl-cost-calculation.md](./business-logic/bl-cost-calculation.md) | WAC, hybrid costing, profit snapshot |
| [bl-stock-deduction.md](./business-logic/bl-stock-deduction.md) | Автосписание при заказах |
| [bl-stock-control.md](./business-logic/bl-stock-control.md) | Режимы контроля (block/warn/none) |
| [bl-approval-workflows.md](./business-logic/bl-approval-workflows.md) | Согласование списаний |

---

## Ключевые концепции

### Склад (Warehouse)

- Привязан к филиалу 1:1
- Хранит остатки товаров
- Может быть активным/неактивным

### Номенклатура (Inventory Item)

- Сырьё или полуфабрикат
- Имеет базовую единицу измерения
- Может иметь конверсии единиц (1 коробка = 10 кг)

### Рецепт (Recipe / Техкарта)

- Связывает продукт меню с ингредиентами
- Содержит wasteFactor (процент отходов)
- Используется для автосписания и расчёта себестоимости

### Движение склада (Stock Movement)

- Запись каждого изменения остатка
- Типы: PURCHASE_RECEIVE, SALE_DEDUCTION, WRITEOFF, и др.
- Аудит-трейл всех операций

### WAC (Weighted Average Cost)

- Средневзвешенная себестоимость
- Пересчитывается при каждой закупке
- Используется для расчёта стоимости списания

---

## Проверка доступа

Перед отображением любого экрана модуля:

```
IF NOT hasFeature('addon_inventory') THEN
  показать upsell-экран или скрыть пункт меню
END IF
```

Подробнее: [01-modularity-entitlements.md](./01-modularity-entitlements.md)

---

## Права доступа (Permissions)

| Permission | Описание |
|------------|----------|
| `inventory:view` | Просмотр остатков, движений, отчётов |
| `inventory:manage` | Создание/редактирование товаров, рецептов |
| `inventory:adjust` | Ручные корректировки остатков |
| `inventory:purchase` | Управление закупками |
| `inventory:writeoff` | Создание списаний |
| `inventory:approve` | Утверждение списаний и инвентаризаций |
| `inventory:count` | Проведение инвентаризаций |
| `inventory:production` | Управление производством |

---

## API Reference

Полный справочник API: [api-reference.md](./api-reference.md)

---

## Связанные документы

- [21-entitlements-system.md](../21-entitlements-system.md) — Система модульности
- [docs/architecture/](../../architecture/) — Техническая архитектура

---

*Документ актуален на январь 2026*
