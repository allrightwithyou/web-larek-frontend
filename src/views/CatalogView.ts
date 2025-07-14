import { EventEmitter } from '../components/base/events';
import { ProductView } from '../types/types';
import { ProductCardView } from './ProductCardView';

export class CatalogView {
  public element: HTMLElement;
  private events: EventEmitter;
  private cardViews: ProductCardView[] = [];

  constructor(events: EventEmitter) {
    this.events = events;
    const gallery = document.querySelector('.gallery') as HTMLElement;
    if (!gallery) {
      throw new Error('Контейнер .gallery не найден в DOM');
    }
    this.element = gallery;
  }

  render(products: ProductView[]) {
    this.element.innerHTML = '';
    this.cardViews = products.map(product => {
      const card = new ProductCardView(this.events);
      card.render(product);
      this.element.appendChild(card.element);
      return card;
    });
  }
} 