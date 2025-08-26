import { IOrderForm } from '../../types';
import { Form } from '../base/Form';

export class Contacts extends Form<IOrderForm> {
	private findInputElement(name: string): HTMLInputElement | null {
		return this.container.querySelector(`[name="${name}"]`);
	}

	set contactEmail(value: string) {
		const emailField = this.findInputElement('email');
		if (emailField !== null) {
			emailField.value = value;
		}
	}

	set contactPhone(value: string) {
		const phoneField = this.findInputElement('phone');
		if (phoneField !== null) {
			phoneField.value = value;
		}
	}
}
