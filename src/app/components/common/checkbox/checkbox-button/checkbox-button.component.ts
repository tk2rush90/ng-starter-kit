import { Component } from '@angular/core';
import { CheckboxService } from '../../../../services/app/checkbox/checkbox.service';

/** Checkbox button with checked status */
@Component({
  selector: 'app-checkbox-button',
  standalone: true,
  imports: [],
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss',
  host: {
    class: 'flex-center rounded border border-slate-300 w-5 h-5',
  },
})
export class CheckboxButtonComponent {
  constructor(private readonly _checkboxService: CheckboxService) {}

  /** Get checked status */
  get checked(): boolean {
    return this._checkboxService.checked;
  }

  /** Get focused status */
  get focused(): boolean {
    return this._checkboxService.focused;
  }
}
