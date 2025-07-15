import { PaymentType } from '../types/types';

export class OrderFormView {
  public element: HTMLElement;
  public addressInput: HTMLInputElement | null;
  public paymentButtons: NodeListOf<HTMLButtonElement>;
  public emailInput: HTMLInputElement | null;
  public phoneInput: HTMLInputElement | null;
  public errorBlock: HTMLElement | null;
  public submitButton: HTMLButtonElement | null;

  constructor(templateId: string) {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.addressInput = this.element.querySelector('[name="address"]');
    this.paymentButtons = this.element.querySelectorAll('[data-pay]');
    this.emailInput = this.element.querySelector('[name="email"]');
    this.phoneInput = this.element.querySelector('[name="phone"]');
    this.errorBlock = this.element.querySelector('.form__errors');
    this.submitButton = this.element.querySelector('button[type="submit"]');
  }

  setAddress(value: string) { if (this.addressInput) this.addressInput.value = value; }
  setEmail(value: string) { if (this.emailInput) this.emailInput.value = value; }
  setPhone(value: string) { if (this.phoneInput) this.phoneInput.value = value; }
  setPayment(value: PaymentType) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.getAttribute('data-pay') === value);
    });
  }
  setError(message: string) { if (this.errorBlock) this.errorBlock.textContent = message; }
} 