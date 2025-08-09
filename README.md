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

или

```
yarn build
```
Архитектура (MVP)

1. Слои

Слой	Компоненты	Ответственность
Model	ProductModel, OrderModel	Работа с данными и бизнес-логика
View	Catalog, Cart, Modal	Отображение и пользовательские события
Presenter	App (в index.ts)	Координация Model и View

2. Типы данных

Product (Товар):

```
typescript

interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}
```


Order (Заказ):
```
typescript

interface Order {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  items: string[]; // IDs товаров
}
```
3. Ключевые компоненты

EventEmitter (src/utils/eventEmitter.ts)
typescript
class EventEmitter {
  on(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}
ProductModel (src/models/product.ts)
typescript
class ProductModel {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Product | undefined;
}
Catalog (src/components/catalog.ts)
typescript
class Catalog {
  render(products: Product[]): void;
  onCardClick: (productId: string) => void;
}