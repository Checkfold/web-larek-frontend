import { ICardActions, IProduct } from "../../types";
import { Component } from "../base/Component";

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = container.querySelector(".card__title");
        this._image = container.querySelector(".card__image");
        this._description = container.querySelector(".card__text");
        this._category = container.querySelector(".card__category");
        this._button = container.querySelector(".card__button");
        this._price = container.querySelector(".card__price");

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener("click", actions.onClick);
            } else {
                container.addEventListener("click", actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : "Бесценно");
        if (this._button) {
            this._button.disabled = !value;
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        this.toggleClass(this._category, value)
    }

    set button(value: string) {
        this.setText(this._button, value);
    }
}