export class PageView {
  public gallery: HTMLElement;
  public basketButton: HTMLElement;
  public basketCounter: HTMLElement;

  constructor() {
    this.gallery = document.querySelector('.gallery')!;
    this.basketButton = document.querySelector('.header__basket')!;
    this.basketCounter = document.querySelector('.header__basket-counter')!;
  }

  setBasketCounter(count: number) {
    this.basketCounter.textContent = String(count);
  }

  onBasketClick(handler: () => void) {
    this.basketButton.addEventListener('click', handler);
  }
} 