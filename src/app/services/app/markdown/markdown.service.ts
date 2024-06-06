import { Injectable } from '@angular/core';
import MarkdownIt from 'markdown-it';
import { Logger } from '../../../utils/logger';

/** Custom plugin for markdown to render anchor element with `target="_blank"`*/
function addTargetBlank(md: MarkdownIt): void {
  const defaultRender =
    md.renderer.rules['link_open'] ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules['link_open'] = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');

    if (hrefIndex >= 0) {
      token.attrPush(['target', '_blank']);
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

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

  constructor() {
    this._markdown.use(addTargetBlank);
  }

  /**
   * Render markdown as HTML string.
   * @param markdown - Markdown content.
   * @return HTML string.
   */
  render(markdown: string): string {
    return this._markdown.render(markdown);
  }
}
