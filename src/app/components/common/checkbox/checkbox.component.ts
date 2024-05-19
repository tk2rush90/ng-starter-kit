import {
  booleanAttribute,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { AppControlValueAccessor } from '../../../abstracts/app-control-value-accessor';
import { CheckboxService } from '../../../services/app/checkbox/checkbox.service';

/** A component of checkbox with label and button */
@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  host: {
    tabindex: '0',
    class: 'cursor-pointer select-none',
    role: 'checkbox',
    ['[attr.aria-checked]']: 'checked',
    ['[class.headwind-checked]']: 'checked',
  },
  providers: [CheckboxService],
})
export class CheckboxComponent extends AppControlValueAccessor {
  /** Emits when `checked` status has changed */
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor(private readonly _checkboxService: CheckboxService) {
    super();
  }

  /** Get disabled status */
  get disabled(): boolean {
    return this.isDisabled;
  }

  /** Set disabled status */
  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }

  /** Get checked status */
  get checked(): boolean {
    return this._checkboxService.checked;
  }

  /** Set checked status */
  @Input({ transform: booleanAttribute })
  set checked(value: boolean) {
    this._checkboxService.checked = value;
  }

  /** Listen click event to toggle checked status */
  @HostListener('click')
  onHostClick(): void {
    this.toggle();
  }

  /** Listen focus event to set `focused` status of service */
  @HostListener('focus')
  onHostFocus(): void {
    this._checkboxService.focused = true;
  }

  /** Listen blur event to mark as touched */
  @HostListener('blur')
  onHostBlur(): void {
    this.onTouched();

    this._checkboxService.focused = false;
  }

  /** Listen space keydown for accessibility */
  @HostListener('keydown.space', ['$event'])
  onHostSpaceKeydown(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.toggle();
  }

  /** Write value to component */
  override writeValue(obj: any) {
    this.checked = obj;
  }

  /** Update `NgControl` and component values. Also, emits `valueChange` */
  override updateValue(value: any) {
    super.updateValue(value);
    this.checkedChange.emit(value);
  }

  /** Set disabled status */
  override setDisabledState(isDisabled: boolean) {
    super.setDisabledState(isDisabled);

    // Apply to service.
    this._checkboxService.disabled = isDisabled;
  }

  /** Check the checkbox */
  check(): void {
    if (this.disabled) {
      return;
    }

    this.updateValue(true);
  }

  /** Uncheck the checkbox */
  uncheck(): void {
    if (this.disabled) {
      return;
    }

    this.updateValue(false);
  }

  /** Toggle checked status */
  toggle(): void {
    if (this.checked) {
      this.uncheck();
    } else {
      this.check();
    }
  }
}
