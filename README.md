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

# Архитектура MVP

Приложение построено по паттерну MVP (Model-View-Presenter):

#### Model (Модель) - содержит данные и бизнес-логику приложения. Отвечает за хранение состояния, валидацию данных и взаимодействие с API. Реализована классом AppState.

#### View (Представление) - отображает пользовательский интерфейс. Пассивный слой, который только показывает данные и передает пользовательские действия Presenter'у. Включает компоненты: Card, Basket, Page, Form, Order, Contacts, Modal, Success.

#### Presenter (Представитель) - посредник между Model и View. Содержит всю бизнес-логику, обрабатывает события от View, обновляет Model и обновляет View. Реализован в index.ts.

## Описание базовых типов данных

#### Интерфейс IProduct

```
interface IProduct {
    id: string;           // Уникальный идентификатор товара
    title: string;        // Название товара
    description: string;  // Описание товара
    image: string;        // URL изображения товара
    category: string;     // Категория товара
    price: number | null; // Цена товара (может быть null)
}
```

Предназначение: Описывает структуру данных товара в каталоге магазина.

#### Интерфейс IOrderForm

```
interface IOrderForm {
    payment: string;  // Способ оплаты
    email: string;    // Email покупателя
    phone: string;    // Телефон покупателя
    address: string;  // Адрес доставки
}
```

Предназначение: Содержит данные формы заказа, вводимые пользователем.

#### Интерфейс IBasket

```
interface IBasket {
    items: string[]; // Массив идентификаторов товаров в корзине
    total: number;   // Общая стоимость товаров в корзине
}
```

Предназначение: Описывает состояние корзины покупателя.

#### Интерфейс IFormState
```
export interface IFormState {
    isValid: boolean;
    errors: string[];
}
```
Предназначение: Определяет структуру для хранения состояния валидации формы. Он используется для отслеживания корректности заполнения формы и сбора ошибок валидации.

#### Интерфейс IModalData
```
export interface IModalData {
    content: HTMLElement;
}
```
Предназначение: Определяет структуру данных для управления модальными окнами приложения. Он служит контейнером для контента, который должен отображаться в модальном окне.


#### Интерфейс IOrderResult

```
interface IOrderSucces {
    id: string;    // Идентификатор созданного заказа
    total: number; // Итоговая сумма заказа
}
```
Предназначение: Результат успешного оформления заказа.

#### Тип PaymentMethod

```
type PaymentMethod = 'online' | 'cash';
```
Предназначение: Определяет допустимые способы оплаты в приложении.

#### Тип FormErrors

```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```
Предназначение: Тип FormErrors предназначен для хранения ошибок валидации формы заказа. Он представляет собой объект, где ключи соответствуют полям интерфейса IOrder, а значения - текстовым сообщениям об ошибках.

Структура FormErrors:

Partial - делает все свойства объекта необязательными
Record<keyof IOrder, string> - создает тип объекта, где:
Ключи: все поля из интерфейса IOrder (payment, email, phone, address, total, items)
Значения: строки с сообщениями об ошибках

```
type FormErrors = {
    payment?: string;   // Ошибка для поля способа оплаты
    email?: string;    // Ошибка для поля email
    phone?: string;    // Ошибка для поля телефона
    address?: string;  // Ошибка для поля адреса
    total?: string;    // Ошибка для поля общей суммы
    items?: string;    // Ошибка для поля товаров
}
```

#### Интерфейс ILarekAPI

```
export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>; // Получение списка товаров из каталога магазина. Возвращает: Promise с массивом товаров типа IProduct[]
    orderProducts: (order: IOrder) => Promise<IOrderSuccess>; // Оформление заказа товаров. Возвращает: Promise с результатом оформления заказа типа IOrderSuccess
}
```
Назначение: Интерфейс ILarekAPI определяет контракт для работы с API магазина. Он описывает методы для взаимодействия с серверной частью приложения.

## Описание классов

#### Класс AppData
Назначение класса: Класс AppData является центральным хранилищем состояния приложения (моделью данных). Он отвечает за управление данными товаров, корзины, заказов и обеспечивает синхронизацию между различными компонентами приложения через систему событий.

Структура класса:

```
products: IProduct[] = []; // Каталог товаров
order: IOrder; // Данные текущего заказа
basket: IBasket; // Состояние корзины покупок
formErrors: FormErrors; // Ошибки валидации формы
preview: IProduct = null; // Товар для предпросмотра
```

##### Основные методы:
Управление товарами:
1. loadProducts(products: IProduct[]) - загружает каталог товаров
2. setPreview(product: IProduct) - устанавливает товар для просмотра

Работа с корзиной:
1. addBasket(product: IProduct) - добавляет товар в корзину
2. deleteBasket(product: IProduct) - удаляет товар из корзины
3. clearBasket() - полностью очищает корзину
4. getBasketCount() - возвращает количество товаров в корзине
5. isProductInBasket(productId: string) - проверяет наличие товара в корзине

Управление заказом:
1. setPaymentMethod(method: paymentMethod) - устанавливает способ оплаты
2. updateField(field: keyof IOrderForm, value: string) - обновляет поле заказа
3. checkFields() - проверяет заполненность обязательных полей

Генерируемые события:
1. products:updated - при обновлении каталога товаров
2. basket:updated - при изменении корзины
3. product:viewed - при просмотре товара
4. errors:updated - при обновлении ошибок валидации
5. order:ready - когда заказ готов к отправке

#### Класс LarekAPI
Назначение класса: Класс LarekAPI является реализацией интерфейса ILarekAPI и предоставляет методы для взаимодействия с backend-API интернет-магазина. Наследуется от базового класса Api и добавляет специфичную для приложения логику.

Структура класса:

Конструктор:

```
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```

1. cdn - базовый URL CDN для обработки изображений
2. baseUrl - базовый URL API сервера
3. options - опциональные настройки HTTP-запросов

##### Публичные методы: 
1. fetchProductList()


```
async fetchProductList(): Promise<IProduct[]>
```
Назначение: Получает список товаров из каталога магазина.

Внутренняя логика:
1. Выполняет GET-запрос к endpoint /product
2. Преобразует полученные данные в массив товаров
3. Обрабатывает URL изображений через CDN

Возвращает: Promise с массивом товаров типа IProduct[]

2. submitOrder()

```
async submitOrder(orderData: IOrder): Promise<IOrderSuccess>
```
Назначение: Отправляет данные заказа на сервер.

Параметры:
1. orderData: IOrder - объект с данными заказа

Внутренняя логика:
1. Выполняет POST-запрос к endpoint /order
2. Передает данные заказа в теле запроса

Возвращает: Promise с результатом оформления заказа

##### Приватные методы: 
1. formatImageUrl()

```
private formatImageUrl(originalUrl: string): string
```
Назначение: Преобразует исходный URL изображения для использования CDN.

Логика преобразования:
1. Добавляет CDN base URL
2. Заменяет расширение .svg на .png 

#### Класс Component<T>
Назначение класса: Класс Component<T> является абстрактным базовым классом для всех компонентов пользовательского интерфейса. Он предоставляет базовые методы для работы с DOM-элементами и управления их состоянием. Реализует паттерн "Представитель" (Presenter) для связи между данными и их представлением.

Структура класса:

Конструктор:
```
protected constructor(protected readonly container: HTMLElement)
```
1. container - корневой DOM-элемент, который представляет компонент

##### Публичные методы:
1. toggleClass(element: HTMLElement, className: string, force?: boolean)
```
toggleClass(element: HTMLElement, className: string, force?: boolean): void
```
Назначение: Переключает CSS класс на указанном элементе. Параметры: element - целевой DOM-элемент, className - имя CSS класса для переключения, force? - опциональный флаг принудительного добавления/удаления.


2. render(data?: Partial<T>): HTMLElement
```
render(data?: Partial<T>): HTMLElement
```
Назначение: Основной метод для обновления и отображения компонента. Параметры: data?: Partial<T> - опциональные данные для частичного обновления. Возвращает: HTMLElement - корневой элемент компонента

##### Защищенные методы (для наследования):
1. setText(element: HTMLElement, value: unknown)
```
protected setText(element: HTMLElement, value: unknown): void
```
Назначение: Устанавливает текстовое содержимое элемента. Проверяет существование элемента. Преобразует любое значение в строку. Безопасная установка textContent

2. setHidden(element: HTMLElement)
```
protected setHidden(element: HTMLElement): void
```
Назначение: Скрывает элемент через CSS. Устанавливает display: none

3. setVisible(element: HTMLElement)
```
protected setVisible(element: HTMLElement): void
```
Назначение: Показывает элемент. Удаляет свойство display

4. setImage(element: HTMLImageElement, src: string, alt?: string)
```
protected setImage(element: HTMLImageElement, src: string, alt?: string): void
```
Назначение: Устанавливает изображение с альтернативным текстом. Параметры: element - элемент изображения, src - URL изображения, alt? - опциональный альтернативный текст

#### Класс Form<T>
Назначение класса: Класс Form<T> является специализированным компонентом для работы с HTML-формами. Наследуется от Component<IFormState> и добавляет функциональность для обработки пользовательского ввода, валидации и отправки данных форм. Реализует паттерн "Наблюдатель" для обработки событий формы.

Структура класса:

Конструктор: 
```
constructor(protected container: HTMLFormElement, protected events: IEvents)
```
1. container - HTMLFormElement, корневой элемент формы
2. events - экземпляр системы событий для коммуникации между компонентами

##### Защищенные свойства

```
protected _submit: HTMLButtonElement;    // Кнопка отправки формы
protected _errors: HTMLElement;          // Контейнер для отображения ошибок
```

##### Публичные методы и свойства
1. Сеттер valid: boolean
```
set valid(value: boolean)
```
Назначение: Управляет состоянием кнопки отправки формы. Устанавливает атрибут disabled на кнопке в зависимости от валидности формы.

2. Сеттер errors: string
```
set errors(value: string)
```
Назначение: Устанавливает текст ошибок валидации. Обновляет текстовое содержимое контейнера ошибок.

3. Метод render(state: Partial<T> & IFormState)
```
render(state: Partial<T> & IFormState): HTMLElement
```
Назначение: Обновляет состояние формы и отображает её. 
Параметры: state - комбинированный объект состояния, содержащий:
    isValid - флаг валидности формы
    errors - сообщения об ошибках
    поля данных формы типа T

##### Защищенные методы
1. onInputChange(field: keyof T, value: string)
```
protected onInputChange(field: keyof T, value: string): void
```
Назначение: Обрабатывает изменения в полях ввода. Генерирует событие изменения поля в формате {formName}.{fieldName}:change

#### Класс Modal
Назначение класса: Класс Modal является компонентом для управления модальными окнами приложения. Наследуется от Component<IModalData> и предоставляет функциональность для открытия, закрытия и управления содержимым модальных окон. Реализует паттерн "Команда" для управления состоянием модального окна.

Структура класса:

Конструктор:
```
constructor(container: HTMLElement, protected events: IEvents)
```
container - корневой элемент модального окна
events - экземпляр системы событий для коммуникации

##### Защищенные свойства
```
protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
protected _content: HTMLElement;           // Контейнер для содержимого модального окна
```

##### Публичные методы и свойства
1. Сеттер content: HTMLElement
```
set content(value: HTMLElement)
```
Назначение: Устанавливает содержимое модального окна. Полностью заменяет дочерние элементы в контейнере содержимого.

2. Метод open()
```
open(): void
```
Назначение: Открывает модальное окно. Добавляет CSS класс modal_active для отображения окна. Генерирует событие modal:open

3. Метод close()
```
close(): void
```
Назначение: Закрывает модальное окно. Удаляет CSS класс modal_active для скрытия окна. Очищает содержимое модального окна. Генерирует событие modal:close

4. Метод render(data: IModalData)
```
render(data: IModalData): HTMLElement
```
Назначение: Обновляет и открывает модальное окно. Обновляет базовый компонент с переданными данными. Открывает модальное окно. Возвращает корневой элемент модального окна. Принимает параметром data - объект с данными для отображения в модальном окне. 

