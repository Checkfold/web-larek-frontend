import {
	FormErrors,
	IBasket,
	IOrder,
	IOrderForm,
	IProduct,
	paymentMethod,
} from '../../types';
import { IEvents } from '../base/events';

export class AppData {
	products: IProduct[] = [];
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	basket: IBasket = {
		items: [],
		total: 0,
	};
	formErrors: FormErrors = {};
	preview: IProduct = null;

	constructor(protected events: IEvents) {}

	// Загрузка товаров
	loadProducts(products: IProduct[]) {
		this.products = products;
		this.events.emit('products:updated', this.products);
	}

	addBasket(product: IProduct) {
		this.basket.items.push(product.id);
		this.basket.total = this.basket.total + product.price;
		this.events.emit('basket:updated', this.basket);
	}

	deleteBasket(product: IProduct) {
		this.basket.items = this.basket.items.filter(id => id !== product.id);
        this.basket.total = this.basket.total - product.price;
        this.events.emit('basket:updated', this.basket)
	}

	clearBasket() {
		this.basket.items.length = 0; // Очищаем массив
		this.basket.total = 0;
		this.events.emit('basket:updated', this.basket);
	}

	// Получаем количество товаров в корзине
	getBasketCount(): number {
		return this.basket.items.length;
	}

	isProductInBasket(productId: string): boolean {
		return this.basket.items.some((id) => id === productId);
	}

	setPreview(product: IProduct) {
		this.preview = product;
		this.events.emit('product:viewed', this.preview);
	}

	setPaymentMethod(method: paymentMethod) {
		this.order.payment = method;
	}

	// Изменение поля заказа
    updateField(field: keyof IOrderForm, value: string) {
        if (field === 'payment') {
            this.setPaymentMethod(value as paymentMethod);
        } else {
            this.order[field] = value;
        }

        if (this.checkFields()) {
            this.order.total = this.basket.total;
            this.order.items = this.basket.items;
            this.events.emit('order:ready', this.order);
        }
    }

    // Проверка заполненности полей
    checkFields(): boolean {
    const errors: FormErrors = {};
    const fieldsToCheck = ['payment', 'address', 'email', 'phone'] as const;

    for (const field of fieldsToCheck) {
        if (!this.order[field]) {
            errors[field] = this.getErrorMessage(field);
        }
    }

    this.formErrors = errors;
    this.events.emit('errors:updated', this.formErrors);
    
    return Object.keys(errors).length === 0;
}

private getErrorMessage(field: keyof IOrderForm): string {
    const messages = {
        payment: 'Необходимо указать способ оплаты',
        address: 'Необходимо указать адресс',
        email: 'Необходимо указать Email',
        phone: 'Необходимо указать номер телефона'
    };
    return messages[field];
}

}
