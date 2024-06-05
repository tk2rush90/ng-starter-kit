import { Injectable } from '@angular/core';
import MarkdownIt from 'markdown-it';
import { Logger } from '../../../utils/logger';

/** A service for markdown-it https://www.npmjs.com/package/markdown-it */
@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  /** Markdown instance */
  private readonly _markdown = MarkdownIt({
    breaks: true,
    linkify: true,
  });

  /** Logger */
  private readonly _logger = new Logger('MarkdownService');

  /**
   * Render markdown as HTML string.
   * @param markdown - Markdown content.
   * @return HTML string.
   */
  render(markdown: string): string {
    return this._markdown.render(markdown);
  }
}
