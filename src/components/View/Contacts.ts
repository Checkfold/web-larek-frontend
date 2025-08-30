import { IOrderForm} from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from '../base/Form';

export class Contacts extends Form<IOrderForm> {
    private _emailField: HTMLInputElement;
    private _phoneField: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailField = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phoneField = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this._emailField.addEventListener('input', () => {
           this.onInputChange('email', this._emailField.value);
        });

        this._phoneField.addEventListener('input', () => {
            this.onInputChange('phone', this._phoneField.value);
        });
    }

    set email(value: string) {
        this._emailField.value = value;
    }

    set phone(value: string) {
        this._phoneField.value = value;
    }
}
