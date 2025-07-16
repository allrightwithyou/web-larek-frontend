import { EventEmitter } from '../components/base/events';

export class PageView {
  public gallery: HTMLElement;
  public basketButton: HTMLElement;
  public basketCounter: HTMLElement;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    this.gallery = document.querySelector('.gallery')!;
    this.basketButton = document.querySelector('.header__basket')!;
    this.basketCounter = document.querySelector('.header__basket-counter')!;
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  setBasketCounter(count: number) {
    this.basketCounter.textContent = String(count);
  }
} 