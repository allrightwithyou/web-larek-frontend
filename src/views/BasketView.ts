import { EventEmitter } from '../components/base/events';

export class BasketView {
  private container: HTMLElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    this.container = container;
    this.events = events;
  }

  render(items: any[]) {
    this.container.innerHTML = '';
    const basketDiv = document.createElement('div');
    basketDiv.className = 'basket';
    const title = document.createElement('h2');
    title.className = 'modal__title';
    title.textContent = 'Корзина';
    basketDiv.appendChild(title);
    const list = document.createElement('ul');
    list.className = 'basket__list';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'basket__item card card_compact';
      const index = document.createElement('span');
      index.className = 'basket__item-index';
      index.textContent = String(idx + 1);
      const name = document.createElement('span');
      name.className = 'card__title';
      name.textContent = item.title;
      const price = document.createElement('span');
      price.className = 'card__price';
      price.textContent = `${item.price * item.quantity} синапсов`;
      const btn = document.createElement('button');
      btn.className = 'basket__item-delete card__button';
      btn.setAttribute('aria-label', 'удалить');
      btn.onclick = () => this.events.emit('basket:item-remove', { id: item.id });
      li.appendChild(index);
      li.appendChild(name);
      li.appendChild(price);
      li.appendChild(btn);
      list.appendChild(li);
    });
    basketDiv.appendChild(list);
    const actions = document.createElement('div');
    actions.className = 'modal__actions';
    const orderBtn = document.createElement('button');
    orderBtn.className = 'button basket__button';
    orderBtn.textContent = 'Оформить';
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (sum === 0) orderBtn.disabled = true;
    orderBtn.onclick = () => this.events.emit('order:open', {});
    const total = document.createElement('span');
    total.className = 'basket__price';
    total.textContent = `${sum} синапсов`;
    actions.appendChild(orderBtn);
    actions.appendChild(total);
    basketDiv.appendChild(actions);
    this.container.appendChild(basketDiv);
  }
} 