# Screen 15: Recipes (Техкарты)

> Управление рецептами/техкартами для продуктов меню

---

## Quick Summary

```
Dashboard
    |
    v
+----------+
| Recipes  | <-- текущий экран
+----------+
    |
    +---> Create Recipe (page)
    +---> Edit Recipe (page)
    +---> Calculate Cost
    +---> Link to Product
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view` (просмотр)
- Пользователь имеет permission `inventory:manage` (CRUD)
- URL: `/admin/inventory/recipes`

---

## UI Layout: Recipe List

```
+-------------------------------------------------------------------------+
|  Recipes (Tech Cards)                                    [+ New Recipe] |
+-------------------------------------------------------------------------+
|  [Search...]           Status: [Active v]    Linked: [All v]            |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Recipe Name          | Product        | Cost     | Margin | Status  ||
|  +---------------------------------------------------------------------+|
|  | Classic Burger       | Classic Burger | 23,300   | 48%    | Active  ||
|  | Margherita Pizza     | Margherita     | 18,500   | 52%    | Active  ||
|  | Caesar Salad         | Caesar Salad   | 15,200   | 45%    | Active  ||
|  | Pizza Dough [*]      | -              | 4,200    | -      | Active  ||
|  | Double Cheese [M]    | -              | 6,500    | -      | Active  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [*] = For semi-finished item (polufabrikat)                            |
|  [M] = For modifier                                                      |
|                                                         Page 1 of 8     |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Recipe Detail/Edit Page

```
+-------------------------------------------------------------------------+
|  < Back to Recipes                                                      |
+-------------------------------------------------------------------------+
|  Classic Burger Recipe                          [Duplicate]  [Delete]   |
+-------------------------------------------------------------------------+
|                                                                          |
|  Link to                                                                 |
|  +---------------------------------------------------------------------+|
|  | ( ) Product:     [Classic Burger              v]                    ||
|  | ( ) Modifier:    [Double Cheese               v]                    ||
|  | (*) Semi-finish: [Pizza Dough                 v]                    ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Output                                                                  |
|  +---------------------------------------------------------------------+|
|  | Output Quantity: [1        ]  [portion    v]                        ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Ingredients                                          [+ Add Ingredient]|
|  +---------------------------------------------------------------------+|
|  | Ingredient      | Quantity | Unit | Waste % | Unit Cost | Total     ||
|  +---------------------------------------------------------------------+|
|  | Beef Patty      | 0.150    | kg   | 10%     | 85,000    | 14,025    ||
|  | Burger Bun      | 1        | pcs  | 0%      | 3,000     | 3,000     ||
|  | Cheddar Cheese  | 0.030    | kg   | 5%      | 95,000    | 2,993     ||
|  | Lettuce         | 0.020    | kg   | 15%     | 25,000    | 575       ||
|  | Tomato          | 0.040    | kg   | 10%     | 8,000     | 352       ||
|  | Sauce           | 0.015    | kg   | 0%      | 45,000    | 675       ||
|  +---------------------------------------------------------------------+|
|  |                                          Total Cost:     21,620 UZS ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Cost Summary                                                            |
|  +---------------------------------------------------------------------+|
|  | Ingredient Cost:      21,620 UZS                                    ||
|  | Waste Adjustment:     +1,680 UZS                                    ||
|  | Total Recipe Cost:    23,300 UZS                                    ||
|  | Cost per Portion:     23,300 UZS                                    ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Product Comparison (if linked)                                          |
|  +---------------------------------------------------------------------+|
|  | Selling Price:        45,000 UZS                                    ||
|  | Food Cost:            23,300 UZS (51.8%)                            ||
|  | Gross Margin:         21,700 UZS (48.2%)                            ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Options                                                                 |
|  +---------------------------------------------------------------------+|
|  | [x] Active                                                          ||
|  | [x] Auto-update cost when ingredient prices change                  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                             [Cancel]  [Save Changes]    |
+-------------------------------------------------------------------------+
```

---

## Add Ingredient Modal

```
+--------------------------------------------------+
|  Add Ingredient                            [X]   |
+--------------------------------------------------+
|                                                   |
|  Item*:         [Search inventory items... v]    |
|                                                   |
|  Quantity*:     [0.150      ] kg                 |
|                                                   |
|  Waste Factor:  [10         ] %                  |
|                 (Отходы при обработке)            |
|                                                   |
|  Current Cost:  85,000 UZS/kg                    |
|  With Waste:    0.165 kg = 14,025 UZS            |
|                                                   |
|                         [Cancel]  [Add]          |
+--------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Recipes (Tech Cards)                                    [+ New Recipe] |
+-------------------------------------------------------------------------+
|  [Search...]           Status: [Active v]                               |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Empty State

```
+-------------------------------------------------------------------------+
|  Recipes (Tech Cards)                                    [+ New Recipe] |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [recipe icon]                                                ||
|  |                                                                      ||
|  |         No recipes yet                                               ||
|  |                                                                      ||
|  |         Create tech cards to track food costs                        ||
|  |         and automate inventory deduction.                            ||
|  |                                                                      ||
|  |         [+ Create First Recipe]                                      ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Клик "+ New Recipe" | Переход на страницу создания |
| Клик на строку | Переход на страницу редактирования |
| Search | Поиск по имени рецепта или продукта |
| Status filter | Active/Inactive/All |
| Linked filter | All/Products/Modifiers/Semi-finished/Unlinked |
| Add Ingredient | Модалка добавления ингредиента |
| Delete ingredient row | Удаление ингредиента (с подтверждением) |
| Reorder ingredients | Drag & drop для изменения порядка |
| Duplicate recipe | Создать копию рецепта |
| Recalculate cost | Пересчитать себестоимость по текущим ценам |

---

## API Calls

### GET /admin/inventory/recipes

```json
// Query: ?search=burger&isActive=true&type=product
// Response 200
{
  "items": [
    {
      "id": 1,
      "name": "Classic Burger",
      "productId": 100,
      "productName": "Classic Burger",
      "modifierId": null,
      "semiFinishedItemId": null,
      "outputQuantity": 1,
      "outputUnit": "portion",
      "calculatedCost": 23300,
      "costUpdatedAt": "2026-01-18T10:00:00Z",
      "productPrice": 45000,
      "marginPercent": 48.2,
      "ingredientCount": 6,
      "isActive": true,
      "recipeType": "product"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/recipes/:id

```json
// Response 200
{
  "id": 1,
  "name": "Classic Burger",
  "productId": 100,
  "productName": "Classic Burger",
  "productPrice": 45000,
  "outputQuantity": 1,
  "outputUnit": "portion",
  "calculatedCost": 23300,
  "costPerUnit": 23300,
  "costUpdatedAt": "2026-01-18T10:00:00Z",
  "marginAmount": 21700,
  "marginPercent": 48.2,
  "isActive": true,
  "autoUpdateCost": true,
  "ingredients": [
    {
      "id": 1,
      "itemId": 10,
      "itemName": "Beef Patty",
      "itemUnit": "kg",
      "quantity": 0.15,
      "wasteFactor": 0.1,
      "effectiveQuantity": 0.165,
      "unitCost": 85000,
      "totalCost": 14025,
      "sortOrder": 1
    },
    {
      "id": 2,
      "itemId": 20,
      "itemName": "Burger Bun",
      "itemUnit": "pcs",
      "quantity": 1,
      "wasteFactor": 0,
      "effectiveQuantity": 1,
      "unitCost": 3000,
      "totalCost": 3000,
      "sortOrder": 2
    }
  ],
  "notes": "Standard recipe",
  "createdAt": "2025-06-01T00:00:00Z",
  "updatedAt": "2026-01-18T10:00:00Z"
}
```

### POST /admin/inventory/recipes

```json
// Request
{
  "name": "Classic Burger",
  "productId": 100,
  "outputQuantity": 1,
  "outputUnit": "portion",
  "isActive": true,
  "autoUpdateCost": true,
  "ingredients": [
    {
      "itemId": 10,
      "quantity": 0.15,
      "wasteFactor": 0.1,
      "sortOrder": 1
    }
  ]
}

// Response 201
{
  "id": 1,
  "name": "Classic Burger",
  "calculatedCost": 14025,
  ...
}
```

### PATCH /admin/inventory/recipes/:id

```json
// Request
{
  "name": "Classic Burger Updated",
  "ingredients": [
    {
      "id": 1,
      "quantity": 0.18
    },
    {
      "itemId": 30,
      "quantity": 0.02,
      "wasteFactor": 0.05,
      "sortOrder": 7
    }
  ]
}

// Response 200
{
  "id": 1,
  "name": "Classic Burger Updated",
  "calculatedCost": 25100,
  ...
}
```

### POST /admin/inventory/recipes/:id/recalculate-cost

```json
// Response 200
{
  "previousCost": 23300,
  "newCost": 24500,
  "difference": 1200,
  "differencePercent": 5.15,
  "updatedAt": "2026-01-18T15:00:00Z"
}
```

### POST /admin/inventory/recipes/:id/duplicate

```json
// Request
{
  "newName": "Classic Burger (Copy)"
}

// Response 201
{
  "id": 2,
  "name": "Classic Burger (Copy)",
  "productId": null,
  ...
}
```

### DELETE /admin/inventory/recipes/:id

```json
// Response 204 (No Content)
```

---

## Decision Logic

```
1. Расчёт себестоимости ингредиента:
   effectiveQuantity = quantity * (1 + wasteFactor)
   totalCost = effectiveQuantity * item.avgCost

2. Расчёт общей себестоимости рецепта:
   recipeCost = SUM(ingredient.totalCost)
   costPerUnit = recipeCost / outputQuantity

3. Расчёт маржи:
   marginAmount = productPrice - costPerUnit
   marginPercent = marginAmount / productPrice * 100

4. Привязка рецепта:
   - Только к ОДНОМУ объекту: product ИЛИ modifier ИЛИ semiFinishedItem
   - При смене привязки проверить конфликты

5. Waste Factor:
   - 0% = нет отходов (масло, соусы)
   - 5-10% = минимальные отходы (сыр, мясо)
   - 15-30% = высокие отходы (овощи, зелень)

6. Auto-update cost:
   - Если включено, себестоимость пересчитывается при изменении цен ингредиентов
   - Batch job запускается каждые 24 часа
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| name | Опциональное, если привязан к продукту |
| outputQuantity | > 0 |
| outputUnit | Обязательное |
| ingredients | Минимум 1 ингредиент |
| ingredient.quantity | > 0 |
| ingredient.wasteFactor | 0-1 (0% - 100%) |
| productId/modifierId/semiFinishedItemId | Максимум одно из трёх |

---

## Recipe Types

| Тип | Описание | Пример |
|-----|----------|--------|
| product | Рецепт для продукта меню | Бургер, Пицца |
| modifier | Рецепт для модификатора | Двойной сыр, Экстра соус |
| semi-finished | Рецепт для полуфабриката | Тесто для пиццы |
| unlinked | Не привязан (draft) | - |

---

## Cost Alerts

Показывать предупреждения:

```
IF marginPercent < 30 THEN
  показать warning: "Низкая маржа (< 30%)"
END IF

IF marginPercent < 20 THEN
  показать error: "Критически низкая маржа (< 20%)"
END IF

IF costDifference > 10% за последние 30 дней THEN
  показать info: "Себестоимость выросла на X%"
END IF
```

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Product already has recipe | Предложить редактировать существующий |
| 400 | Circular dependency | Показать ошибку (полуфабрикат ссылается сам на себя) |
| 400 | Item not found | Показать ошибку под полем ингредиента |
| 404 | Recipe not found | Вернуться на список |

---

## FAQ

**Q: Что такое Waste Factor?**

A: Процент отходов при обработке ингредиента. Например, 10% для мяса означает, что для 100г в блюде нужно списать 110г.

**Q: Как связать рецепт с продуктом?**

A: Выбрать продукт в dropdown "Link to Product". Один продукт = один рецепт.

**Q: Что если цена ингредиента изменилась?**

A: Если включен "Auto-update cost", себестоимость пересчитается автоматически. Иначе нужно нажать "Recalculate".

**Q: Можно ли использовать полуфабрикат как ингредиент?**

A: Да, полуфабрикат — это InventoryItem с isSemiFinished=true.

---

*Документ актуален на январь 2026*
