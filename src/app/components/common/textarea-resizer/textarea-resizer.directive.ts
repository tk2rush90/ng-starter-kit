import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

/** A directive that makes textarea to be resized by its content */
@Directive({
  selector: 'textarea[appTextareaResizer]',
  standalone: true,
  host: {
    rows: '1',
    class: 'resize-none',
  },
})
export class TextareaResizerDirective implements AfterViewInit {
  constructor(private readonly _elementRef: ElementRef<HTMLTextAreaElement>) {}

  ngAfterViewInit() {
    // Set initial size after view init.
    this.resize();
  }

  /** Listen `input` event of host element to resize height */
  @HostListener('input')
  onHostInput(): void {
    this.resize();
  }

  /** Listen `resize` event of `window` to resize height */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.resize();
  }

  /** Resize textarea height by content */
  resize(): void {
    this._elementRef.nativeElement.style.height = '0px';
    this._elementRef.nativeElement.style.height = `${this._elementRef.nativeElement.scrollHeight}px`;
  }
}
