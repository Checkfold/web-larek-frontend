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

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const data = new AppData(events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Обработчик обновления товаров
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
});

// Обработчик просмотра товара с правильной типизацией
events.on('product:viewed', (data: IProduct) => {
    // Создаем карточку для превью
    const previewCard = new Card(cloneTemplate<HTMLElement>('#card-preview'), {
        onClick: () => {
            // Здесь будет логика добавления в корзину
            console.log('Добавить в корзину:', data.title);
        }
    });

    // Используем правильные свойства IProduct
    previewCard.render({
        id: data.id,
        title: data.title,
        image: data.image,
        category: data.category,
        description: data.description,
        price: data.price
    });
    
    // Открываем модальное окно с превью - используем публичный метод
    modal.content = previewCard.render();
    modal.open();
});

// Блокировка скролла при открытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокировка скролла при закрытии модального окна
events.on('modal:close', () => {
    page.locked = false;
});

// Загрузка товаров
api.fetchProductList()
    .then(products => {
        data.loadProducts(products);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });