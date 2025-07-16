import { PaymentType } from '../types/types';
import { EventEmitter } from '../components/base/events';

export class OrderModel {
  public address = '';
  public payment: PaymentType = 'card';
  public email = '';
  public phone = '';
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setField(field: 'address' | 'payment' | 'email' | 'phone', value: string) {
    (this as any)[field] = value;
    this.validate();
  }

  validate() {
    const errors: Record<string, string> = {};
    // address
    if (!this.address.trim()) {
      errors.address = 'Введите адрес';
    }
    // payment
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    // email
    if (!this.email.trim()) {
      errors.email = 'Введите email';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      errors.email = 'Введите корректный email';
    }
    // phone
    if (!this.phone.trim()) {
      errors.phone = 'Введите телефон';
    } else if (!/^\+?7\s?\d{3}\s?\d{3}-?\d{2}-?\d{2}$/.test(this.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }
    this.events.emit('order:validationChanged', errors);
  }

  clear() {
    this.address = '';
    this.payment = 'card';
    this.email = '';
    this.phone = '';
    this.validate();
  }
} 