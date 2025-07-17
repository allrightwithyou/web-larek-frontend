import { FormView } from './FormView';
import { EventEmitter } from '../components/base/events';

export class OrderContactsFormView extends FormView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private payButton: HTMLButtonElement;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    super('contacts');
    this.events = events;
    this.emailInput = this.element.querySelector('[name="email"]') as HTMLInputElement;
    this.phoneInput = this.element.querySelector('[name="phone"]') as HTMLInputElement;
    this.payButton = this.element.querySelector('button[type="submit"]') as HTMLButtonElement;

    this.emailInput.addEventListener('input', () => {
      this.events.emit('order:fieldChanged', { field: 'email', value: this.emailInput.value });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('order:fieldChanged', { field: 'phone', value: this.phoneInput.value });
    });
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:contacts:submit');
    });
  }

  setErrors(errors: Record<string, string>) {
    this.emailInput.classList.toggle('input_invalid', Boolean(errors.email));
    this.phoneInput.classList.toggle('input_invalid', Boolean(errors.phone));
    this.errors.textContent = errors.email || errors.phone || '';
  }

  setButtonDisabled(disabled: boolean) {
    this.payButton.disabled = disabled;
  }

  setServerError(message: string) {
    this.errors.textContent = message;
  }
} 