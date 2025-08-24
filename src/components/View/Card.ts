import { ICard, ICardActions, productGroup } from '../../types';
import { settings } from '../../utils/constants';
import { formatNumber } from '../../utils/utils';
import { Component } from '../base/Components';

export class Card extends Component<ICard> implements ICard {
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _itemIndex?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = container.querySelector('.card__title');
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('card__image');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._price = container.querySelector('.card__price');
		this._itemIndex = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: productGroup) {
		this.setText(this._category, String(value));
		this.toggleClass(this._category, settings.categories[value]);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		let priceText = '';
		if (!value) {
			priceText = settings.card.priceless;
			this.setDisabled(this._button, true);
		} else {
			priceText = formatNumber(value) + ' ' + settings.currency;
		}
		this.setText(this._price, priceText);
	}

	set itemIndex(value: number) {
		this.setText(this._itemIndex, String(value));
	}

	changeButton(price: number, inBasket: boolean): void {
		if (!price) {
			this.setText(this._button, settings.buttonStateMap.disabled);
			this.setDisabled(this._button, true);
		} else {
			if (inBasket) {
				this.setText(this._button, settings.buttonStateMap.delete);
			} else {
				this.setText(this._button, settings.buttonStateMap.add);
			}
		}
	}
}
