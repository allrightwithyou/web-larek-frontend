import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export class CatalogView {
  public element: HTMLElement;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    this.element = ensureElement<HTMLElement>('.gallery');
  }

  render(cardElements: HTMLElement[]) {
    this.element.innerHTML = '';
    cardElements.forEach(card => this.element.appendChild(card));
  }
} 