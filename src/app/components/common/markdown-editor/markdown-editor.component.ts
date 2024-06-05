import { Component, ViewChild } from '@angular/core';
import { MarkdownTextareaDirective } from '../markdown-textarea/markdown-textarea.directive';
import { IconFormatH1Component } from '../../icons/icon-format-h1/icon-format-h1.component';
import { IconFormatH2Component } from '../../icons/icon-format-h2/icon-format-h2.component';
import { IconFormatH3Component } from '../../icons/icon-format-h3/icon-format-h3.component';
import { IconFormatListBulletedComponent } from '../../icons/icon-format-list-bulleted/icon-format-list-bulleted.component';
import { IconFormatListNumberedComponent } from '../../icons/icon-format-list-numbered/icon-format-list-numbered.component';
import { IconFormatQuoteComponent } from '../../icons/icon-format-quote/icon-format-quote.component';

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
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
  host: {
    class: 'flex-col-stretch',
  },
})
export class MarkdownEditorComponent {
  /** Markdown textarea */
  @ViewChild(MarkdownTextareaDirective)
  markdownTextareaDirective?: MarkdownTextareaDirective;

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
}
