import {
    IOrder,
	IOrderConfirmation,
	IProduct,
	IProductCatalogResponse,
	IStoreApiClient,
} from '../../types';
import { Api } from '../base/api';

export class LarekApi extends Api implements IStoreApiClient {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

    //Получает список всех товаров из каталога
	fetchProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: IProductCatalogResponse) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

    //Отправляет заказ на сервер
	submitOrder(data: Partial<IOrder>): Promise<IOrderConfirmation> {
		return this.post('/order', data).then((data: IOrderConfirmation) => data);
	}
}
