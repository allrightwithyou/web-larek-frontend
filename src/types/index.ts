// Типы данных, приходящие с API
export interface ProductApi {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  
}

export interface OrderApi {
  id: string;
  items: BasketItemApi[];
  total: number;
  address: string;
  email: string;
  phone: string;
  payment: PaymentType;
}

export interface BasketItemApi {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

// Типы для отображения на экране
export interface ProductView {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  inBasket: boolean;
}

export interface BasketItemView {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderView {
  id: string;
  items: BasketItemView[];
  total: number;
  address: string;
  email: string;
  phone: string;
  payment: PaymentType;
}

// Интерфейс API-клиента
export interface IApiClient {
  getProducts(): Promise<ProductApi[]>;
  getProduct(id: string): Promise<ProductApi>;
  createOrder(order: OrderApi): Promise<OrderApi>;
  
}

// Интерфейсы модели данных
export interface IBasketModel {
  items: BasketItemApi[];
  addItem(item: BasketItemApi): void;
  removeItem(productId: string): void;
  clear(): void;
  getTotal(): number;
}

export interface IOrderModel {
  order: OrderApi | null;
  setOrder(order: OrderApi): void;
  clearOrder(): void;
}

// Интерфейсы отображения
export interface IProductCardProps {
  product: ProductView;
  onClick: (id: string) => void;
}

export interface IBasketProps {
  items: BasketItemView[];
  onRemove: (id: string) => void;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string;
}

// Интерфейсы базовых классов событий
export type EventName = string | RegExp;
export type Subscriber = Function;
export interface EmitterEvent {
  eventName: string;
  data: unknown;
}

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Перечисления событий
export enum AppEvent {
  ProductAdded = 'product:added',
  ProductRemoved = 'product:removed',
  BasketCleared = 'basket:cleared',
  OrderCreated = 'order:created',
  ModalOpen = 'modal:open',
  ModalClose = 'modal:close',
}

// Интерфейсы событий
export interface ProductAddedEvent {
  productId: string;
}

export interface ProductRemovedEvent {
  productId: string;
}

export interface BasketClearedEvent {}

export interface OrderCreatedEvent {
  orderId: string;
}

export interface ModalEvent {
  isOpen: boolean;
  title?: string;
}

// Вспомогательные типы
export type PaymentType = 'card' | 'cash';

export interface UserContact {
  email: string;
  phone: string;
}
