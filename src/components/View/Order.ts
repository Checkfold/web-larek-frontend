import { IOrderForm, paymentMethod } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../base/Form";

export class Order extends Form<IOrderForm> {
    protected _onlineButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressField: HTMLInputElement;

    private _payment?: paymentMethod;
    private _address: string;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._onlineButton = ensureElement<HTMLButtonElement>('button[name="online"]', this.container)
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)
        this._addressField = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.setupPaymentHandlers();
        this.setupAddressHandler();
    }

    private handlePaymentSelection(method: paymentMethod): void {
        this.onInputChange('payment', method);
    }

    private setupPaymentHandlers(): void {
        this._onlineButton.onclick = () => this.handlePaymentSelection('online');
        this._cashButton.onclick = () => this.handlePaymentSelection('cash');
    }

    private setupAddressHandler(): void {
        this._addressField.addEventListener('input', () => {
            this._address = this._addressField.value.trim();
            this.onInputChange('address', this._address);
        });
    }

    set payment(value: paymentMethod) {
        this._payment = value;
        const isOnlineSelected = value === 'online';
        const isCashSelected = value === 'cash';

        this._onlineButton.classList.toggle('button_alt-active', isOnlineSelected);
        this._cashButton.classList.toggle('button_alt-active', isCashSelected);
    }

    set address(value: string) {
        this._address = value.trim();
    }
}