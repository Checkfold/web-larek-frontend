import { IOrderForm, FormErrors } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../base/Form';

export class Contacts extends Form<IOrderForm> {
    private _emailField: HTMLInputElement;
    private _phoneField: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailField = this.container.querySelector<HTMLInputElement>('input[name="email"]')!;
        this._phoneField = this.container.querySelector<HTMLInputElement>('input[name="phone"]')!;

        this._emailField.addEventListener('input', () => {
            events.emit('contacts:field-change', { field: 'email', value: this._emailField.value });
        });

        this._phoneField.addEventListener('input', () => {
            events.emit('contacts:field-change', { field: 'phone', value: this._phoneField.value });
        });

        events.on('errors:updated', (errors: FormErrors) => {
            const emailError = errors.email || '';
            const phoneError = errors.phone || '';
            this.errors = emailError || phoneError;
            this.valid = !emailError && !phoneError;
        });
    }

    set contactEmail(value: string) {
        this._emailField.value = value;
    }

    set contactPhone(value: string) {
        this._phoneField.value = value;
    }
}
