// Импорты
import { LarekAPI } from './components/API/LarekAPI';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { AppData } from './components/Model/AppData';
import { Basket } from './components/VIew/Basket';
import { Card } from './components/VIew/Card';
import { Page } from './components/VIew/Page';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';
import { Order } from './components/VIew/Order';
import { Contacts } from './components/VIew/Contacts';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const data = new AppData(events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events); 

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:updated', () => {
    page.counter = data.getBasketCount();
});

events.on('bids:open', () => {
    const updateBasketView = () => {
        const basketItems = data.basket.items.map((id, index) => {
            const product = data.products.find(p => p.id === id);
            if (!product) return null;

            const item = new Card(cloneTemplate<HTMLElement>('#card-basket'), {
                onClick: () => {
                    data.deleteBasket(product);
                    updateBasketView();
                }
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
    };

    updateBasketView();
    modal.content = basket.render(); 
    modal.open();
});

events.on('products:updated', () => {
    const catalogItems = data.products.map(product => {
        const card = new Card(cloneTemplate<HTMLElement>('#card-catalog'), {
            onClick: () => {
                data.setPreview(product);
            }
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

api.fetchProductList()
    .then(products => {
        data.loadProducts(products);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });