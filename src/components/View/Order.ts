import { IOrderForm, paymentMethod } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../base/Form";

export class Order extends Form<IOrderForm> {
    protected _onlineButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressField: HTMLInputElement;

    private _payment?: paymentMethod;
    private _address: string = '';

    private _addressTouched = false;
    private _paymentTouched = false;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._onlineButton = this.findButton('online');
        this._cashButton = this.findButton('cash');
        this._addressField = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.setupPaymentHandlers();
        this.setupAddressHandler();
        this.updateValidity();
    }

    private findButton(name: string): HTMLButtonElement {
        return ensureElement<HTMLButtonElement>(`button[name="${name}"]`, this.container);
    }

    private handlePaymentSelection(method: paymentMethod): void {
        this.payment = method;
        this._paymentTouched = true;
        this.onInputChange('payment', method);
        this.updateValidity();
    }

    private setupPaymentHandlers(): void {
        this._onlineButton.onclick = () => this.handlePaymentSelection('online');
        this._cashButton.onclick = () => this.handlePaymentSelection('cash');
    }

    private setupAddressHandler(): void {
        this._addressField.addEventListener('input', () => {
            this._addressTouched = true;
            this._address = this._addressField.value.trim();
            this.onInputChange('address', this._address);
            this.updateValidity();
        });
    }

    private getErrorMessage(): string {
        // если поле адрес пустое и пользователь что-то сделал → ошибка адреса
        if (!this._address && (this._addressTouched || this._paymentTouched)) {
            return 'Необходимо указать адрес';
        }
        // если адрес есть, но способ оплаты не выбран → ошибка оплаты
        if (!this._payment && (this._paymentTouched || this._addressTouched)) {
            return 'Необходимо выбрать способ оплаты';
        }
        return '';
    }

    private updateValidity(): void {
    const errorMessage = this.getErrorMessage();

    // если форма ещё не тронута — кнопка заблокирована
    const formTouched = this._addressTouched || this._paymentTouched;

    this.errors = errorMessage;
    this.valid = formTouched && !errorMessage; // кнопка активна только после первого действия
}

    set payment(value: paymentMethod) {
        this._payment = value;
        const isOnlineSelected = value === 'online';
        const isCashSelected = value === 'cash';
        
        this._onlineButton.classList.toggle('button_alt-active', isOnlineSelected);
        this._cashButton.classList.toggle('button_alt-active', isCashSelected);
        this.updateValidity();
    }

    set address(value: string) {
        this._address = value.trim();
        if (this._addressField) {
            this._addressField.value = this._address;
        }
        this.updateValidity();
    }
}