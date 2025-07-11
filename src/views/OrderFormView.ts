import { EventEmitter } from '../components/base/events';
import { PaymentType } from '../types/types';

export class OrderFormView {
  public element: HTMLElement;
  private events: EventEmitter;
  private step: number = 1;
  private data: { address: string; payment: PaymentType; email: string; phone: string };

  constructor(events: EventEmitter) {
    this.events = events;
    this.element = document.createElement('div');
    this.data = { address: '', payment: 'card', email: '', phone: '' };
    this.render();
  }

  render() {
    this.element.innerHTML = '';
    if (this.step === 1) {
      this.renderAddressStep();
    } else {
      this.renderContactsStep();
    }
  }

  renderAddressStep() {
    const form = document.createElement('form');
    form.className = 'form';
    form.innerHTML = `
      <div class="order">
        <div class="order__field">
          <h2 class="modal__title">Способ оплаты</h2>
          <div class="order__buttons">
            <button type="button" class="button button_alt${this.data.payment === 'card' ? ' button_alt-active' : ''}" data-pay="card">Онлайн</button>
            <button type="button" class="button button_alt${this.data.payment === 'cash' ? ' button_alt-active' : ''}" data-pay="cash">При получении</button>
          </div>
        </div>
        <label class="order__field">
          <span class="form__label modal__title">Адрес доставки</span>
          <input name="address" class="form__input" type="text" placeholder="Введите адрес" value="${this.data.address}" required />
        </label>
      </div>
      <div class="modal__actions">
        <button type="submit" class="button order__button">Далее</button>
        <span class="form__errors"></span>
      </div>
    `;
    form.onsubmit = (e) => {
      e.preventDefault();
      const address = (form.elements.namedItem('address') as HTMLInputElement).value.trim();
      if (!address) {
        form.querySelector('.form__errors')!.textContent = 'Введите адрес';
        return;
      }
      this.data.address = address;
      this.step = 2;
      this.render();
    };
    form.querySelectorAll('[data-pay]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.data.payment = (btn as HTMLElement).getAttribute('data-pay') as PaymentType;
        form.querySelectorAll('[data-pay]').forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
      });
    });
    this.element.appendChild(form);
  }

  renderContactsStep() {
    const form = document.createElement('form');
    form.className = 'form';
    form.innerHTML = `
      <div class="order">
        <label class="order__field">
          <span class="form__label modal__title">Email</span>
          <input name="email" class="form__input" type="email" placeholder="Введите Email" value="${this.data.email}" required />
        </label>
        <label class="order__field">
          <span class="form__label modal__title">Телефон</span>
          <input name="phone" class="form__input" type="text" placeholder="+7 (" value="${this.data.phone}" required />
        </label>
      </div>
      <div class="modal__actions">
        <button type="submit" class="button">Оплатить</button>
        <span class="form__errors"></span>
      </div>
    `;
    form.onsubmit = (e) => {
      e.preventDefault();
      const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
      if (!email || !phone) {
        form.querySelector('.form__errors')!.textContent = 'Заполните все поля';
        return;
      }
      this.data.email = email;
      this.data.phone = phone;
      this.events.emit('order:submit', { ...this.data });
    };
    this.element.appendChild(form);
  }
} 