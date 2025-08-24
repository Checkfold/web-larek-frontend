import { TOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';

export class Order extends Form<Partial<TOrderForm>> implements TOrderForm {
	protected _paymentButtons: Map<string, HTMLButtonElement>;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = new Map();
		this._initializePaymentButtons();
		this._setupPaymentHandlers();
	}

	set adress(value: string) {
		const addressField = this.container.querySelector(
			'[name="address"]'
		) as HTMLInputElement;
		if (addressField) {
			addressField.value = value;
		}
	}

	set payment(method: string) {
		if (method && this._paymentButtons.has(method)) {
			this._updateButtonStates(method);
		} else {
			this._resetPaymentButtons();
		}
	}

	private _initializePaymentButtons(): void {
		const cardButton = this.container.querySelector(
			'[name="card"]'
		) as HTMLButtonElement;
		const cashButton = this.container.querySelector(
			'[name="cash"]'
		) as HTMLButtonElement;

		if (cardButton) this._paymentButtons.set('card', cardButton);
		if (cashButton) this._paymentButtons.set('cash', cashButton);
	}

	private _setupPaymentHandlers(): void {
		this._paymentButtons.forEach((button, method) => {
			button.addEventListener('click', () => this._selectPaymentMethod(method));
		});
	}

	private _selectPaymentMethod(method: string): void {
		this._updateButtonStates(method);
		this.onInputChange('payment', method);
	}

	private _updateButtonStates(selectedMethod: string): void {
		this._paymentButtons.forEach((button, method) => {
			const isActive = method === selectedMethod;
			this.toggleClass(button, 'button_alt-active', isActive);
		});
	}

	private _resetPaymentButtons(): void {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}
}
