import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCarouselItem]',
  standalone: true,
})
export class CarouselItemDirective {
  @HostBinding('style.transform') transform = 'translateX(0)';
}
