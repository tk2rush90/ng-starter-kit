import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Platform } from './utils/platform';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-starter-kit';

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: Object) {
    Platform.setPlatformId(this._platformId);
  }
}
