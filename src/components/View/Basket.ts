import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Исправляем селекторы согласно HTML шаблону
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container); // basket__price вместо basket__total
        this._button = ensureElement<HTMLElement>('.basket__button', this.container); // basket__button вместо basket__action

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            if (this._button) {
                this._button.removeAttribute('disabled');
            }
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            if (this._button) {
                this._button.setAttribute('disabled', 'disabled');
            }
        }
    }

    set selected(items: string[]) {
        if (this._button) {
            if (items.length) {
                this.setDisabled(this._button, false);
            } else {
                this.setDisabled(this._button, true);
            }
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    render(data?: Partial<IBasketView>): HTMLElement {
        super.render(data);
        
        // Обновляем элементы DOM на основе переданных данных
        if (data) {
            if (data.items !== undefined) {
                this.items = data.items;
            }
            if (data.total !== undefined) {
                this.total = data.total;
            }
            if (data.selected !== undefined) {
                this.selected = data.selected;
            }
        }
        
        return this.container;
    }
}