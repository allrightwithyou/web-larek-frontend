import { EventEmitter } from '../components/base/events';
import { ProductView } from '../types/types';

export class ProductDetailView {
  public element: HTMLElement;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    this.element = document.createElement('div');
    this.element.className = 'card card_full';
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'софт-скил':
        return 'soft';
      case 'хард-скил':
        return 'hard';
      case 'другое':
        return 'other';
      case 'дополнительно':
        return 'additional';
      case 'кнопка':
        return 'button';
      default:
        return 'other';
    }
  }

  render(product: ProductView) {
    this.element.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'card__image';
    img.src = product.image;
    img.alt = product.title;
    const column = document.createElement('div');
    column.className = 'card__column';
    const category = document.createElement('span');
    const categoryClass = this.getCategoryClass(product.category);
    category.className = 'card__category card__category_' + categoryClass;
    category.textContent = product.category;
    const title = document.createElement('h2');
    title.className = 'card__title';
    title.textContent = product.title;
    const desc = document.createElement('p');
    desc.className = 'card__text';
    desc.textContent = product.description;
    const row = document.createElement('div');
    row.className = 'card__row';
    const btn = document.createElement('button');
    btn.className = 'button card__button';
    if (product.inBasket) {
      btn.textContent = 'Убрать';
      btn.onclick = () => this.events.emit('basket:remove', { id: product.id });
    } else {
      btn.textContent = 'Купить';
      btn.onclick = () => this.events.emit('basket:add', { id: product.id });
    }
    const price = document.createElement('span');
    price.className = 'card__price';
    price.textContent = product.price + ' синапсов';
    row.appendChild(btn);
    row.appendChild(price);
    column.appendChild(category);
    column.appendChild(title);
    column.appendChild(desc);
    column.appendChild(row);
    this.element.appendChild(img);
    this.element.appendChild(column);
  }
} 