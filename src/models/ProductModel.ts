import { Api } from '../components/base/api';
import { ProductApi, ProductView } from '../types/types';
import { CDN_URL } from '../utils/constants';

export class ProductModel {
  private api: Api;
  private products: ProductView[] = [];

  constructor(api: Api) {
    this.api = api;
  }

  async loadProducts() {
    const { items } = await this.api.get('/product') as { items: ProductApi[] };
    this.products = items.map(p => ({
      ...p,
      image: `${CDN_URL}/${p.image}`,
      inBasket: false
    }));
    return this.products;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id);
  }
} 