# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

## Архитектура и основные классы

- **EventEmitter** — брокер событий для взаимодействия между компонентами.
  - Методы: `on`, `off`, `emit`, `onAll`, `offAll`, `trigger`
- **Api** — работа с серверным API (запросы, обработка ответов).
  - Методы: `get`, `post`, `handleResponse`, `getProducts`, `getProduct`, `createOrder`
- **ProductModel** — управление данными товаров.
  - Методы: `setProducts`, `getProductById`
- **BasketModel** — управление корзиной пользователя.
  - Методы: `addItem`, `removeItem`, `clear`, `getTotal`, `getItems`
- **OrderModel** — управление данными заказа.
  - Методы: `setOrder`, `clearOrder`, `getOrder`
- **Modal** — управление модальными окнами.
  - Методы: `open`, `close`, `setContent`, `setTitle`
- **ProductCard** — отображение карточки товара.
  - Методы: `render`, `setInBasket`, `onClick`
- **BasketView** — отображение корзины.
  - Методы: `render`, `onRemove`, `onCheckout`
- **OrderForm** — форма оформления заказа.
  - Методы: `render`, `validate`, `onSubmit`
- **AppController** (опционально) — координация моделей, представлений и событий.
  - Методы: `init`, `handleProductClick`, `handleAddToBasket`, `handleOrderSubmit`

## Описание компонентов

- **Catalog** — отображает список товаров, использует `ProductCard` для каждого товара.
- **ProductCard** — отображает краткую информацию о товаре, открывает модальное окно с деталями по клику.
- **BasketView** — отображает выбранные товары, позволяет удалять товары и переходить к оформлению заказа.
- **Modal** — универсальное модальное окно для деталей товара и оформления заказа.
- **OrderForm** — форма для оформления заказа с валидацией.

## Типы данных
Все основные интерфейсы и типы определены в файле [`src/types/index.ts`](src/types/types.ts):
- Product, Order, UserContact, BasketItem и др.

