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
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    card.querySelector('.card__title')!.textContent = product.title;
    card.querySelector('.card__price')!.textContent = `${(typeof product.price === 'number' && product.price > 0) ? product.price : 0} синапсов`;
    const img = card.querySelector('.card__image') as HTMLImageElement;
    if (img) img.src = product.image;
    // Категория и цвет рамки
    const categorySpan = card.querySelector('.card__category') as HTMLElement;
    if (categorySpan) {
      const categoryClass = this.getCategoryClass(product.category);
      categorySpan.className = `card__category card__category_${categoryClass}`;
      categorySpan.textContent = product.category;
    }
    // Состояние (например, выделение если в корзине)
    if (product.inBasket) {
      card.classList.add('card_in-basket');
    } else {
      card.classList.remove('card_in-basket');
    }
    // Кнопка Купить
    const buyBtn = card.querySelector('button');
    if (buyBtn) {
      buyBtn.disabled = false;
    }
    card.onclick = (e) => {
      this.events.emit('product:click', { id: product.id });
    };
    this.element = card;
  }
} 