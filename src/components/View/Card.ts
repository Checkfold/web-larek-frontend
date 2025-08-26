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

    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button'
        };
        
        return categoryMap[category.toLowerCase()] || '';
    }


    set category(value: string) {
        this.setText(this._category, value);
        this.toggleClass(this._category, value);

        const categoryClass = this.getCategoryClass(value);
            if (categoryClass) {
                this._category.classList.add(categoryClass);
            }
    }

    set button(value: string) {
        this.setText(this._button, value);
    }
}