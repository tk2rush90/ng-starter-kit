import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppControlValueAccessor } from '../../../abstracts/app-control-value-accessor';
import { Logger } from '../../../utils/logger';

/** A directive to bind value changes immediately for IME input */
@Directive({
  selector: 'input[appImeInput], textarea[appImeInput]',
  standalone: true,
})
export class ImeInputDirective extends AppControlValueAccessor {
  /** Previous value */
  private _previousValue = '';

  /** Logger */
  private readonly _logger = new Logger('ImeInputDirective');

  constructor(private readonly _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>) {
    super();
  }

  /** This method does nothing */
  override writeValue(obj: any) {
    this._previousValue = obj;
  }

  /** Update value immediately after keydown or keyup */
  @HostListener('keydown', ['$event'])
  @HostListener('keyup', ['$event'])
  updateValueImmediately(event: Event): void {
    this.updateValue((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  /**
   * Update value with delay. The IME deletes the last character and re-create it by dispatching
   * input event twice. To prevent updating value twice, it should be updated with delay when
   * input event triggered.
   */
  @HostListener('input', ['$event'])
  updateValueWithDelay(event: Event): void {
    setTimeout(() => {
      const currentValue = (event.target as HTMLInputElement | HTMLTextAreaElement).value;

      this._logger.log(`Current value: ${currentValue}`);
      this._logger.log(`Previous value: ${this._previousValue}`);

      if (currentValue !== this._previousValue) {
        this.updateValue(currentValue);
      }
    });
  }

  override updateValue(value: any) {
    super.updateValue(value);

    if (this._elementRef) {
      this._elementRef.nativeElement.value = value;
    }
  }
}
