import { ILarekAPI, IOrder, IOrderSuccess, IProduct } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	private formatImageUrl(originalUrl: string): string {
		return this.cdn + originalUrl.replace('.svg', '.png');
	}

	async fetchProductList(): Promise<IProduct[]> {
		const response = (await this.get('/product')) as ApiListResponse<IProduct>;
		return response.items.map((product) => ({
			...product,
			image: this.formatImageUrl(product.image),
		}));
	}

    async submitOrder(orderData: IOrder): Promise<IOrderSuccess> {
        const result = await this.post('/order', orderData) as IOrderSuccess;
        return result;
    }
}
