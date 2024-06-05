import {
  Component,
  Inject,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RadioGroupComponent } from './components/common/radio-group/radio-group.component';
import { RadioComponent } from './components/common/radio-group/radio/radio.component';
import { RadioButtonComponent } from './components/common/radio-group/radio/radio-button/radio-button.component';
import { CheckboxComponent } from './components/common/checkbox/checkbox.component';
import { CheckboxButtonComponent } from './components/common/checkbox/checkbox-button/checkbox-button.component';
import { FormFieldComponent } from './components/common/form-field/form-field.component';
import { Platform } from './utils/platform';
import { FlatButtonDirective } from './components/common/flat-button/flat-button.directive';
import { TextareaResizerDirective } from './components/common/textarea-resizer/textarea-resizer.directive';
import { StrokeButtonDirective } from './components/common/stroke-button/stroke-button.directive';
import { SpinnerComponent } from './components/common/spinner/spinner.component';
import { OverlayService } from './services/app/overlay/overlay.service';
import { BackdropComponent } from './components/common/backdrop/backdrop.component';
import { ModalComponent } from './components/common/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { MarkdownService } from './services/app/markdown/markdown.service';
import { MarkdownTextareaDirective } from './components/common/markdown-textarea/markdown-textarea.directive';
import { MarkdownEditorComponent } from './components/common/markdown-editor/markdown-editor.component';

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
    StrokeButtonDirective,
    SpinnerComponent,
    BackdropComponent,
    ModalComponent,
    FormsModule,
    MarkdownTextareaDirective,
    MarkdownEditorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('testModal', { read: TemplateRef })
  testModalTemplateRef?: TemplateRef<any>;

  title = 'ng-starter-kit';

  content = '';

  renderedContent = '';

  constructor(
    @Inject(PLATFORM_ID) private readonly _platformId: Object,
    private readonly _overlayService: OverlayService,
    private readonly _markdownService: MarkdownService,
  ) {
    Platform.setPlatformId(this._platformId);
  }

  openOverlay(): void {
    if (this.testModalTemplateRef) {
      this._overlayService.open(this.testModalTemplateRef);
    }
  }
}
