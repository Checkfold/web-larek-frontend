import { TOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';

export class Order extends Form<Partial<TOrderForm>> implements TOrderForm {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonCard = this.container.elements.namedItem('card') as HTMLButtonElement;
		this._buttonCash = this.container.elements.namedItem('cash') as HTMLButtonElement;

		this._buttonCard.addEventListener('click', () => {
			this.toggleCard();
		});

		this._buttonCash.addEventListener('click', () => {
			this.toggleCash();
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: string) {
		if (value) {
			this.toggleClass(
				this.container.elements.namedItem(value) as HTMLButtonElement,
				'button_alt-active',
				true
			);
		} else {
			this.toggleClass(this._buttonCard, 'button_alt-active', false);
			this.toggleClass(this._buttonCash, 'button_alt-active', false);
		}
	}

	toggleCard() {
		this.toggleClass(this._buttonCard, 'button_alt-active', true);
		this.toggleClass(this._buttonCash, 'button_alt-active', false);
		this.onInputChange('payment', this._buttonCard.name);
	}

	toggleCash() {
		this.toggleClass(this._buttonCash, 'button_alt-active', true);
		this.toggleClass(this._buttonCard, 'button_alt-active', false);
		this.onInputChange('payment', this._buttonCash.name);
	}
}
