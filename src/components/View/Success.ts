import { ISuccessActions, TSuccess } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Components";

export class Success extends Component<TSuccess> {
	protected _total: HTMLElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
		this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		const formattedText = `Списано ${formatNumber(value)} ${settings.currency}`;
		this.setText(this._total, formattedText);
	}
}