import { LarekAPI } from './components/API/LarekAPI';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { AppData } from './components/Model/AppData';
import { Basket } from './components/View/Basket';
import { Card } from './components/View/Card';
import { Page } from './components/View/Page';
import './scss/styles.scss';
import { API_URL, CDN_URL, fieldsToForms } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IProduct, FormErrors, paymentMethod } from './types';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const data = new AppData(events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);

const orderForm = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);

events.on('modal:open', () => page.locked = true);
events.on('modal:close', () => page.locked = false);

events.on('basket:updated', () => {
    const basketItems = data.basket.items.map((id, index) => {
        const product = data.products.find(p => p.id === id);
        if (!product) return null;

        const item = new Card(cloneTemplate<HTMLElement>('#card-basket'), {
            onClick: () => data.deleteBasket(product)
        });

        return item.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    }).filter(Boolean);

    basket.render({
        items: basketItems,
        total: data.basket.total,
        selected: data.basket.items
    });

    page.counter = data.getBasketCount();
});

events.on('bids:open', () => {
    modal.content = basket.render();
    modal.open();
});

events.on('products:updated', () => {
    const catalogItems = data.products.map(product => {
        const card = new Card(cloneTemplate<HTMLElement>('#card-catalog'), {
            onClick: () => data.setPreview(product)
        });

        return card.render({
            id: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            price: product.price
        });
    });

    page.catalog = catalogItems;
    page.counter = data.getBasketCount();
});

events.on('product:viewed', (product: IProduct) => {
    const isInBasket = data.isProductInBasket(product.id);

    const previewCard = new Card(cloneTemplate<HTMLElement>('#card-preview'), {
        onClick: () => {
            if (isInBasket) {
                data.deleteBasket(product);
            } else {
                data.addBasket(product);
            }
            modal.close();
        }
    });

    previewCard.render({
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price
    });

    previewCard.button = isInBasket ? 'Удалить из корзины' : 'Купить';

    modal.content = previewCard.render();
    modal.open();
});

events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: data.order.payment,
            address: data.order.address,
            isValid: false,
            errors: []
        })
    });
    modal.open();
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: data.order.email,
            phone: data.order.phone,
            isValid: false,
            errors: []
        })
    });
    modal.open();
});

events.on('contacts:submit', () => {
    const finalOrder: IOrder = {
        ...data.order,
        total: data.basket.total,
        items: [...data.basket.items]
    };

    api.submitOrder(finalOrder)
        .then(() => {
            data.clearBasket();
            const success = new Success(cloneTemplate<HTMLElement>('#success'), {
                onClick: () => {
                    modal.close();
                }
            });
            success.total = finalOrder.total;
            modal.render({ content: success.render() });
            modal.open();
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
});

events.on('contacts.email:field-change', ({ field, value }: { field: keyof FormErrors, value: string }) => {
    data.updateField(field, value);
    contactsForm.email = value;
});

events.on('contacts.phone:field-change', ({ field, value }: { field: keyof FormErrors, value: string }) => {
    data.updateField(field, value);
    contactsForm.phone = value;
});

events.on('order.payment:field-change', ({ field, value }: { field: keyof FormErrors, value: paymentMethod }) => {
    data.updateField(field, value);
    orderForm.payment = value;
});

events.on('order.address:field-change', ({ field, value }: { field: keyof FormErrors, value: string }) => {
    data.updateField(field, value);
    orderForm.address = value;
});

events.on('errors:updated', ({ field }: { field: keyof FormErrors, }) => {
    if (fieldsToForms[field] === 'contacts') {
        const isValid = !!(data.order.phone && data.order.email)

        contactsForm.valid = isValid;

        if (isValid) {
            contactsForm.errors = '';
            return;
        }

        contactsForm.errors = data.formErrors[field];
    }

    if (fieldsToForms[field] === 'order') {
        const isValid = !!(data.order.address && data.order.payment)

        orderForm.valid = isValid;

        if (isValid) {
            orderForm.errors = '';
            return;
        }

        orderForm.errors = data.formErrors[field];
    }
});

api.fetchProductList()
    .then(products => data.loadProducts(products))
    .catch(error => console.error('Ошибка загрузки товаров:', error));
