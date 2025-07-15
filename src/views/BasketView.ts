import { EventEmitter } from '../components/base/events';

export class BasketView {
  public element: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private orderButton: HTMLButtonElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    this.events = events;
    // Используем шаблон basket
    const template = document.getElementById('basket') as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    container.appendChild(this.element);
    // Находим элементы один раз
    this.listElement = this.element.querySelector('.basket__list')!;
    this.totalElement = this.element.querySelector('.basket__price')!;
    this.orderButton = this.element.querySelector('.basket__button')!;
    // Навешиваем обработчик на кнопку оформления
    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  render(items: HTMLElement[]) {
    this.listElement.innerHTML = '';
    items.forEach(item => this.listElement.appendChild(item));
  }

  setTotal(total: number) {
    this.totalElement.textContent = `${total} синапсов`;
  }

  getElement() {
    return this.element;
  }
} 