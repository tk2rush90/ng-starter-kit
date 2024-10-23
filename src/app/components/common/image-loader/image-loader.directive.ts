import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { Platform } from '../../../utils/platform';

/**
 * A directive to load image element.
 * When image it not loaded, it will be transparent.
 */
@Directive({
  selector: 'img[appImageLoader]',
  standalone: true,
  host: {
    '[class.transition-opacity]': 'transition',
    '[class.hidden]': 'imageError',
  },
  exportAs: 'imageLoader',
})
export class ImageLoaderDirective implements AfterViewInit, OnDestroy {
  /** Image successfully loaded status */
  imageLoaded = false;

  imageError = false;

  transition = false;

  private _mutationObserver?: MutationObserver;

  constructor(private readonly _elementRef: ElementRef<HTMLImageElement>) {}

  /** Bind `opacity` according to image loaded status */
  @HostBinding('style.opacity')
  get opacity(): number {
    return this.imageLoaded ? 1 : 0;
  }

  ngAfterViewInit() {
    if (Platform.isBrowser) {
      this._mutationObserver = new MutationObserver((records) => {
        records.forEach((_record) => {
          if (_record.attributeName?.toLowerCase() === 'src') {
            this.imageLoaded = false;
            this.imageError = false;
            this.transition = false;
          }
        });
      });

      this._mutationObserver.observe(this._elementRef.nativeElement, {
        attributes: true,
      });
    }
  }

  ngOnDestroy() {
    this._mutationObserver?.disconnect();
  }

  /** Listen `load` event of `img` element. It marks `imageLoaded` as `true` */
  @HostListener('load')
  onImageLoad(): void {
    this.transition = true;
    this.imageLoaded = true;
  }

  @HostListener('error')
  onImageError(): void {
    this.imageError = true;
    this.imageLoaded = false;
  }
}
