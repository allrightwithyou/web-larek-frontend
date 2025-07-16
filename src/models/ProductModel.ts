import { ProductView } from '../types/types';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from '../components/base/events';

export class ProductModel {
  private products: ProductView[] = [];
  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }

  setProducts(products: ProductView[]) {
    this.products = products;
    if (this.events) {
      this.events.emit('products:updated', this.products);
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id);
  }
} 