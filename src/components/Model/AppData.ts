import {
    IProduct,
    IOrderForm,
    IBasket,
    FormErrors,
    paymentMethod
} from '../../types';
import { IEvents } from '../base/events';

export class AppData {
    products: IProduct[] = [];
    order: IOrderForm & { payment: paymentMethod | '' } = {
        email: '',
        phone: '',
        address: '',
        payment: ''
    };
    basket: IBasket = {
        items: [],
        total: 0
    };
    formErrors: FormErrors = {};
    preview: IProduct = null;

    constructor(protected events: IEvents) {}

    loadProducts(products: IProduct[]) {
        this.products = products;
        this.events.emit('products:updated', this.products);
    }

    addBasket(product: IProduct) {
        this.basket.items.push(product.id);
        this.basket.total += product.price;
        this.events.emit('basket:updated');
    }

    deleteBasket(product: IProduct) {
        this.basket.items = this.basket.items.filter(id => id !== product.id);
        this.basket.total -= product.price;
        this.events.emit('basket:updated');
    }

    clearBasket() {
        this.basket.items = [];
        this.basket.total = 0;
        this.events.emit('basket:updated');
    }

    getBasketCount(): number {
        return this.basket.items.length;
    }

    isProductInBasket(productId: string): boolean {
        return this.basket.items.includes(productId);
    }

    setPreview(product: IProduct) {
        this.preview = product;
        this.events.emit('product:viewed', this.preview);
    }

    setPaymentMethod(method: paymentMethod) {
        this.order.payment = method;
        this.checkFields();
    }

  updateField(field: keyof IOrderForm, value: string) {
    if (field === 'payment') {
        this.order.payment = value as 'online' | 'cash' | '';
    } else {
        this.order[field] = value;
    }
    this.checkFields();
}

    checkFields(): boolean {
        const errors: FormErrors = {};

        if (!this.order.email?.trim()) {
            errors.email = 'Необходимо указать Email';
        }

        if (!this.order.phone?.trim()) {
            errors.phone = 'Необходимо указать номер телефона';
        }

        this.formErrors = errors;
        this.events.emit('errors:updated', this.formErrors);

        return Object.keys(errors).length === 0;
    }
}
