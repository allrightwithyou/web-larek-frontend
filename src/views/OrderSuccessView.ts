export class OrderSuccessView {
  public element: HTMLElement;
  constructor(total: number) {
    this.element = document.createElement('div');
    this.element.className = 'order-success';
    this.element.innerHTML = `
      <h2 class="order-success__title">Заказ оформлен</h2>
      <p class="order-success__description">Списано ${total} синапсов</p>
      <button class="button order-success__close">За новыми покупками!</button>
    `;
  }
} 