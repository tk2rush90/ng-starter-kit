import { Component } from '@angular/core';
import { RadioGroupComponent } from './components/common/radio-group/radio-group.component';
import { RadioComponent } from './components/common/radio-group/radio/radio.component';
import { RadioButtonComponent } from './components/common/radio-group/radio/radio-button/radio-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RadioGroupComponent, RadioComponent, RadioButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-starter-kit';
}
