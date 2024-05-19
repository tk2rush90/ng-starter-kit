import {
  AfterContentInit,
  Component,
  ContentChild,
  DestroyRef,
  HostListener,
  Input,
} from '@angular/core';
import { RadioGroupService } from '../../../../services/app/radio-group/radio-group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RadioButtonComponent } from './radio-button/radio-button.component';

/** A component which can be used as an option for `RadioGroupComponent` */
@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  host: {
    class: 'cursor-pointer select-none',
  },
})
export class RadioComponent implements AfterContentInit {
  /** Value of radio to apply when selected */
  @Input({ required: true }) value: any;

  /** Radio button that contains selected indicator */
  @ContentChild(RadioButtonComponent, { descendants: true })
  button?: RadioButtonComponent;

  /** Selected status */
  private _selected = false;

  constructor(
    private readonly _destroyRef: DestroyRef,
    private readonly _radioGroupService: RadioGroupService,
  ) {}

  /** Get selected status */
  get selected(): boolean {
    return this._selected;
  }

  ngAfterContentInit() {
    this._radioGroupService.value$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this._selected = this.value === value;

        if (this.button) {
          this.button.selected = this.selected;
        }
      });
  }

  @HostListener('click')
  onHostClick(): void {
    this._radioGroupService.selectOption.emit(this.value);
  }
}
