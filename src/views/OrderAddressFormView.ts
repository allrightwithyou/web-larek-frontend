import { FormView } from './FormView';
import { PaymentType } from '../types/types';
import { EventEmitter } from '../components/base/events';

export class OrderAddressFormView extends FormView {
  public paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private nextButton: HTMLButtonElement;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    super('order');
    this.events = events;
    this.paymentButtons = this.element.querySelectorAll('[data-pay]');
    this.addressInput = this.element.querySelector('[name="address"]') as HTMLInputElement;
    this.nextButton = this.element.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Навешиваем слушатель на input адреса
    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:fieldChanged', { field: 'address', value: this.addressInput.value });
    });

    // Навешиваем слушатели на кнопки оплаты
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.events.emit('order:fieldChanged', { field: 'payment', value: btn.getAttribute('data-pay') });
      });
    });

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:address:submit');
    });
  }

  setErrors(errors: Record<string, string>) {
    // Подсветка поля адреса
    this.addressInput.classList.toggle('input_invalid', Boolean(errors.address));
    // Подсветка кнопок оплаты
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-error', Boolean(errors.payment));
    });
    // Сообщение об ошибке
    this.errors.textContent = errors.address || errors.payment || '';
  }

  setButtonDisabled(disabled: boolean) {
    this.nextButton.disabled = disabled;
  }

  setPayment(payment: string) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.getAttribute('data-pay') === payment);
    });
  }
} 