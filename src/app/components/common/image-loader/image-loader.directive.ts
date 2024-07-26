import { Directive, HostBinding, HostListener } from '@angular/core';

/**
 * A directive to load image element.
 * When image it not loaded, it will be transparent.
 */
@Directive({
  selector: 'img[appImageLoader]',
  standalone: true,
  host: {
    class: 'transition-opacity',
  },
  exportAs: 'imageLoader',
})
export class ImageLoaderDirective {
  /** Image successfully loaded status */
  imageLoaded = false;

  /** Bind `opacity` according to image loaded status */
  @HostBinding('style.opacity')
  get opacity(): number {
    return this.imageLoaded ? 1 : 0;
  }

  /** Listen `load` event of `img` element. It marks `imageLoaded` as `true` */
  @HostListener('load')
  onImageLoad(): void {
    this.imageLoaded = true;
  }

  @HostListener('error')
  onImageError(): void {
    this.imageLoaded = false;
  }
}
