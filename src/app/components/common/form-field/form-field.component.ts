import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  QueryList,
  Renderer2,
  viewChild,
} from '@angular/core';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { DOCUMENT } from '@angular/common';
import { IconChevronDownComponent } from '../../icons/icon-chevron-down/icon-chevron-down.component';
import { Platform } from '../../../utils/platform';
import { FormFieldAdditionalDirective } from './form-field-additional/form-field-additional.directive';

/** A component to create form field */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [IconXMarkComponent, IconChevronDownComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  host: {
    class: 'app-form-field flex-col-stretch gap-1',
  },
})
export class FormFieldComponent implements AfterContentInit {
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
  controlElement?:
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;

  /** Opened status of select options */
  private _selectOpened = false;

  /** Observer to detect `disabled` status change of `controlElement` */
  private _mutationObserver?: MutationObserver;

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
      } else {
        // Open options.
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
      this.controlElement = controlContainer.nativeElement.querySelector(
        'input, textarea, select',
      );
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

        // Remove select opened status as well.
        this._selectOpened = false;
      });
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
