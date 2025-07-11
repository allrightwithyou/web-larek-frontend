import { PaymentType } from '../types/types';

export class OrderModel {
  public address = '';
  public payment: PaymentType = 'card';
  public email = '';
  public phone = '';

  setAddress(address: string) {
    this.address = address;
  }
  setPayment(payment: PaymentType) {
    this.payment = payment;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setPhone(phone: string) {
    this.phone = phone;
  }
  clear() {
    this.address = '';
    this.payment = 'card';
    this.email = '';
    this.phone = '';
  }
} 