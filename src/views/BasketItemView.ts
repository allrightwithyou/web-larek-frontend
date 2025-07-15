import { BasketItemView as BasketItem } from '../types/types';
import { EventEmitter } from '../components/base/events';

export class BasketItemView {
  public element: HTMLElement;

  constructor(item: BasketItem, events: EventEmitter, index: number) {
    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.element.querySelector('.basket__item-index')!.textContent = String(index + 1);
    this.element.querySelector('.card__title')!.textContent = item.title;
    this.element.querySelector('.card__price')!.textContent = `${item.price * item.quantity} синапсов`;
    const deleteBtn = this.element.querySelector('.basket__item-delete') as HTMLButtonElement;
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        events.emit('basket:remove', { id: item.id });
      });
    }
  }
} 