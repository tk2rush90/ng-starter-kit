import {
  AfterContentInit,
  booleanAttribute,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  viewChild,
} from '@angular/core';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { DOCUMENT } from '@angular/common';
import { IconChevronDownComponent } from '../../icons/icon-chevron-down/icon-chevron-down.component';
import { Platform } from '../../../utils/platform';
import { FormFieldAdditionalDirective } from './form-field-additional/form-field-additional.directive';
import { IconAsteriskComponent } from '../../icons/icon-asterisk/icon-asterisk.component';

/** A component to create form field */
@Component({
    selector: 'app-form-field',
    imports: [IconXMarkComponent, IconChevronDownComponent, IconAsteriskComponent],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    host: {
        class: 'app-form-field flex-col-stretch gap-1',
    }
})
export class FormFieldComponent implements AfterContentInit, OnDestroy {
  @Input({ transform: booleanAttribute }) required = false;

  /** Focused status of control element */
  @HostBinding('class.focused') focused = false;

  /** Disabled status of control element */
  @HostBinding('class.disabled') disabled = false;

  /** QueryList of `FormFieldAdditionalDirective` */
  @ContentChildren(FormFieldAdditionalDirective)
  appFormFieldAdditionalQueryList?: QueryList<FormFieldAdditionalDirective>;

  /**
   * `ElementRef` of control container.
   * The reason why using `viewChild` instead of `@ViewChild()` is,
   * `@ViewChild()` cannot read `controlContainer` after content init.
   */
  controlContainer = viewChild('controlContainer', {
    read: ElementRef<HTMLElement>,
  });

  /** Rendered control element */
  controlElement?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

  /** Opened status of select options */
  private _selectOpened = false;

  /** Flag to set selectedOptions property to false after mouseup */
  private _readyToCloseSelectOptions = false;

  /** Timeout timer to close select options */
  private _readyToCloseTimer: any;

  /** Observer to detect `disabled` status change of `controlElement` */
  private _mutationObserver?: MutationObserver;

  /** Callback to cancel listening pointer up for select */
  private _cancelListenPointerup?: () => void;

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly _renderer: Renderer2,
  ) {}

  /** Having status for input element in control container. It binds `with-input` class to host element */
  @HostBinding('class.with-input')
  get hasInput(): boolean {
    return this.controlElement instanceof HTMLInputElement;
  }

  /** Having status for select element in control container. It binds `with-select` class to host element */
  @HostBinding('class.with-select')
  get hasSelect(): boolean {
    return this.controlElement instanceof HTMLSelectElement;
  }

  /** Having status for textarea element in control container. It binds `with-textarea` class to host element */
  @HostBinding('class.with-textarea')
  get hasTextarea(): boolean {
    return this.controlElement instanceof HTMLTextAreaElement;
  }

  ngAfterContentInit() {
    this._detectControlElement();
    this._setControlElementListeners();
    this._observeControlElement();

    // Sometimes, `focused` status not detected when component initialized.
    if (this.controlElement === this._document.activeElement) {
      this.focused = true;
    }

    // Sometimes, `disabled` status not detected when component initialized.
    this.disabled = !!this.controlElement?.disabled;
  }

  ngOnDestroy() {
    clearTimeout(this._readyToCloseTimer);
  }

  /** Listen `click` event of host element to focus to control element */
  @HostListener('click')
  onHostClick(): void {
    this.focusToControlElement();
    this.toggleSelectOptions();
  }

  /** Focus to rendered control element */
  focusToControlElement(): void {
    this.controlElement?.focus();
  }

  /** Toggle options when `controlElement is select element */
  toggleSelectOptions(): void {
    if (this.hasSelect) {
      if (this._selectOpened) {
        // Close options.
        this._selectOpened = false;
      } else if (!this.disabled) {
        // Open options. Only works when not disabled.
        (this.controlElement as HTMLSelectElement).showPicker();
        this._selectOpened = true;
      }
    }
  }

  /** Reset the value of control element */
  resetControlElement(): void {
    if (this.controlElement) {
      this.controlElement.value = '';
      this.controlElement.dispatchEvent(new Event('input')); // Dispatch event to change model.
    }
  }

  /** Detect rendered element in control container */
  private _detectControlElement(): void {
    const controlContainer = this.controlContainer();

    if (controlContainer) {
      // Find target control element.
      this.controlElement = controlContainer.nativeElement.querySelector('input, textarea, select');
    }
  }

  /** Set initial listeners to `controlElement` to enable required features */
  private _setControlElementListeners(): void {
    if (this.controlElement) {
      // When `input` listener isn't set, `controlElement.value` cannot be detected from the template.
      this._renderer.listen(this.controlElement, 'input', () => {});

      // Listen `focus` event to set `focused` status.
      this._renderer.listen(this.controlElement, 'focus', () => {
        this.focused = true;
      });

      // Listen `blur` event to remove `focused` status.
      this._renderer.listen(this.controlElement, 'blur', () => {
        this.focused = false;

        this._setSelectClosedWithDelay();
      });
    }
  }

  /** Mark selectOpened as closed after a delay to prevent instant opening on clicking form field */
  private _setSelectClosedWithDelay(): void {
    if (this._selectOpened) {
      this._readyToCloseSelectOptions = true;

      clearTimeout(this._readyToCloseTimer);

      this._readyToCloseTimer = setTimeout(() => {
        this._readyToCloseSelectOptions = false;
      }, 1000);

      this._cancelListenPointerup = this._renderer.listen(window, 'pointerup', () => this._windowPointerupListener());
    }
  }

  /** Event listener for window:pointerup to close select options with delay */
  private _windowPointerupListener(): void {
    clearTimeout(this._readyToCloseTimer);

    if (this._readyToCloseSelectOptions) {
      setTimeout(() => {
        this._selectOpened = false;
      });
    }

    this._readyToCloseSelectOptions = false;

    if (this._cancelListenPointerup) {
      this._cancelListenPointerup();

      delete this._cancelListenPointerup;
    }
  }

  /** Observe `controlElement` to detect disabled status changes */
  private _observeControlElement(): void {
    if (Platform.isBrowser && this.controlElement) {
      // Create `MutationObserver`.
      this._mutationObserver = new MutationObserver((records) => {
        records.forEach((_record) => {
          // Update disabled status.
          this.disabled = (_record.target as HTMLInputElement).disabled;
        });
      });

      // Observe `controlElement`.
      this._mutationObserver.observe(this.controlElement, {
        attributes: true,
      });
    }
  }
}
