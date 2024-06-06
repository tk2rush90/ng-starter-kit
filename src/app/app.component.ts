import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Platform } from './utils/platform';
import { MarkdownEditorComponent } from './components/common/markdown-editor/markdown-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MarkdownEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-starter-kit';

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: Object) {
    Platform.setPlatformId(this._platformId);
  }
}
