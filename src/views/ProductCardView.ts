import { EventEmitter } from '../components/base/events';
import { ProductView } from '../types/types';

export class ProductCardView {
  public element: HTMLElement;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    // Элемент будет создан в render
    this.element = document.createElement('div');
  }

  render(product: ProductView) {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    card.querySelector('.card__title')!.textContent = product.title;
    card.querySelector('.card__price')!.textContent = `${product.price} синапсов`;
    const img = card.querySelector('.card__image') as HTMLImageElement;
    if (img) img.src = product.image;
    // Состояние (например, выделение если в корзине)
    if (product.inBasket) {
      card.classList.add('card_in-basket');
    } else {
      card.classList.remove('card_in-basket');
    }
    // Клик по карточке
    card.onclick = (e) => {
      this.events.emit('product:click', { id: product.id });
    };
    this.element = card;
  }
} 