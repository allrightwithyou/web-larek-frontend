export class ModalView {
  public element: HTMLElement;
  private contentElement: HTMLElement;
  private closeButton: HTMLElement;

  constructor() {
    this.element = document.getElementById('modal-container')!;
    this.contentElement = this.element.querySelector('.modal__content')!;
    this.closeButton = this.element.querySelector('.modal__close')!;
    this.closeButton.addEventListener('click', () => this.close());
    this.element.addEventListener('mousedown', (e) => {
      if (e.target === this.element) this.close();
    });
  }

  open(content: HTMLElement) {
    this.setContent(content);
    this.element.classList.add('modal_active');
  }

  close() {
    this.element.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
  }

  setContent(content: HTMLElement) {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(content);
  }
} 