import { IModalView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Components';
import { IEvents } from '../base/events';

export class Modal extends Component<IModalView> {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', (event: MouseEvent) => {
			if (event.target === this.container) this.close();
		});
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalView): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
