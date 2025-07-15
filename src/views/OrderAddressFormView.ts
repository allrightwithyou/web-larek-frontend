import { FormView } from './FormView';
import { PaymentType } from '../types/types';

export class OrderAddressFormView extends FormView {
  public paymentButtons: NodeListOf<HTMLButtonElement>;
  private orderModel: { setPayment: (p: PaymentType) => void };
  private addressInput: HTMLInputElement;
  private nextButton: HTMLButtonElement;

  constructor(orderModel: { setPayment: (p: PaymentType) => void }) {
    super('order');
    this.orderModel = orderModel;
    this.paymentButtons = this.element.querySelectorAll('[data-pay]');
    this.addressInput = this.element.querySelector('[name="address"]') as HTMLInputElement;
    this.nextButton = this.element.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Проверка и активация кнопки при вводе адреса
    this.addressInput.addEventListener('input', () => this.updateNextButtonState());

    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.orderModel.setPayment(btn.getAttribute('data-pay') as PaymentType);
        this.updateNextButtonState();
      });
    });
    // Инициализация состояния кнопки
    this.updateNextButtonState();
  }

  private updateNextButtonState() {
    const addressFilled = this.addressInput.value.trim().length > 0;
    const paymentSelected = Array.from(this.paymentButtons).some(btn => btn.classList.contains('button_alt-active'));
    this.nextButton.disabled = !(addressFilled && paymentSelected);
  }
} 