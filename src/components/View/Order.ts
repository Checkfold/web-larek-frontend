import { IOrderForm, paymentMethod } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../base/Form";

export class Order extends Form<IOrderForm> {
    protected _onlineButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._onlineButton = this.findButton('online')
        this._cashButton = this.findButton('cash');

        this.setupPaymentHandlers();
    }

    private findButton(name: string): HTMLButtonElement {
        return ensureElement<HTMLButtonElement>(`button[name="${name}"]`, this.container);
    }

    private handlePaymentSelection(method: paymentMethod): void {
        this.payment = method;
        this.onInputChange('payment', method);
    }

    private setupPaymentHandlers(): void {
        this._onlineButton.onclick = () => this.handlePaymentSelection('online');
        this._cashButton.onclick = () => this.handlePaymentSelection('cash');
    }

    set payment(value: paymentMethod) {
        const isOnlineSelected = value === 'online';
        const isCashSelected = value === 'cash';
        
        this._onlineButton.classList.toggle('button_alt-active', isOnlineSelected);
        this._cashButton.classList.toggle('button_alt-active', isCashSelected);
    }

    set address(value: string) {
        const addressField = this.container.querySelector<HTMLInputElement>('input[name="address"]');
        if (addressField) {
            addressField.value = value;
        }
    }
}