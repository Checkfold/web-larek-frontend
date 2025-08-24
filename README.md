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


<!-- Для реализации нашего приложения нам необходимо реализовать разные классы для работы с данными:


1. Для формирования карточки используется класс Product.

```
Product {
    "id": string;
    "description": string;
    "image": string;
    "title": string;
    "category": string;
    "price": number;
    
    openCard(): void;
}
```

2. За оформлеение товара отвечает класс Order.

```
Order {
    "payment": string;
    "email": string;
    "phone": string;
    "address": string;
    "total": number;
    "items": string[];

    openBasket(): void
}
```

Главная страница:

1. Для открытия корзины используется метод openBasket класса Order.
2. Для открытия карточки используется метод openCard класса ProductCard, отправляет API запрос для проверки валидности карточки.

Просмотр товара:

1. При открытии карточки отображается полная информация получаемая из класса ProductCard.
2. При нажатии на кнопку купить срабатывает метод addProductToBasket класса ProductCard, которая добовляет id товара в масив items класса Order и пересчитывает total.
3. При нажатии на кнопку убрать срабатывает метод deleteProductFromBasket класса ProductCard, которая удаляет id товара из массива items класса Order и пересчитывает total.

Оформление товара:

1. За выбор способа оплаты отвечает метод choosePayment класса Order, который записывает в поле payment текущий выбор оплаты.
2. За валидацию введенных данных в поле adress отвечает метод isAdressValid класса Order.
3. Если не заполнен способ оплаты и адрес не прошёл валидацию, кнопка "Далее" недоступна.
4. Если введенный адрес не валидный срабатывает метод getErrorMessage класса Order.

5. Если одно из полей email или phone не заполнено или не прошло валидацию, то срабатывает метод getErrorMessage класса Order.
6. При нажатии кнопки оплаты срабатывает метод submitOrder класса Order и отправляет API запрос, если ответ успешен - очищаются поля items и total. -->

### Архитектура MVP

Приложение построено по паттерну MVP (Model-View-Presenter):

# Model (Модель) - содержит данные и бизнес-логику приложения. Отвечает за хранение состояния, валидацию данных и взаимодействие с API. Реализована классом AppState.

# View (Представление) - отображает пользовательский интерфейс. Пассивный слой, который только показывает данные и передает пользовательские действия Presenter'у. Включает компоненты: Card, Basket, Page, Form, Order, Contacts, Modal, Success.

# Presenter (Представитель) - посредник между Model и View. Содержит всю бизнес-логику, обрабатывает события от View, обновляет Model и обновляет View. Реализован в index.ts.

## Типы данных

# Интерфейс IProduct - товар

```
interface IProduct {
    id: string;          // уникальный идентификатор товара
    title: string;       // название товара
    description: string; // описание товара
    image: string;       // URL изображения товара
    category: string;    // категория товара ('софт-скил', 'хард-скил', 'другое', 'дополнительное', 'кнопка')
    price: number | null; // цена (null для бесценных товаров)
}
```

# Интерфейс IOrder - заказ покупателя

```
interface IOrder {
    payment: string; // способ оплаты ('card' - онлайн, 'cash' - при получении)
    email: string;   // email покупателя для связи
    phone: string;   // телефон покупателя для связи
    address: string;  // адрес доставки товара
    items: string[]; // массив ID товаров в заказе
    total: number;   // общая сумма заказа
}
```

## Базовые классы

# Класс EventEmitter
Назначение: Брокер событий для коммуникации между компонентами через механизм публикации-подписки.

Конструктор: constructor() - создает пустую карту событий.

Методы:
1. on<T>(event: EventName, callback: (data: T) => void) - подписка на событие
2. off(event: EventName, callback: Subscriber) - отписка от события
3. emit<T>(event: string, data?: T) - инициация события
4. trigger<T>(event: string, context?: Partial<T>) - создание обработчика
5. onAll(callback: (event: EmitterEvent) => void) - подписка на все события
6. offAll() - отписка от всех событий

# Класс Api
Назначение: Базовый HTTP-клиент для работы с REST API.

Конструктор: constructor(baseUrl: string, options: RequestInit = {})

Методы:
1. get(uri: string) - GET запрос
2. post(uri: string, data: object, method: ApiPostMethods = 'POST') - POST запрос
3. handleResponse(response: Response) - обработка HTTP-ответов

# Класс Component<T>
Назначение: Базовый класс для всех UI-компонентов.

Конструктор: protected constructor(protected readonly container: HTMLElement)

Поля: container: HTMLElement - корневой DOM-элемент

Методы:
1. toggleClass(element: HTMLElement, className: string, force?: boolean) - управление классами
2. setText(element: HTMLElement, value: unknown) - установка текста
3. setDisabled(element: HTMLElement, state: boolean) - блокировка элементов
4. setHidden(element: HTMLElement) - скрытие элементов
5. setVisible(element: HTMLElement) - отображение элементов
6. setImage(element: HTMLImageElement, src: string, alt?: string) - установка изображения
7. render(data?: Partial<T>) - отрисовка компонента

# Класс Model<T>
Назначение: Абстрактный базовый класс для моделей данных.

Зона ответственности: Контроль изменений данных и уведомление подписчиков.

Конструктор: constructor(data: Partial<T>, protected events: IEvents)

Методы: 
1. emitChanges(event: string, payload?: object) - уведомление об изменениях

## Модели данных

# Класс AppState
Назначение: Управление состоянием приложения.

Зона ответственности: Хранение данных каталога, корзины, заказов, валидация форм.

Наследование: Наследуется от Model<IAppState>

Конструктор: Использует конструктор родительского класса Model

Поля:
1. catalog: IProduct[] - массив товаров
2. order: IOrder - данные текущего заказа
3. preview: string | null - ID товара для просмотра в модальном окне
4. validationErrors: FormErrors - ошибки валидации форм

Методы:
1. setProducts(items: IProduct[]): void - установка каталога товаров
2. getProduct(id: string): IProduct - получение товара по ID
3. addBasket(id: string): void - добавление товара в корзину
4. deleteBasket(id: string): void - удаление товара из корзины
5. isProductInBasket(id: string): boolean - проверка наличия товара в корзине
6. getBasketItemsCount(): number - получение количества товаров в корзине
7. calculateTotal(): number - расчет общей суммы заказа
8. clearBasket(): void - очистка корзины
9. updateOrderInfo(field: keyof TOrderForm, value: string): void - обновляет данные в поля ввода формы способа оплаты и адреса
10. updateContactDetails(field: keyof TContactsForm, value: string): void - обновление контактных данных
11. validateOrderForm(): void - валидация формы заказа
12. validateContactForm(): void - валидация формы контактов
13. setProductPreview(item: IProduct): void - установка товара для просмотра

## Классы представления (View)

# Класс Card
Назначение: Отображение карточки товара.

Зона ответственности: Визуализация товара в разных контекстах (каталог, корзина, превью).

Конструктор: constructor(container: HTMLElement, actions?: ICardActions)

Поля (DOM элементы):
1. _title: HTMLElement - заголовок товара
2. _image: HTMLImageElement - изображение товара
3. _price: HTMLElement - цена товара
4. _button: HTMLButtonElement - кнопка действия
5. _category: HTMLElement - категория товара
6. _description: HTMLElement - описание товара
7. _itemIndex: HTMLElement - индекс в корзине

Сеттеры:
1. id: string - установка ID товара
2. title: string - установка названия
3. image: string - установка изображения
4. price: number - установка цены
5. category: productGroup - установка категории
6. itemIndex: number - установка индекса

Методы:
1. changeButton(price: number, inBasket: boolean): void - изменение состояния кнопки

# Класс Basket
Назначение: Отображение корзины товаров.

Зона ответственности: Показ списка товаров в корзине и общей суммы.

Конструктор: constructor(container: HTMLElement, protected events: EventEmitter)

Поля:
1. _list: HTMLElement - контейнер списка товаров
2. _total: HTMLElement - элемент общей суммы
3. _button: HTMLElement - кнопка оформления заказа

Сеттеры:
1. items: HTMLElement[] - установка списка товаров
2. total: number - установка общей суммы

# Класс Page
Назначение: Управление главной страницей.

Зона ответственности: Layout страницы, блокировка прокрутки, обновление счетчика корзины.

Конструктор: constructor(container: HTMLElement, protected events: IEvents)

Поля:
1. _counter: HTMLElement - счетчик товаров в корзине
2. _catalog: HTMLElement - контейнер каталога товаров
3. _wrapper: HTMLElement - wrapper страницы
4. _basket: HTMLElement - иконка корзины

Сеттеры:
1. counter: number - установка счетчика
2. catalog: HTMLElement[] - установка каталога
3. locked: boolean - блокировка прокрутки

# Класс Form<T>
Назначение: Базовая форма с валидацией.

Зона ответственности: Обработка ввода данных, валидация, отображение ошибок.

Конструктор: constructor(protected container: HTMLFormElement, protected events: IEvents)

Поля:
1. _submit: HTMLButtonElement - кнопка отправки формы
2. _errors: HTMLElement - контейнер ошибок валидации

Сеттеры:
1. valid: boolean - включает/отключает кнопку отправки формы
2. errors: string - устанавливает текст ошибок валидации

Методы:
1. onInputChange(field: keyof T, value: string) - обработка ввода
2. set valid(value: boolean) - установка валидности
3. set errors(value: string) - установка ошибок

# Класс Order
Назначение: Форма оформления заказа.

Зона ответственности: Выбор способа оплаты и ввод адреса доставки.

Наследование: Наследуется от Form<Partial<TOrderForm>>

Конструктор: constructor(container: HTMLFormElement, events: IEvents)

Поля:
1. _buttonCard: HTMLButtonElement - кнопка выбора оплаты картой (онлайн)оплаты
2. _buttonCash: HTMLButtonElement - кнопка выбора оплаты наличными (при получении)

Сеттеры:
1. address: string - устанавливает значение поля адреса доставки
2. payment: string - устанавливает выбранный способ оплаты и обновляет визуальное состояние кнопок

Методы: 
1. toggleCard(): void - активирует оплату картой и деактивирует оплату наличными
2. toggleCash(): void - активирует оплату наличными и деактивирует оплату картой

# Класс Contacts
Назначение: Форма контактных данных.

Зона ответственности: Ввод email и телефона покупателя.

Наследование: Наследуется от Form<Partial<TContactsForm>>

Конструктор: constructor(container: HTMLFormElement, events: IEvents)

Сеттеры:
1. phone: string - устанавливает значение поля телефона
2. email: string - устанавливает значение поля email

Методы:
1. _setInputValue(name: string, value: string): void - установка значения поля ввода

# Класс Modal
Назначение: Базовое модальное окно.

Зона ответственности: Управление отображением модальных окон.

Конструктор: constructor(container: HTMLElement, protected events: IEvents)

Поля:
1. _content: HTMLElement - контейнер для содержимого модального окна
2. _closeButton: HTMLButtonElement - кнопка закрытия модального окна

Сеттер:
1. content: HTMLElement - устанавливает содержимое модального окна

Методы:
1. open(): void - открывает модальное окно
2. close(): void - закрывает модальное окно
3. render(data: IModalView): HTMLElement - отрисовывает модальное окно

# Класс Success
Назначение: Отображение успешного оформления заказа.

Зона ответственности: Показ информации о successful заказе.

Конструктор: constructor(container: HTMLElement, actions?: ISuccessActions)

Поля:
1. _close: HTMLElement - кнопка закрытия окна
2. _total: HTMLElement - элемент для отображения итоговой суммы

Сеттер:
1. total: number - устанавливает итоговую сумму заказа

## Коммуникационные классы

# Класс LarekApi
Назначение: Взаимодействие с серверной частью приложения.
Зона ответственности: Получение данных товаров и отправка заказов.
Наследование: Наследуется от Api
Конструктор: constructor(cdn: string, baseUrl: string, options?: RequestInit)
Методы:

fetchProductList(): Promise<IProduct[]> - получение каталога товаров

submitOrder(data: Partial<IOrder>): Promise<IOrderConfirmation> - отправка заказа

## Взаимодействие компонентов

Приложение использует событийно-ориентированный подход. Основной flow:

1. Инициализация:
Загрузка каталога товаров через LarekApi.fetchProductList()
Установка товаров в AppState.setProducts()
Генерация события products:changed

2. Добавление в корзину:
Пользователь кликает на кнопку в Card
Presenter обрабатывает событие, вызывает AppState.addBasket()
AppState обновляет состояние и генерирует события
Basket и Page обновляют свое состояние

3. Оформление заказа:
Пользователь переходит к оформлению, генерируется order:open
Presenter открывает форму Order
После заполнения данных генерируется order:submit
Presenter validates данные через AppState.validateOrderForm()
После успешной валидации открывается форма Contacts
После заполнения контактов генерируется contacts:submit
Presenter отправляет заказ через LarekApi.submitOrder()
При успехе показывается Success окно

## Презентер

Так как приложение одностраничное, используется один презентер, код которого размещен в основном скрипте приложения index.ts. Презентер отвечает за:

1. Инициализацию всех компонентов
2. Подписку на события от View компонентов
3. Вызов методов Model для изменения состояния
4. Обновление View компонентов при изменениях в Model
5. Обработку бизнес-логики приложения

## Утилиты и константы

# constants.ts

Содержит настройки приложения:

1. URL API и CDN
2. Тексты сообщений и ошибок
3. Классы CSS для разных категорий товаров
4. Состояния кнопок

# utils.ts

Содержит вспомогательные функции:

1. ensureElement(), ensureAllElements() - безопасное получение DOM-элементов
2. cloneTemplate() - клонирование HTML-шаблонов
3. formatNumber() - форматирование чисел с разделителями
4. createElement() - создание DOM-элементов

Проект демонстрирует четкое разделение ответственности между компонентами и соблюдение принципов паттерна MVP.