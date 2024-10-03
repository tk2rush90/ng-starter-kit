import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Platform } from './utils/platform';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-starter-kit';

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: Object) {
    Platform.setPlatformId(this._platformId);
  }
}
