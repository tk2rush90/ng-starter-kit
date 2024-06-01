import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RadioGroupComponent } from './components/common/radio-group/radio-group.component';
import { RadioComponent } from './components/common/radio-group/radio/radio.component';
import { RadioButtonComponent } from './components/common/radio-group/radio/radio-button/radio-button.component';
import { CheckboxComponent } from './components/common/checkbox/checkbox.component';
import { CheckboxButtonComponent } from './components/common/checkbox/checkbox-button/checkbox-button.component';
import { FormFieldComponent } from './components/common/form-field/form-field.component';
import { Platform } from './utils/platform';
import { FlatButtonDirective } from './components/common/flat-button/flat-button.directive';
import { TextareaResizerDirective } from './components/common/textarea-resizer/textarea-resizer.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RadioGroupComponent,
    RadioComponent,
    RadioButtonComponent,
    CheckboxComponent,
    CheckboxButtonComponent,
    FormFieldComponent,
    FlatButtonDirective,
    TextareaResizerDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-starter-kit';

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: Object) {
    Platform.setPlatformId(this._platformId);
  }
}
