import { EventEmitter } from './components/base/events';
import { AppState } from './components/Models/AppData';
import { LarekApi } from './components/Models/LarekAPI';
import { Basket } from './components/View/Basket';
import { Card } from './components/View/Card';
import { Contacts } from './components/View/Contacts';
import { Modal } from './components/View/Modal';
import { Order } from './components/View/Order';
import { Page } from './components/View/Page';
import { Success } from './components/View/Success';
import './scss/styles.scss';
import { IProduct, IProductsList, productGroup, TContactsForm, TOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// инициализация
const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter
const appData = new AppState({}, events)

//шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderFormTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsFormTemplate), events);

events.on<IProductsList>('products:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category as productGroup,
		});
	});

	page.counter = appData.getBasketItemsCount();
});

events.on('card:select', (item: IProduct) => {
	appData.setProductPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('basket:changed', item);
			modal.close();
		},
	});
	card.changeButton(item.price, appData.isProductInBasket(item.id));
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category as productGroup,
		}),
	});
});



events.on('basket:open', () => {
	basket.items = appData.order.items.map((id, index) => {
		const item = appData.getProduct(id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:delete', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			itemIndex: index + 1,
		});
	});
	basket.total = appData.calculateTotal();

	modal.render({
		content: basket.render({}),
	});
});

events.on('basket:changed', (item: IProduct) => {
	if (appData.isProductInBasket(item.id)) {
		appData.deleteBasket(item.id);
	} else {
		appData.addBasket(item.id);
	}
});

events.on('basket:delete', (item: IProduct) => {
	appData.deleteBasket(item.id);
	events.emit('basket:open');
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: appData.order.payment,
			address: appData.order.address,
			valid: !!appData.order.payment && !!appData.order.address,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrderForm; value: string }) => {
		appData.updateOrderInfo(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<TOrderForm>) => {
	order.valid = Object.keys(errors).length > 0 ? false : true;
	order.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: appData.order.phone,
			email: appData.order.email,
			valid: !!appData.order.phone && !!appData.order.email,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TContactsForm; value: string }) => {
		appData.updateContactDetails(data.field, data.value);
	}
);

events.on('contactsFormErrors:change', (errors: Partial<TContactsForm>) => {
	contacts.valid = Object.keys(errors).length > 0 ? false : true;
	contacts.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	api
		.submitOrder(appData.order)
		.then((result) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({ total: result.total }),
			});
		})
		.catch((err) => console.log(err));
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.fetchProductList()
	.then((data) => {
		appData.setProducts(data);
	})
	.catch((err) => console.log(err));