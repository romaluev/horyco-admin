# Бизнес-логика: Режимы контроля остатков

> Stock Control Modes, Hide Out of Stock

---

## Обзор

```
+-------------------------------------------------------------------------+
|                    РЕЖИМЫ КОНТРОЛЯ ОСТАТКОВ                              |
+-------------------------------------------------------------------------+
|                                                                          |
|  При СОЗДАНИИ заказа (не при списании!)                                  |
|                                                                          |
|  +----------------------------------------------------------------+     |
|  | Mode     | Поведение                                           |     |
|  +----------------------------------------------------------------+     |
|  | none     | Не проверять наличие (default)                      |     |
|  | warn     | Предупреждение, но разрешить                        |     |
|  | block    | Заблокировать если недостаточно                     |     |
|  +----------------------------------------------------------------+     |
|                                                                          |
|  Настройка: settings.inventory.stockControlMode                          |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## 1. Mode: none (По умолчанию)

### Поведение

```
При создании заказа:
- Не проверять наличие ингредиентов
- Всегда разрешить создание
- Отрицательные остатки возможны

Когда использовать:
- Приоритет продаж над учётом
- Склад не всегда актуален
- Не хотим блокировать кассира
```

### UI

```
POS: никаких предупреждений
Admin: видно отрицательные остатки в отчётах
```

---

## 2. Mode: warn

### Поведение

```
При создании заказа:
1. Проверить наличие ингредиентов для всех items
2. Если недостаточно -> показать warning
3. Пользователь может продолжить или отменить

Когда использовать:
- Хотим знать о проблемах
- Но не блокировать продажи
```

### UI: POS

```
+--------------------------------------------------+
|  Stock Warning                             [X]   |
+--------------------------------------------------+
|                                                   |
|  Some items may have insufficient stock:          |
|                                                   |
|  [!] Classic Burger (qty: 2)                      |
|      - Lettuce: need 0.04 kg, available 0.02 kg  |
|                                                   |
|  [!] Caesar Salad (qty: 1)                        |
|      - Parmesan: need 0.05 kg, available 0 kg    |
|                                                   |
|  Do you want to proceed with the order?           |
|                                                   |
|              [Cancel]  [Proceed Anyway]           |
+--------------------------------------------------+
```

### API

```
POST /pos/orders

Response 200 (with warnings):
{
  "id": 1234,
  "status": "PENDING",
  "stockWarnings": [
    {
      "productId": 100,
      "productName": "Classic Burger",
      "ingredients": [
        {
          "itemId": 50,
          "itemName": "Lettuce",
          "required": 0.04,
          "available": 0.02,
          "unit": "kg"
        }
      ]
    }
  ]
}
```

---

## 3. Mode: block

### Поведение

```
При создании заказа:
1. Проверить наличие ингредиентов
2. Если недостаточно -> вернуть ошибку 400
3. Заказ не создаётся

Когда использовать:
- Строгий учёт
- Нельзя продавать без ингредиентов
- Обычно для high-value items
```

### UI: POS

```
+--------------------------------------------------+
|  Cannot Create Order                       [X]   |
+--------------------------------------------------+
|                                                   |
|  The following items cannot be prepared:          |
|                                                   |
|  [X] Classic Burger (qty: 2)                      |
|      - Lettuce: not enough stock                 |
|                                                   |
|  Please remove these items or adjust quantities.  |
|                                                   |
|  [Remove Items]  [Back to Order]                  |
+--------------------------------------------------+
```

### API

```
POST /pos/orders

Response 400:
{
  "statusCode": 400,
  "message": "Insufficient stock for items",
  "error": "Bad Request",
  "stockErrors": [
    {
      "productId": 100,
      "productName": "Classic Burger",
      "reason": "Insufficient ingredients"
    }
  ]
}
```

---

## 4. hideOutOfStock

### Настройка

```
settings.inventory.hideOutOfStock = true | false

Если true:
- Продукты без достаточных ингредиентов не показываются в меню
- Работает для POS и WebApp
```

### Логика

```
GET /pos/products или /webapp/menu

IF hideOutOfStock = true THEN
  FOR EACH product:
    recipe = findRecipe(product.id)
    IF recipe EXISTS THEN
      FOR EACH ingredient IN recipe:
        stock = getStock(warehouse, ingredient.itemId)
        required = ingredient.quantity * (1 + wasteFactor)
        IF stock.available < required THEN
          EXCLUDE product from response
          BREAK
        END IF
      END FOR
    END IF
  END FOR
END IF
```

### UI: Menu

```
Продукт без stock:
- Не показывается в списке
- ИЛИ показывается с badge "Out of Stock" (grayed out)
  (зависит от hideOutOfStock vs showOutOfStockBadge)
```

---

## 5. Комбинации настроек

| stockControlMode | hideOutOfStock | Результат |
|------------------|----------------|-----------|
| none | false | Всё доступно, никаких проверок |
| none | true | Скрыть out-of-stock, но можно заказать если найти |
| warn | false | Показывать всё, warning при заказе |
| warn | true | Скрыть out-of-stock, warning если всё же заказали |
| block | false | Показывать всё, блокировать при заказе |
| block | true | Скрыть out-of-stock, блокировать если всё же попытаться |

---

## 6. API для проверки stock

### Проверка перед заказом

```
POST /pos/orders/validate

Request:
{
  "branchId": 1,
  "items": [
    {"productId": 100, "quantity": 2}
  ]
}

Response 200:
{
  "valid": true,
  "warnings": [],
  "errors": []
}

Response 200 (с предупреждениями):
{
  "valid": true,
  "warnings": [
    {
      "productId": 100,
      "message": "Low stock for Lettuce"
    }
  ],
  "errors": []
}

Response 200 (с ошибками, mode=block):
{
  "valid": false,
  "warnings": [],
  "errors": [
    {
      "productId": 100,
      "message": "Insufficient stock for Classic Burger"
    }
  ]
}
```

### Проверка наличия продукта

```
GET /pos/products/:id/availability

Response 200:
{
  "productId": 100,
  "productName": "Classic Burger",
  "isAvailable": true,
  "maxQuantity": 15,
  "limitingIngredient": {
    "itemId": 50,
    "itemName": "Lettuce",
    "available": 0.6,
    "perProduct": 0.04,
    "unit": "kg"
  }
}
```

---

## 7. Настройки в Admin

```
+-------------------------------------------------------------------------+
|  Inventory Settings                                                     |
+-------------------------------------------------------------------------+
|                                                                          |
|  Stock Control                                                           |
|  +---------------------------------------------------------------------+|
|  | When creating orders, check ingredient availability:                ||
|  |                                                                     ||
|  | (*) Don't check (allow negative stock)                              ||
|  | ( ) Warn if insufficient (allow order)                              ||
|  | ( ) Block if insufficient (prevent order)                           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Menu Display                                                            |
|  +---------------------------------------------------------------------+|
|  | [ ] Hide out-of-stock products from menu                            ||
|  | [ ] Show "Out of Stock" badge instead of hiding                     ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Recipe Strictness                                                       |
|  +---------------------------------------------------------------------+|
|  | [ ] Require recipe for all products (strict mode)                   ||
|  |     If enabled, orders fail if product has no recipe                ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## 8. Зависимости

```
Для работы stock control необходимо:

1. addon_inventory = true
2. Warehouse создан для branch
3. Recipes созданы для products
4. Stock записи существуют

Если чего-то нет:
- mode = 'none': работает без проблем
- mode = 'warn'/'block': может давать false positives
```

---

## 9. Decision Tree

```
Заказ создаётся
        |
        v
hasFeature('addon_inventory')?
        |
        +---> NO: создать заказ (никаких проверок)
        |
        v YES
stockControlMode?
        |
        +---> 'none': создать заказ
        |
        +---> 'warn' или 'block':
              |
              v
        Проверить ингредиенты
              |
              +---> Достаточно: создать заказ
              |
              +---> Недостаточно:
                    |
                    +---> 'warn': создать с warnings
                    |
                    +---> 'block': вернуть 400
```

---

## FAQ

**Q: Как работает с модификаторами?**

A: Проверяются рецепты модификаторов так же как для продуктов.

**Q: Учитывается ли reservedQuantity?**

A: Да, проверяется availableQuantity = quantity - reservedQuantity.

**Q: Можно ли настроить per-product?**

A: Пока нет. Настройка глобальная на уровне tenant.

**Q: Что если рецепта нет?**

A: Продукт считается доступным (если strictRecipeMode = false).

---

*Документ актуален на январь 2026*
