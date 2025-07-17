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
import { OrderSuccessView } from './views/OrderSuccessView';
import { ProductDetailView } from './views/ProductDetailView';
import { ProductApi } from './types/types';
import type { ApiListResponse } from './components/base/api';
import { BasketItemView } from './views/BasketItemView';
import { ModalView } from './views/ModalView';
import { PageView } from './views/PageView';
import { OrderAddressFormView } from './views/OrderAddressFormView';
import { OrderContactsFormView } from './views/OrderContactsFormView';
import { OrderApi } from './types/types';

const events = new EventEmitter();
const api = new Api(API_URL);
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketContainer = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketContainer, events);

const pageView = new PageView(events);

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
    
    
  }
});

// Открытие корзины по клику на иконку в шапке
events.on('basket:open', () => {
  const items = basketModel.getItems().map((item, idx) => new BasketItemView(item, events, idx).element);
  basketView.render(items);
  basketView.setTotal(basketModel.getTotal());
  basketView.setOrderButtonDisabled(items.length === 0);
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
  basketView.setOrderButtonDisabled(basketModel.getItems().length === 0);
  // Удаляем проверку и обновление productDetailView отсюда
});

events.on('basket:add', (event: { id: string }) => {
  const productId = typeof event.id === 'string' ? event.id : String(event.id);
  const product = productModel.getProductById(productId);
  // Запрещаем добавление товаров без цены
  if (product && !product.inBasket && product.price != null) {
    basketModel.addItem({
      id: String(product.id),
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    product.inBasket = true;
  }
});

const orderModel = new OrderModel(events);
const orderAddressFormView = new OrderAddressFormView(events);
const orderContactsFormView = new OrderContactsFormView(events);
const orderSuccessView = new OrderSuccessView(0); // Сумма передаётся при успехе


// Передача изменений из view в модель

events.on('order:fieldChanged', (data: { field: string; value: string }) => {
  orderModel.setField(data.field as any, data.value);
});

// Передача ошибок и управления кнопкой из модели во view

events.on('order:validationChanged', (errors: Record<string, string>) => {
  // Для адреса
  orderAddressFormView.setErrors(errors);
  orderAddressFormView.setButtonDisabled(Boolean(errors.address) || Boolean(errors.payment));
  orderAddressFormView.setPayment(orderModel.payment);
  // Для контактов
  orderContactsFormView.setErrors(errors);
  orderContactsFormView.setButtonDisabled(Boolean(errors.email) || Boolean(errors.phone));
});

// --- Открытие модалок и submit ---
events.on('order:open', () => {
  modalView.open(orderAddressFormView.element);
});

events.on('order:address:submit', () => {
  // Просто открываем форму контактов, так как submit возможен только при валидной форме
  modalView.open(orderContactsFormView.element);
});

events.on('order:contacts:submit', () => {
  // Отправка заказа только если нет ошибок по email и телефону
  orderModel.validate();
  const errors: Record<string, string> = {};
  if (orderModel.email.trim() === '' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(orderModel.email)) errors.email = 'Введите корректный email';
  if (orderModel.phone.trim() === '' || !/^\+?7\s?\d{3}\s?\d{3}-?\d{2}-?\d{2}$/.test(orderModel.phone)) errors.phone = 'Введите корректный номер телефона';
  if (!errors.email && !errors.phone) {
    events.emit('order:submit', {
      address: orderModel.address,
      payment: orderModel.payment,
      email: orderModel.email,
      phone: orderModel.phone
    });
  }
});

events.on('order:submit', async (data: { address: string; payment: string; email: string; phone: string }) => {
  try {
    // Оставляем только товары с валидной ценой
    const validItems = basketModel.getItems().filter(item => item.price !== null && item.price !== undefined);
    const payload = {
      items: validItems.map(item => item.id),
      total: validItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
      address: orderModel.address,
      payment: orderModel.payment,
      email: orderModel.email,
      phone: orderModel.phone
    };
    const response = await api.post('/order', payload) as OrderApi;
    basketModel.clear();
    orderSuccessView.setTotal(response.total); // Используем сумму из ответа сервера
    modalView.open(orderSuccessView.element);
    orderSuccessView.onClose(() => {
      modalView.close();
    });
  } catch (e) {
    console.error('Order error:', e);
    // Выводим ошибку в форму контактов
    orderContactsFormView.setServerError('Ошибка оформления заказа: ' + (e?.message || JSON.stringify(e)));
  }
});

// Обновление productDetailView при изменении корзины
events.on('productDetail:update', (event: { id: string }) => {
  // Проверяем, что модалка открыта и отображает детали товара
  if (modalView.element.classList.contains('modal_active') && modalView.element.contains(productDetailView.element)) {
    const product = productModel.getProductById(event.id);
    if (product) {
      const inBasket = basketModel.getItems().some(item => item.id === product.id);
      productDetailView.render({ ...product, inBasket });
    }
  }
});


