import { settings } from '../../utils/constants';
import { IBasketView } from '../../types';
import { ensureElement, createElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/Components';
import { EventEmitter } from '../base/events';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

        set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: settings.basket.empty
            }));
            this.setDisabled(this._button, true);
        }
    }

    set total (total: number) {
        this.setText(this._total, formatNumber(total) + ' ' + settings.currency);
    }
}
