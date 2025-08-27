import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<{}> {
    protected _close: HTMLElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        // Кнопка закрытия
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        // Абзац с суммой
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }

    render() {
        return this.container;
    }
}