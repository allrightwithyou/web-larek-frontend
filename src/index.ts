import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './models/BasketModel';
import { BasketView } from './views/BasketView';
import { ProductModel } from './models/ProductModel';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCardView } from './views/ProductCardView';
import { CatalogView } from './views/CatalogView';
import { OrderModel } from './models/OrderModel';
import { OrderFormView } from './views/OrderFormView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { ProductDetailView } from './views/ProductDetailView';
import { ProductApi } from './types/types';
import type { ApiListResponse } from './components/base/api';
import { BasketItemView } from './views/BasketItemView';
import { ModalView } from './views/ModalView';
import { PageView } from './views/PageView';
import { OrderAddressFormView } from './views/OrderAddressFormView';
import { OrderContactsFormView } from './views/OrderContactsFormView';
import { PaymentType } from './types/types';

const events = new EventEmitter();
const api = new Api(API_URL);
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketContainer = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketContainer, events);

const pageView = new PageView();

// Главный экран: каталог товаров
const catalog = new CatalogView(events);

// Подписка на обновление продуктов
events.on('products:updated', () => {
  const cardElements = productModel.getProducts().map(product => {
    const card = new ProductCardView(events);
    card.render(product);
    return card.element;
  });
  catalog.render(cardElements);
});

async function loadAndRenderProducts() {
  try {
    const { items } = await api.get('/product') as ApiListResponse<ProductApi>;
    const products = items.map((p: ProductApi) => ({
      ...p,
      id: String(p.id),
      image: `${CDN_URL}/${p.image}`,
      inBasket: false
    }));
    productModel.setProducts(products);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    catalog.element.innerHTML = '<div class="error">Не удалось загрузить товары. Попробуйте позже.</div>';
  }
}

loadAndRenderProducts();

const productDetailView = new ProductDetailView(events);
const modalView = new ModalView();

events.on('product:click', (event: { id: string }) => {
  const product = productModel.getProductById(event.id);
  if (product) {
    // Проверяем, есть ли товар в корзине
    const inBasket = basketModel.getItems().some(item => item.id === product.id);
    productDetailView.render({ ...product, inBasket });
    modalView.open(productDetailView.element);
  }
});

events.on('basket:remove', (event: { id: string }) => {
  basketModel.removeItem(event.id);
  const product = productModel.getProductById(event.id);
  if (product) {
    product.inBasket = false;
    // Если открыта детальная модалка, обновить только её
    productDetailView.render({ ...product, inBasket: false });
  }
});

// Открытие корзины по клику на иконку в шапке
pageView.onBasketClick(() => {
  basketView.render(basketModel.getItems().map((item, idx) => new BasketItemView(item, events, idx).element));
  modalView.open(basketView.getElement());
});
// Обновление счетчика корзины
function updateBasketCounter() {
  pageView.setBasketCounter(basketModel.getItems().reduce((sum, item) => sum + item.quantity, 0));
  }

// Обновление корзины и суммы
function updateBasket() {
  const itemElements = basketModel.getItems().map((item, idx) => new BasketItemView(item, events, idx).element);
  basketView.render(itemElements);
  basketView.setTotal(basketModel.getTotal());
}

// Подписка на изменение корзины
events.on('basket:change', () => {
  updateBasket();
  updateBasketCounter();
});

events.on('basket:add', (event: { id: string }) => {
  const productId = typeof event.id === 'string' ? event.id : String(event.id);
  const product = productModel.getProductById(productId);
  if (product && !product.inBasket) {
    basketModel.addItem({
      id: String(product.id),
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    product.inBasket = true;
    productDetailView.render({ ...product, inBasket: true });
  }
});

const orderModel = new OrderModel();
const orderAddressFormView = new OrderAddressFormView(orderModel);
const orderContactsFormView = new OrderContactsFormView();
let orderSuccessView = new OrderSuccessView(0); // Сумма передаётся при успехе

events.on('order:open', () => {
  modalView.open(orderAddressFormView.element);
  // Навешиваем обработчики на кнопки оплаты (один раз)
  orderAddressFormView.paymentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      orderModel.setPayment(btn.getAttribute('data-pay') as PaymentType);
    });
  });
});

orderAddressFormView.element.addEventListener('submit', (e) => {
  e.preventDefault();
  const address = (orderAddressFormView.element.querySelector('[name="address"]') as HTMLInputElement)?.value || '';
  orderModel.setAddress(address);
  modalView.open(orderContactsFormView.element);
});

orderContactsFormView.element.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = (orderContactsFormView.element.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
  const phone = (orderContactsFormView.element.querySelector('[name="phone"]') as HTMLInputElement)?.value || '';
  const address = orderModel.address;
  const payment = orderModel.payment;
  events.emit('order:submit', { address, payment, email, phone });
});

events.on('order:submit', async (data: { address: string; payment: string; email: string; phone: string }) => {
  orderModel.setAddress(data.address);
  orderModel.setPayment(data.payment as any);
  orderModel.setEmail(data.email);
  orderModel.setPhone(data.phone);
  // Отправка заказа на сервер
  try {
    const payload = {
      items: basketModel.getItems().map(item => item.id),
      total: basketModel.getTotal(),
      address: orderModel.address,
      payment: orderModel.payment,
      email: orderModel.email,
      phone: orderModel.phone
    };
    const total = basketModel.getTotal(); // Сохраняем сумму до очистки корзины
    const response = await api.post('/order', payload);
    basketModel.clear();
    orderSuccessView = new OrderSuccessView(total); // Передаём правильную сумму
    modalView.open(orderSuccessView.element);
    orderSuccessView.element.addEventListener('order:close', () => {
      modalView.close();
    });
  } catch (e) {
    console.error('Order error:', e);
    alert('Ошибка оформления заказа: ' + JSON.stringify(e));
  }
});


