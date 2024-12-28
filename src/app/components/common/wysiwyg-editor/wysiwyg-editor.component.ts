import { AfterViewInit, Component, DestroyRef, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { ProseMirrorService } from '../../../services/app/prose-mirror/prose-mirror.service';
import { Platform } from '../../../utils/platform';
import { IconBoldComponent } from '../../icons/icon-bold/icon-bold.component';
import { IconItalicComponent } from '../../icons/icon-italic/icon-italic.component';
import { IconUnderlineComponent } from '../../icons/icon-underline/icon-underline.component';
import { IconStrikeThroughComponent } from '../../icons/icon-strike-through/icon-strike-through.component';
import { IconTextComponent } from '../../icons/icon-text/icon-text.component';
import { IconTextQuoteComponent } from '../../icons/icon-text-quote/icon-text-quote.component';
import { IconHeading1Component } from '../../icons/icon-heading-1/icon-heading-1.component';
import { IconHeading2Component } from '../../icons/icon-heading-2/icon-heading-2.component';
import { IconHeading3Component } from '../../icons/icon-heading-3/icon-heading-3.component';
import { WysiwygEditorButtonComponent } from '../wysiwyg-editor-button/wysiwyg-editor-button.component';
import { IconBracesComponent } from '../../icons/icon-braces/icon-braces.component';
import { IconCodeComponent } from '../../icons/icon-code/icon-code.component';
import { IconYoutubeComponent } from '../../icons/icon-youtube/icon-youtube.component';
import { IconImageComponent } from '../../icons/icon-image/icon-image.component';
import { FileUploaderDirective } from '../file-uploader/file-uploader.directive';
import { ToastService } from '../../../services/app/toast/toast.service';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { ModalComponent } from '../modal/modal.component';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { WysiwygYoutubeEmbedComponent } from '../wysiwyg-youtube-embed/wysiwyg-youtube-embed.component';

@Component({
    selector: 'app-wysiwyg-editor',
    imports: [
        IconBoldComponent,
        IconItalicComponent,
        IconUnderlineComponent,
        IconStrikeThroughComponent,
        IconTextComponent,
        IconTextQuoteComponent,
        IconHeading1Component,
        IconHeading2Component,
        IconHeading3Component,
        WysiwygEditorButtonComponent,
        IconBracesComponent,
        IconCodeComponent,
        IconYoutubeComponent,
        IconImageComponent,
        FileUploaderDirective,
        BackdropComponent,
        ModalComponent,
        WysiwygYoutubeEmbedComponent,
    ],
    templateUrl: './wysiwyg-editor.component.html',
    styleUrl: './wysiwyg-editor.component.scss',
    host: {
        class: 'flex-col-stretch',
    }
})
export class WysiwygEditorComponent implements AfterViewInit {
  @Input() placeholder = '';

  @Input() viewMode: 'dark' | 'light' = 'light';

  @ViewChild('editorContainer') editorContainerElementRef?: ElementRef<HTMLElement>;

  @ViewChild('wysiwygYoutubeEmbed') wysiwygYoutubeEmbedTemplateRef?: TemplateRef<any>;

  constructor(
    private readonly _destroyRef: DestroyRef,
    private readonly _toastService: ToastService,
    private readonly _overlayService: OverlayService,
    private readonly _proseMirrorService: ProseMirrorService,
  ) {}

  get isDarkMode(): boolean {
    return this.viewMode === 'dark';
  }

  ngAfterViewInit() {
    if (Platform.isBrowser && this.editorContainerElementRef) {
      this._proseMirrorService.createView(this.editorContainerElementRef.nativeElement);
    }
  }

  toggleHeading(level: number): void {
    this._proseMirrorService.toggleHeading(level);
  }

  toggleParagraph(): void {
    this._proseMirrorService.toggleParagraph();
  }

  insertBlockQuote(): void {
    const view = this._proseMirrorService.view;

    if (view) {
      this._proseMirrorService.insertBlockQuote(view.state, view.dispatch, view);
    }
  }

  toggleBold(): void {
    const view = this._proseMirrorService.view;

    if (view) {
      this._proseMirrorService.toggleBold(view.state, view.dispatch, view);
    }
  }

  toggleItalic(): void {
    const view = this._proseMirrorService.view;

    if (view) {
      this._proseMirrorService.toggleItalic(view.state, view.dispatch, view);
    }
  }

  toggleUnderline(): void {
    const view = this._proseMirrorService.view;

    if (view) {
      this._proseMirrorService.toggleUnderline(view.state, view.dispatch, view);
    }
  }

  toggleLineThrough(): void {
    const view = this._proseMirrorService.view;

    if (view) {
      this._proseMirrorService.toggleLineThrough(view.state, view.dispatch, view);
    }
  }

  setCodeBlock(): void {
    this._proseMirrorService.setCodeBlock();
  }

  toggleCode(): void {
    const view = this._proseMirrorService.view;

    if (view) {
      this._proseMirrorService.toggleCode(view.state, view.dispatch, view);
    }
  }

  insertImageFiles(files: File[]): void {
    const view = this._proseMirrorService.view;

    if (view) {
      files.forEach((_file, index) => {
        this._proseMirrorService.insertImageFile(view, _file);
      });
    }
  }

  openInvalidFilesError(numberOfFiles: number): void {
    this._toastService.open(`${numberOfFiles} 개의 허용되지 않는 파일이 무시되었습니다`);
  }

  openWysiwygYoutubeEmbed(): void {
    if (this.wysiwygYoutubeEmbedTemplateRef) {
      this._overlayService.open(this.wysiwygYoutubeEmbedTemplateRef, {
        destroyRef: this._destroyRef,
      });
    }
  }

  insertYoutubeEmbed(url: string): void {
    this._proseMirrorService.insertYoutubeEmbed(url);
  }

  getJson(): any | undefined {
    return this._proseMirrorService.getJson();
  }
}
