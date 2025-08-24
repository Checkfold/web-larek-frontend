export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null; // null для безценных товаров
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderAnswer {
	id: string;
	total: number;
}

export type TForms = TOrderForm & TContactsForm; 
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>; 
export type TOrderForm = Pick<IOrder, 'payment' | 'address'>; 

export type TSuccess = Pick<IBasketView, 'total'>;


// тип ошибки валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
	valid: boolean;
	errors: string[];
}

// модель данных приложения
export interface IAppState {
	order: IOrder | null;
	catalog: IProduct[];
	preview: string | null; // id товара при  просмотре в модалке
	validationErrors: FormErrors;
	setProducts(items: IProduct[]): void;
	getProduct(id: string): IProduct;
	addBasket(id: string): void;
	deleteBasket(id: string): void;
	isProductInBasket(id: string): boolean;
	getBasketItemsCount(): number; // cчётчик корзины
	calculateTotal(): number; // метод, который считает общую стоимость товаров в корзине
	clearBasket(): void;
	updateOrderInfo(field: keyof TOrderForm, value: string): void; // Обновляет поле информации о доставке: field - название поля (адрес, способ доставки), value - новое значени
	updateContactDetails(field: keyof TContactsForm, value: string): void; // Обновляет контактные данные клиента field - поле (телефон, email), value - новое значение
	validateOrderForm(): void; // валидация способа оплаты и адреса
	validateContactForm(): void; // валидация телефона и email
	setProductPreview(item: IProduct): void; // Устанавливает товар для просмотра в модальном окне
}

// список товаров
export interface IProductsList {
	items: IProduct[];
}

//  VIEW

export interface Ipage {
	products: HTMLElement[];
	locked: boolean;
	counter: number;
}

export type productGroup =
	| 'кнопка'
	| 'дополнительное'
	| 'другое'
	| 'софт-скил'
	| 'хард-скил';

// корзина VIEW
export interface IBasketView {
	items: HTMLElement[] | string; // стринг потому-что корзина может быть пустой
	total: number;
}

export interface ICard {
	id: string;
	title: string;
	price: number;
	itemIndex: number;
	description?: string;
	image?: string;
	category?: productGroup;
	changeButton(price: number, inBasket: boolean): void; // метод который меняет текст кнопки
}

// Действия, доступные для карточки товара в интернет-магазине
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Интерфейс данных об успешной операции
export interface ISuccess {
	total: number; 
}

// Действия для компонента успешного выполнения операции
export interface ISuccessActions {
	onClick: () => void;
}

export interface IModalView {
	content: HTMLElement;
}

// API

 // Интерфейс для работы с API приложения
 export interface IStoreApiClient {
  fetchProductList: () => Promise<IProduct[]>;
  submitOrder: (orderData: Partial<IOrder>) => Promise<IOrderConfirmation>;
}

// Подтверждение успешного оформления заказа
export interface IOrderConfirmation {
  id: string;
  total: number;
}

// кол-во продуктов в api
export interface IProductCatalogResponse extends IProductsList {
  total: number;
}