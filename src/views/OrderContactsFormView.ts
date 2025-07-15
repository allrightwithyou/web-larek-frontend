import { FormView } from './FormView';

export class OrderContactsFormView extends FormView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private payButton: HTMLButtonElement;

  constructor() {
    super('contacts');
    this.emailInput = this.element.querySelector('[name="email"]') as HTMLInputElement;
    this.phoneInput = this.element.querySelector('[name="phone"]') as HTMLInputElement;
    this.payButton = this.element.querySelector('button[type="submit"]') as HTMLButtonElement;

    this.emailInput.addEventListener('input', () => this.updatePayButtonState());
    this.phoneInput.addEventListener('input', () => this.updatePayButtonState());
    this.updatePayButtonState();
  }

  private updatePayButtonState() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const phoneValid = /^\+?7\s?\d{3}\s?\d{3}-?\d{2}-?\d{2}$/.test(phone);

    let error = '';
    if (!email && !phone) {
      error = 'Заполните все поля';
    } else if (!emailValid && email.length > 0) {
      error = 'Введите корректный email';
    } else if (!phoneValid && phone.length > 0) {
      error = 'Введите корректный номер телефона';
    }

    this.payButton.disabled = !(email && phone && emailValid && phoneValid);

    // Визуальная подсветка
    this.emailInput.classList.toggle('input_invalid', !emailValid && email.length > 0);
    this.phoneInput.classList.toggle('input_invalid', !phoneValid && phone.length > 0);

    // Показываем ошибку
    const errorBlock = this.element.querySelector('.form__errors');
    if (errorBlock) errorBlock.textContent = error;
  }
}

export {}; 