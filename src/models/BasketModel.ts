import { EventEmitter } from '../components/base/events';
import { BasketItemView } from '../types/types';

export class BasketModel {
  private items: BasketItemView[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  addItem(item: BasketItemView) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
    this.events.emit('basket:change', this.items);
  }

  removeItem(productId: string) {
    this.items = this.items.filter(i => i.id !== productId);
    this.events.emit('basket:change', this.items);
  }

  clear() {
    this.items = [];
    this.events.emit('basket:change', this.items);
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
} 