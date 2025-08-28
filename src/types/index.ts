export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export interface IFormState {
    isValid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement;
}

// Финальный заказ для API = данные формы + данные корзины
export interface IOrder extends IOrderForm {
    total: number;
    items: string[];
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IBasket {
    items: string[];
    total: number;
}

export interface IOrderSuccess {
    id: string;
    total: number;
}

export type paymentMethod = 'online' | 'cash';

// Ошибки должны проверяться только по данным формы
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface ILarekAPI {
    fetchProductList: () => Promise<IProduct[]>;
    submitOrder: (order: IOrder) => Promise<IOrderSuccess>;
}
