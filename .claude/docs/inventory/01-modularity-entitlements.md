# Модульность и проверка доступа

> Как проверить доступ к модулю инвентаризации

---

## Quick Summary

```
Пользователь открывает /admin/inventory
          |
          v
+-------------------------+
| hasFeature('addon_      |
| inventory') ?           |
+-------------------------+
     |              |
     v              v
   true           false
     |              |
     v              v
+----------+  +-------------+
| Показать |  | Upsell или  |
| модуль   |  | скрыть меню |
+----------+  +-------------+
```

---

## Когда показывать модуль

### Условие доступа

```
GET /api/admin/entitlements/features/addon_inventory

Response 200:
{
  "featureKey": "addon_inventory",
  "hasAccess": true,
  "source": "subscription",
  "expiresAt": "2026-02-15T00:00:00Z"
}

Response 200 (нет доступа):
{
  "featureKey": "addon_inventory",
  "hasAccess": false,
  "source": null,
  "trialAvailable": true,
  "trialDays": 14
}
```

### Логика отображения

```
IF hasAccess = true THEN
  показать пункт меню "Склад"
  разрешить переход на /admin/inventory/*
ELSE IF trialAvailable = true THEN
  показать пункт меню с badge "14 дней бесплатно"
  при клике показать trial activation dialog
ELSE
  скрыть пункт меню ИЛИ
  показать с замком и upsell при клике
END IF
```

---

## UI States

### State: Доступ есть

```
+----------------------------------+
|  [=] Sidebar                      |
|----------------------------------|
|  Dashboard                        |
|  Orders                           |
|  Menu                             |
|  > Inventory   <-- active         |
|    - Dashboard                    |
|    - Items                        |
|    - Stock                        |
|    - Recipes                      |
|    - ...                          |
|  Settings                         |
+----------------------------------+
```

### State: Доступа нет, trial доступен

```
+----------------------------------+
|  [=] Sidebar                      |
|----------------------------------|
|  Dashboard                        |
|  Orders                           |
|  Menu                             |
|  > Inventory [14 days free]       |
|  Settings                         |
+----------------------------------+
```

При клике показать диалог:

```
+--------------------------------------------------+
|  Try Inventory Management for Free         [X]   |
|--------------------------------------------------|
|                                                   |
|  Track your stock, manage suppliers, and         |
|  calculate food costs automatically.             |
|                                                   |
|  Features included:                               |
|  [x] Stock tracking by warehouse                 |
|  [x] Recipe/tech card management                 |
|  [x] Auto-deduction on orders                    |
|  [x] Purchase orders & receiving                 |
|  [x] Inventory counts                            |
|  [x] Low stock alerts                            |
|                                                   |
|  Price after trial: 250,000 UZS/month per branch |
|                                                   |
|            [Start 14-Day Free Trial]             |
|                                                   |
+--------------------------------------------------+
```

### State: Доступа нет, trial использован

```
+----------------------------------+
|  [=] Sidebar                      |
|----------------------------------|
|  Dashboard                        |
|  Orders                           |
|  Menu                             |
|  > Inventory [lock icon]          |
|  Settings                         |
+----------------------------------+
```

При клике показать upsell:

```
+--------------------------------------------------+
|  Upgrade to Inventory Management           [X]   |
|--------------------------------------------------|
|                                                   |
|  Take control of your restaurant's inventory.    |
|                                                   |
|  250,000 UZS/month per branch                    |
|                                                   |
|             [Contact Sales]  [Upgrade Now]       |
|                                                   |
+--------------------------------------------------+
```

---

## API для активации trial

```
POST /api/admin/entitlements/trial/activate

Request:
{
  "featureKey": "addon_inventory"
}

Response 200:
{
  "success": true,
  "trialStartDate": "2026-01-18",
  "trialEndDate": "2026-02-01",
  "message": "Trial activated successfully"
}

Response 400:
{
  "statusCode": 400,
  "message": "Trial already used for this feature",
  "error": "Bad Request"
}
```

---

## Проверка на каждом экране

При переходе на любой экран `/admin/inventory/*`:

```
1. Проверить hasFeature('addon_inventory')
2. Если false:
   - Редирект на /admin/inventory/upgrade
   - ИЛИ показать inline upsell
3. Если true:
   - Показать экран
```

---

## Компонент InventoryGuard (pseudocode)

```
FUNCTION InventoryGuard(children):
  entitlement = useEntitlement('addon_inventory')

  IF entitlement.isLoading THEN
    RETURN <LoadingSpinner />
  END IF

  IF entitlement.hasAccess THEN
    RETURN children
  END IF

  IF entitlement.trialAvailable THEN
    RETURN <TrialActivationPrompt
      featureKey="addon_inventory"
      onActivate={activateTrial}
    />
  END IF

  RETURN <UpgradePrompt
    featureKey="addon_inventory"
    price="250,000 UZS/month"
  />
END FUNCTION
```

---

## Кэширование

- Результат проверки кэшировать на 5 минут
- При изменении подписки — инвалидировать кэш
- При переключении tenant — очистить кэш

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 403 | `Inventory module is not enabled` | Показать upsell |
| 401 | `Unauthorized` | Редирект на логин |
| 500 | Server error | Показать error state, retry |

---

## Пункты меню sidebar

При наличии доступа показывать развёрнутое меню:

```
Inventory
  +-- Dashboard
  +-- Warehouses
  +-- Items
  +-- Stock
  +-- Movements
  +-- Recipes
  +-- Suppliers
  +-- Purchase Orders
  +-- Writeoffs
  +-- Counts
  +-- Production
  +-- Alerts
```

При отсутствии — только один пункт "Inventory" с замком/badge.

---

## FAQ

**Q: Что если пользователь открыл прямую ссылку на экран без доступа?**

A: InventoryGuard перехватит и покажет upsell/trial prompt.

**Q: Как часто проверять доступ?**

A: При первой загрузке + каждые 5 минут в фоне. Не на каждый переход.

**Q: Показывать ли данные за период когда trial был активен?**

A: Да, исторические данные остаются доступными для просмотра.

---

*Документ актуален на январь 2026*
