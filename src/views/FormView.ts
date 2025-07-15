import { ensureElement, cloneTemplate } from '../utils/utils';

export class FormView {
  public element: HTMLFormElement;
  protected fields: Record<string, HTMLInputElement> = {};
  protected submitButton: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(templateId: string) {
    this.element = cloneTemplate<HTMLFormElement>(`#${templateId}`);
    this.element.querySelectorAll('input, textarea').forEach((input: Element) => {
      const name = input.getAttribute('name');
      if (name) this.fields[name] = input as HTMLInputElement;
    });
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.element);
    this.errors = ensureElement<HTMLElement>('.form__errors', this.element);
    this.element.addEventListener('submit', (e) => this.onSubmit(e));
  }

  protected onSubmit(e: Event) {
    e.preventDefault();
    // Общая логика валидации/отправки может быть реализована в наследниках
  }

  render(data: Record<string, string>) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.fields[key]) this.fields[key].value = value;
    });
  }
} 