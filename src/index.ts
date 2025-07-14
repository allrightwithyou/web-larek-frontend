import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './models/BasketModel';
import { BasketView } from './views/BasketView';
import { ProductModel } from './models/ProductModel';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductCardView } from './views/ProductCardView';
import { CatalogView } from './views/CatalogView';
import { OrderModel } from './models/OrderModel';
import { OrderFormView } from './views/OrderFormView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { ProductDetailView } from './views/ProductDetailView';

const events = new EventEmitter();
const api = new Api(API_URL);
const productModel = new ProductModel(api);
const basketModel = new BasketModel(events);
const basketContainer = document.createElement('div');
basketContainer.id = 'basket';
const basketView = new BasketView(basketContainer, events);

// Главный экран: каталог товаров
const catalog = new CatalogView(events);
document.body.appendChild(catalog.element);

(async () => {
  const products = await productModel.loadProducts();
  catalog.render(products);
})();

const productDetailView = new ProductDetailView(events);

events.on('product:click', (event: { id: string }) => {
  const product = productModel.getProductById(event.id);
  if (product) {
    productDetailView.render(product);
    showModal(productDetailView.element);
  }
});

events.on('basket:remove', (event: { id: string }) => {
  basketModel.removeItem(event.id);
  const product = productModel.getProductById(event.id);
  if (product) {
    product.inBasket = false;
    catalog.render(productModel.getProducts());
    // Если открыта детальная модалка, обновить её
    productDetailView.render(product);
  }
});

// Открытие корзины по клику на иконку в шапке
const headerBasketBtn = document.querySelector('.header__basket');
const headerBasketCounter = document.querySelector('.header__basket-counter');
if (headerBasketBtn) {
  headerBasketBtn.addEventListener('click', () => {
    basketView.render(basketModel.getItems());
    showModal(basketContainer);
  });
}
// Обновление счетчика корзины
function updateBasketCounter() {
  if (headerBasketCounter) {
    headerBasketCounter.textContent = String(basketModel.getItems().reduce((sum, item) => sum + item.quantity, 0));
  }
}
events.on('basket:change', (items: any[]) => {
  basketView.render(items);
  updateBasketCounter();
});

events.on('basket:add', (event: { id: string }) => {
  const product = productModel.getProductById(event.id);
  if (product && !product.inBasket) {
    basketModel.addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    product.inBasket = true;
    catalog.render(productModel.getProducts());
    // Если открыта детальная модалка, обновить её
    productDetailView.render(product);
  }
});

const orderModel = new OrderModel();
let orderFormView: OrderFormView | null = null;
let orderSuccessView: OrderSuccessView | null = null;

events.on('order:open', () => {
  closeModal(); // Закрываем корзину, если она открыта
  orderFormView = new OrderFormView(events);
  showModal(orderFormView.element);
});

events.on('order:submit', async (data: { address: string; payment: string; email: string; phone: string }) => {
  orderModel.setAddress(data.address);
  orderModel.setPayment(data.payment as any);
  orderModel.setEmail(data.email);
  orderModel.setPhone(data.phone);
  // Отправка заказа на сервер
  try {
    const payload = {
      items: basketModel.getItems().map(item => ({
        productId: item.id,
        price: item.price
      })),
      total: basketModel.getTotal(),
      address: orderModel.address,
      payment: orderModel.payment,
      email: orderModel.email,
      phone: orderModel.phone
    };
    await api.post('/order', payload);
    basketModel.clear();
    orderFormView = null;
    orderSuccessView = new OrderSuccessView(0); // Можно передать сумму заказа
    showModal(orderSuccessView.element);
    // Кнопка закрытия успеха
    orderSuccessView.element.querySelector('.order-success__close')?.addEventListener('click', () => {
      closeModal();
    });
  } catch (e) {
    console.error('Order error:', e);
    alert('Ошибка оформления заказа: ' + JSON.stringify(e));
  }
});

// Модальное окно (простая реализация)
const modal = document.getElementById('modal-container');
function showModal(content: HTMLElement) {
  if (!modal) return;
  modal.classList.add('modal_active');
  const modalContent = modal.querySelector('.modal__content');
  if (modalContent) {
    modalContent.innerHTML = '';
    modalContent.appendChild(content);
  }
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('modal_active');
  const modalContent = modal.querySelector('.modal__content');
  if (modalContent) modalContent.innerHTML = '';
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach((modal) => {
    // Клик по кнопке закрытия
    modal.querySelector('.modal__close')?.addEventListener('click', () => {
      modal.classList.remove('modal_active');
    });

    // Клик по фону (оверлею)
    modal.addEventListener('mousedown', (e) => {
      if (e.target === modal) {
        modal.classList.remove('modal_active');
      }
    });
  });
});


