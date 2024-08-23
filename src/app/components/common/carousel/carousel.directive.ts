import {
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  Input,
  numberAttribute,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { CarouselItemDirective } from './carousel-item/carousel-item.directive';
import { Platform } from '../../../utils/platform';
import anime, { AnimeInstance } from 'animejs';

@Directive({
  selector: '[appCarousel]',
  standalone: true,
  exportAs: 'carousel',
})
export class CarouselDirective implements OnDestroy {
  @Input({ transform: numberAttribute }) gap = 0;

  @Input({ transform: numberAttribute }) itemWidth = 0;

  @ContentChildren(CarouselItemDirective) carouselItemDirectives?: QueryList<CarouselItemDirective>;

  startX = 0;

  movedX = 0;

  storedX = 0;

  isSliding = false;

  isSlided = false;

  slideIndex = 0;

  private _resizeTimer: any;

  private _animeInstance?: AnimeInstance;

  constructor(private readonly _elementRef: ElementRef<HTMLDivElement>) {
    this.startSliding = this.startSliding.bind(this);
    this.moveSlide = this.moveSlide.bind(this);

    if (Platform.isBrowser) {
      this._elementRef.nativeElement.addEventListener('mousedown', this.startSliding);
      this._elementRef.nativeElement.addEventListener('mousemove', this.moveSlide);
      this._elementRef.nativeElement.addEventListener('touchstart', this.startSliding, { passive: false });
      this._elementRef.nativeElement.addEventListener('touchmove', this.moveSlide, { passive: false });
    }
  }

  get width(): number {
    return this.itemWidth > 0 ? this.itemWidth : this._elementRef.nativeElement.offsetWidth;
  }

  get carouselItemsLength(): number {
    return this.carouselItemDirectives?.length || 0;
  }

  get transform(): string {
    return `translate(${this.storedX + this.movedX - this.startX + this.slideIndex * -this.gap}px)`;
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._elementRef.nativeElement.removeEventListener('mousedown', this.startSliding);
      this._elementRef.nativeElement.removeEventListener('mousemove', this.moveSlide);
      this._elementRef.nativeElement.removeEventListener('touchstart', this.startSliding);
      this._elementRef.nativeElement.removeEventListener('touchmove', this.moveSlide);
    }

    clearTimeout(this._resizeTimer);

    this.pause();

    delete this._animeInstance;
  }

  startSliding(event: MouseEvent | TouchEvent): void {
    this.isSliding = true;

    this.pause();

    if (event instanceof MouseEvent) {
      this.startX = event.x;
    } else {
      this.startX = event.touches[0].pageX;
    }

    this.movedX = this.startX;
  }

  moveSlide(event: MouseEvent | TouchEvent): void {
    if (this.isSliding) {
      if (event instanceof MouseEvent) {
        this.movedX = event.x;
      } else {
        this.movedX = event.touches[0].pageX;
      }

      if (Math.abs(this.movedX - this.startX) > 5) {
        this.isSlided = true;
      }
    }

    if (this.isSlided && event.cancelable) {
      event.preventDefault();
    }

    this.updateCarouselTransform();
  }

  @HostListener('window:resize')
  repositionPages(): void {
    clearTimeout(this._resizeTimer);

    this._resizeTimer = setTimeout(() => {
      this.storedX = -this.slideIndex * this.width;

      this.updateCarouselTransform();
    }, 10);
  }

  @HostListener('window:mouseup', ['$event'])
  @HostListener('window:pointerup', ['$event'])
  @HostListener('window:pointerleave', ['$event'])
  @HostListener('window:pointercancel', ['$event'])
  stopSliding(event: Event): void {
    if (this.isSliding) {
      this.isSliding = false;
      this.isSlided = false;
      this.storedX += this.movedX - this.startX;

      if (this.movedX - this.startX === 0 && (Platform.isMobile || Platform.isTablet)) {
        const anchors = this._elementRef.nativeElement.querySelectorAll('a');

        for (let i = anchors.length - 1; i >= 0; i--) {
          const _anchor = anchors[i];

          if (_anchor === event.target || _anchor.contains(event.target as HTMLElement)) {
            _anchor.click();
            break;
          }
        }

        return;
      }

      const canMove = Math.abs((this.movedX - this.startX) / this.width) > 0.2;
      const isLeft = this.movedX - this.startX > 0;

      this.movedX = 0;
      this.startX = 0;

      if (this.storedX > 0) {
        this.animate(0);
      } else if (this.storedX + this.movedX < this.width * -(this.carouselItemsLength - 1)) {
        this.animate(this.width * -(this.carouselItemsLength - 1));
      } else {
        const currentX = this.storedX / this.width;

        if (canMove) {
          if (isLeft) {
            this.animate(this.width * Math.ceil(currentX));
          } else {
            this.animate(this.width * Math.floor(currentX));
          }
        } else {
          this.animate(this.width * -this.slideIndex);
        }
      }
    }
  }

  animate(to: number): void {
    this._animeInstance = anime({
      targets: this,
      storedX: to,
      duration: 300,
      easing: 'easeOutCirc',
      change: () => {
        this.updateCarouselTransform();
        this.updateSlideIndex();
      },
    });
  }

  pause(): void {
    this._animeInstance?.pause();
  }

  updateSlideIndex(): void {
    const movedX = Math.min(Math.max(this.storedX / this.width, -this.carouselItemsLength), 0);

    this.slideIndex = Math.round(Math.abs(movedX));
  }

  updateCarouselTransform(): void {
    this.carouselItemDirectives?.forEach(
      (_carouselItemDirective) => (_carouselItemDirective.transform = this.transform),
    );
  }
}
