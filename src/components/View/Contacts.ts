import { TContactsForm } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Contacts extends Form<Partial<TContactsForm>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		this._setInputValue('phone', value);
	}
	
	set email(value: string) {
		this._setInputValue('email', value);
	}

	private _setInputValue(name: string, value: string): void {
		const input = this.container.elements.namedItem(name) as HTMLInputElement;
		if (input) {
			input.value = value;
		}
	}
}