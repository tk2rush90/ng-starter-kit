import { Component } from '@angular/core';
import { RadioGroupComponent } from './components/common/radio-group/radio-group.component';
import { RadioComponent } from './components/common/radio-group/radio/radio.component';
import { RadioButtonComponent } from './components/common/radio-group/radio/radio-button/radio-button.component';
import { CheckboxComponent } from './components/common/checkbox/checkbox.component';
import { CheckboxButtonComponent } from './components/common/checkbox/checkbox-button/checkbox-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RadioGroupComponent,
    RadioComponent,
    RadioButtonComponent,
    CheckboxComponent,
    CheckboxButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-starter-kit';
}
