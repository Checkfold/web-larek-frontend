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

export interface IOrder extends IOrderForm {
    total: number;
    items: string[];
}


export interface IBasket {
    items: string[];
    total: number;
}

export interface IOrderSucces {
    id: string;
    total: number;
}

export type paymentMethod = 'online' | 'cash';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ILarekAPI {
    fetchProductList: () => Promise<IProduct[]>;
    submitOrder: (order:IOrder) => Promise<IOrderSucces>;
}