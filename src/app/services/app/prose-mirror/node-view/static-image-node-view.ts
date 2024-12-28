import { Renderer2 } from '@angular/core';

export class StaticImageNodeView {
  dom: HTMLElement;
  image: HTMLImageElement;
  caption?: HTMLElement;
  text?: Text;

  constructor(
    private readonly _renderer: Renderer2,
    element: HTMLImageElement,
  ) {
    this.dom = this._renderer.createElement('div');
    this.image = this._renderer.createElement('img');

    this._renderer.setAttribute(this.image, 'src', element.src);
    this._renderer.setAttribute(this.image, 'alt', element.alt);
    this._renderer.setAttribute(this.image, 'title', element.title);
    this._renderer.setAttribute(this.image, 'loading', 'lazy');

    this._renderer.appendChild(this.dom, this.image);
    this.renderCaption();
  }

  renderCaption(): void {
    this.text?.remove();
    this.caption?.remove();

    if (this.image.alt) {
      this.caption = this._renderer.createElement('div');

      this._renderer.addClass(this.caption, 'text-center');
      this._renderer.addClass(this.caption, 'text-base');
      this._renderer.addClass(this.caption, 'md:text-lg');
      this._renderer.addClass(this.caption, 'text-gray-400');
      this._renderer.addClass(this.caption, 'break-all');
      this._renderer.addClass(this.caption, 'mb-8');

      this.text = this._renderer.createText(this.image.alt);

      this._renderer.appendChild(this.caption, this.text);
      this._renderer.appendChild(this.dom, this.caption);
    }

    if (this.caption) {
      this.dom.classList.add('prose-img:mb-1');
    } else {
      this.dom.classList.remove('prose-img:mb-1');
    }
  }
}
