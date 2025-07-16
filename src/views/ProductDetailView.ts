import { EventEmitter } from '../components/base/events';
import { ProductView } from '../types/types';

export class ProductDetailView {
  public element: HTMLElement;
  private events: EventEmitter;
  private template: HTMLTemplateElement;
  public currentProductId: string | null = null;

  constructor(events: EventEmitter) {
    this.events = events;

    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with id "card-preview" not found');
    }
    this.template = template;

    // Контейнер, в который будет вставляться содержимое шаблона
    this.element = document.createElement('div');
  }

  private getCategoryClass(category: string): string {
    switch (category) {
      case 'софт-скил': return 'soft';
      case 'хард-скил': return 'hard';
      case 'другое': return 'other';
      case 'дополнительно': return 'additional';
      case 'кнопка': return 'button';
      default: return 'other';
    }
  }

  render(product: ProductView) {
    this.currentProductId = product.id;
    this.element.innerHTML = ''; // очищаем контейнер
    const clone = this.template.content.cloneNode(true) as HTMLElement;

    // Находим нужные элементы в шаблоне
    const img = clone.querySelector('.card__image') as HTMLImageElement;
    const category = clone.querySelector('.card__category') as HTMLElement;
    const title = clone.querySelector('.card__title') as HTMLElement;
    const desc = clone.querySelector('.card__text') as HTMLElement;
    const btn = clone.querySelector('.card__button') as HTMLButtonElement;
    const price = clone.querySelector('.card__price') as HTMLElement;

    // Устанавливаем данные
    img.src = product.image;
    img.alt = product.title;
    title.textContent = product.title;
    desc.textContent = product.description;
    category.textContent = product.category;
    category.className = 'card__category card__category_' + this.getCategoryClass(product.category);
    price.textContent = `${product.price} синапсов`;

    if (product.inBasket) {
      btn.textContent = 'Убрать';
      btn.onclick = () => this.events.emit('basket:remove', { id: product.id });
    } else {
      btn.textContent = 'Купить';
      btn.onclick = () => this.events.emit('basket:add', { id: product.id });
    }

    this.element.appendChild(clone);
  }
}
