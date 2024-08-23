import { Directive, HostBinding } from '@angular/core';
import { CarouselDirective } from '../carousel.directive';

@Directive({
  selector: '[appCarouselItem]',
  standalone: true,
})
export class CarouselItemDirective {
  @HostBinding('style.transform') transform = 'translateX(0)';

  constructor(private readonly _carousel: CarouselDirective) {}

  @HostBinding('class') get classObjects(): object {
    if (this._carousel.isSlided && this._carousel.isSliding) {
      return {
        'pointer-events-none': true,
        'select-none': true,
      };
    } else {
      return {};
    }
  }
}
