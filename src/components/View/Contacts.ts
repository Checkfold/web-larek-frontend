import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../base/Form';

export class Contacts extends Form<IOrderForm> {
    private _emailField: HTMLInputElement;
    private _phoneField: HTMLInputElement;

    private _emailTouched = false;
    private _phoneTouched = false;
	private _valid = false;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailField = this.container.querySelector<HTMLInputElement>('input[name="email"]')!;
        this._phoneField = this.container.querySelector<HTMLInputElement>('input[name="phone"]')!;

        this.setupHandlers();
        this.updateValidity();
    }

    private setupHandlers() {
        this._emailField.addEventListener('input', () => {
            this._emailTouched = true;
            this.updateValidity();
        });

        this._phoneField.addEventListener('input', () => {
            this._phoneTouched = true;
            this.updateValidity();
        });
    }

    private getErrorMessage(): string {
        if (!this._emailField.value.trim() && (this._emailTouched || this._phoneTouched)) {
            return 'Необходимо указать email';
        }

        if (!this._phoneField.value.trim() && (this._phoneTouched || this._emailTouched)) {
            return 'Необходимо указать телефон';
        }

        return '';
    }

	get valid() {
    return !this.getErrorMessage();
}

    private updateValidity(): void {
    const errorMessage = this.getErrorMessage();
    const formTouched = this._emailTouched || this._phoneTouched;

    this.errors = errorMessage;
    this._valid = formTouched && !errorMessage;

    // активируем/деактивируем кнопку
    super.valid = this._valid;
}

    set contactEmail(value: string) {
        this._emailField.value = value;
        this.updateValidity();
    }

    set contactPhone(value: string) {
        this._phoneField.value = value;
        this.updateValidity();
    }

	
}
