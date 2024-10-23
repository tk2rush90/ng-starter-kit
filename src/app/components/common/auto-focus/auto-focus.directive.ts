import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { Platform } from '../../../utils/platform';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit, OnDestroy {
  private _focusTimeout: any;

  constructor(private readonly _elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (Platform.isBrowser) {
      // NG0100 오류 방지를 위해 `setTimeout()` 사용
      this._focusTimeout = setTimeout(() => {
        this._elementRef.nativeElement.focus();
      });
    }
  }

  ngOnDestroy() {
    clearTimeout(this._focusTimeout);
  }
}
