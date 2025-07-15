import { ProductView } from '../types/types';
import { CDN_URL } from '../utils/constants';

export class ProductModel {
  private products: ProductView[] = [];

  setProducts(products: ProductView[]) {
    this.products = products;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id);
  }
} 