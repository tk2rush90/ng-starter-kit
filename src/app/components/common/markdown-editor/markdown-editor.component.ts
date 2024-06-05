import { Component, ViewChild } from '@angular/core';
import { MarkdownTextareaDirective } from '../markdown-textarea/markdown-textarea.directive';
import { IconFormatH1Component } from '../../icons/icon-format-h1/icon-format-h1.component';
import { IconFormatH2Component } from '../../icons/icon-format-h2/icon-format-h2.component';
import { IconFormatH3Component } from '../../icons/icon-format-h3/icon-format-h3.component';
import { IconFormatListBulletedComponent } from '../../icons/icon-format-list-bulleted/icon-format-list-bulleted.component';
import { IconFormatListNumberedComponent } from '../../icons/icon-format-list-numbered/icon-format-list-numbered.component';
import { IconFormatQuoteComponent } from '../../icons/icon-format-quote/icon-format-quote.component';
import { MarkdownEditorViewType } from '../../../types/markdown-editor-view-type';
import { TextareaResizerDirective } from '../textarea-resizer/textarea-resizer.directive';
import { MarkdownService } from '../../../services/app/markdown/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { NgTemplateOutlet } from '@angular/common';
import { IconPhotoComponent } from '../../icons/icon-photo/icon-photo.component';
import { FileUploaderDirective } from '../file-uploader/file-uploader.directive';
import { Logger } from '../../../utils/logger';
import { SelectionChangeDetectorDirective } from '../selection-change-detector/selection-change-detector.directive';
import { IconLinkComponent } from '../../icons/icon-link/icon-link.component';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [
    MarkdownTextareaDirective,
    IconFormatH1Component,
    IconFormatH2Component,
    IconFormatH3Component,
    IconFormatListBulletedComponent,
    IconFormatListNumberedComponent,
    IconFormatQuoteComponent,
    TextareaResizerDirective,
    NgTemplateOutlet,
    IconPhotoComponent,
    FileUploaderDirective,
    SelectionChangeDetectorDirective,
    IconLinkComponent,
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
  host: {
    class: 'flex-col-stretch gap-2',
  },
})
export class MarkdownEditorComponent {
  /** Markdown textarea */
  @ViewChild(MarkdownTextareaDirective)
  markdownTextareaDirective?: MarkdownTextareaDirective;

  /** View type of markdown editor */
  viewType: MarkdownEditorViewType = 'mirror';

  /** Raw content */
  content = '';

  /** Logger */
  private readonly _logger = new Logger('MarkdownEditorComponent');

  constructor(private readonly _markdownService: MarkdownService) {}

  /** Get content as rendered */
  get renderedContent(): SafeHtml {
    return this._markdownService.render(this.content);
  }

  /**
   * Insert a heading.
   * @param level - Heading level from 1 to 6.
   */
  insertHeading(level: number): void {
    this.markdownTextareaDirective?.markdownTextarea.insertHeading(level);
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /**
   * Insert list block by type.
   * @param type - List type to insert.
   */
  insertList(type: 'ordered' | 'unordered'): void {
    this.markdownTextareaDirective?.markdownTextarea.insertList(type);
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Toggle quote block */
  toggleQuote(): void {
    this.markdownTextareaDirective?.markdownTextarea.toggleQuote();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /** Insert a link */
  insertLink(): void {
    this.markdownTextareaDirective?.markdownTextarea.insertLink();
    this.markdownTextareaDirective?.textareaHistoryService.captureState();
  }

  /**
   * Change the view type of editor.
   * @param type - View type.
   */
  changeViewType(type: MarkdownEditorViewType): void {
    this.viewType = type;
  }

  /**
   * Update content.
   * @param event - Event.
   */
  updateContent(event: Event): void {
    this.content = (event.target as HTMLTextAreaElement).value;
  }

  /**
   * Handle uploaded files.
   * @param files - Uploaded files.
   */
  onFileUploaded(files: File[]): void {
    files.forEach((_file) => {
      // Create object url.
      const objectUrl = URL.createObjectURL(_file);

      this.markdownTextareaDirective?.markdownTextarea.insertImage(objectUrl);
      this.markdownTextareaDirective?.textareaHistoryService.captureState();
    });
  }

  /** Handle when invalid file type included */
  onInvalidFileType(): void {
    throw new Error('invalidFileType not implemented');
  }

  onTextareaSelectionChange(): void {
    if (this.markdownTextareaDirective) {
      const linesLength =
        this.markdownTextareaDirective.markdownTextarea.getEditableLines()
          .length;
      const selectionStartLineIndex =
        this.markdownTextareaDirective.markdownTextarea.selectionStartLineIndex;

      this._logger.log('Total line length: ' + linesLength);
      this._logger.log(
        'Selection start line index: ' + selectionStartLineIndex,
      );
    }
  }
}
