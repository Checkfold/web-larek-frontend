import { FormErrors, IAppState, IOrder, TOrderForm, IProduct, TContactsForm } from '../../types';
import { settings } from '../../utils/constants';
import { Model } from './Model';

// класс управления состоянием приложения
export class AppState extends Model<IAppState> implements IAppState {
	catalog: IProduct[];
	order: IOrder = {
		// тут данные заказа
		payment: '',
		email: '',
		phone: '',
		adress: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	validationErrors: FormErrors = {};

	setProducts(items: IProduct[]): void {
		this.catalog = items;
		this.events.emit('products:changed');
	}

	getProduct(id: string): IProduct {
		return this.catalog.find((item) => item.id === id);
	}

	calculateTotal(): number {
		return this.order.items.reduce(
			(total, itemId) => {
				const product = this.catalog.find((item) => item.id === itemId);
				return total + (product?.price ?? 0);
			},
			0 // <- Начальное значение аккумулятора
		);
	}

	addBasket(id: string): void {
		this.order.items.push(id);
		this.order.total = this.calculateTotal();
		this.events.emit('products:changed');
	}

	deleteBasket(id: string): void {
		this.order.items = this.order.items.filter((item) => item !== id);
		this.order.total = this.calculateTotal();
		this.events.emit('products:changed');
	}

	isProductInBasket(id: string): boolean {
		return this.order.items.find((item) => item === id) ? true : false;
	}

	getBasketItemsCount(): number {
		return this.order.items.length;
	}

	clearBasket(): void {
		this.order = {
			payment: '',
			email: '',
			phone: '',
			adress: '',
			items: [],
			total: 0,
		};
		this.events.emit('products:changed');
	}

	updateOrderInfo(field: keyof TOrderForm, value: string): void {
		this.order[field] = value;
		this.validateOrderForm();
	}

	updateContactDetails(field: keyof TContactsForm, value: string): void {
		this.order[field] = value;

		this.validateOrderForm();
	}

	validateOrderForm(): void {
		const errors: typeof this.validationErrors = {};
		if (!this.order.payment) {
			errors.payment = settings.formErrors.payment;
		}
		if (!this.order.adress) {
			errors.adress = settings.formErrors.adress;
		}
		this.validationErrors = errors;
		this.events.emit('orderFormErrors:change', this.validationErrors);
	}

	validateContactForm(): void {
		const errors: typeof this.validationErrors = {};
		if (!this.order.email) {
			errors.email = settings.formErrors.email;
		}
		if (!this.order.phone) {
			errors.phone = settings.formErrors.phone;
		}
		this.validationErrors = errors;
		this.events.emit('contactsFormErrors:change', this.validationErrors);
	}

	setProductPreview(item: IProduct): void {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}
