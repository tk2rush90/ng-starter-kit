import { Renderer2 } from '@angular/core';

export class StaticYoutubeEmbedNodeView {
  dom: HTMLElement;
  iframe: HTMLIFrameElement;

  constructor(
    private readonly _renderer: Renderer2,
    element: HTMLIFrameElement,
  ) {
    this.dom = this._renderer.createElement('div');
    this.iframe = this._renderer.createElement('iframe');

    this._renderer.setAttribute(this.iframe, 'src', element.src);
    this._renderer.setAttribute(this.iframe, 'allowfullscreen', '');
    this._renderer.setStyle(this.iframe, 'border', 'none');

    this._renderer.appendChild(this.dom, this.iframe);
  }
}
