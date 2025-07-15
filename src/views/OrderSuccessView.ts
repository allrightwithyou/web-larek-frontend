export class OrderSuccessView {
  public element: HTMLElement;
  private totalElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(total: number) {
    const template = document.getElementById('success') as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.totalElement = this.element.querySelector('.order-success__description')!;
    this.closeButton = this.element.querySelector('.order-success__close')!;
    this.setTotal(total);
    this.closeButton.addEventListener('click', () => {
      // Здесь можно вызвать внешний callback или событие, если нужно
      this.element.dispatchEvent(new CustomEvent('order:close'));
    });
  }

  setTotal(total: number) {
    this.totalElement.textContent = `Списано ${total} синапсов`;
  }
} 