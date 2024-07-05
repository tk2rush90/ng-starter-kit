import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

/**
 * Available values for robots meta tag.
 * - `all`: Equivalent to `index follow`.
 * - `index`: Page can be indexed and displayed to search result.
 * - `follow`: Follow the link in pages.
 * - `noindex`: Page cannot be displayed in search result.
 * - `nofollow`: Don't follow the link in pages.
 * - `none`: Equivalent to `noindex nofollow`.
 */
export type RobotsValue = 'all' | 'index' | 'follow' | 'noindex' | 'nofollow' | 'none';

/** Options to update SEO properties */
export interface SeoOptions {
  /** Page title */
  title?: string;

  /** Page description */
  description?: string;

  /** Array of keyword to apply for `keyword` */
  keywords?: string[];

  /** Canonical url to set */
  canonical?: string;

  /** Robots configuration for `robots` meta tag */
  robots?: RobotsValue[];

  /** Image url */
  imageUrl?: string;
}

/** A service for SEO */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly _meta: Meta,
    private readonly _title: Title,
  ) {}

  /**
   * Update meta tags and title for SEO.
   * @param options - The options that contains values to update.
   */
  update(options: SeoOptions): void {
    // Update title.
    if (options.title) {
      this._title.setTitle(options.title);

      this._addOrUpdateMeta('name="twitter:title"', {
        name: 'twitter:title',
        content: options.title,
      });

      this._addOrUpdateMeta('property="og:title"', {
        property: 'og:title',
        content: options.title,
      });
    }

    // Update description.
    if (options.description) {
      this._addOrUpdateMeta('name="description"', {
        name: 'description',
        content: options.description,
      });

      this._addOrUpdateMeta('name="twitter:description"', {
        name: 'twitter:description',
        content: options.description,
      });

      this._addOrUpdateMeta('property="og:description"', {
        property: 'og:description',
        content: options.description,
      });
    }

    // Update keywords.
    if (options.keywords && options.keywords.length > 0) {
      this._addOrUpdateMeta('name="keywords"', {
        name: 'keywords',
        content: options.keywords.join(','),
      });
    }

    // Update canonical.
    if (options.canonical) {
      // Get or create `link` tag.
      const link = this._document.querySelector('link[rel="canonical"]') || this._document.createElement('link');

      // Set required attributes.
      link.setAttribute('href', options.canonical);
      link.setAttribute('rel', 'canonical');

      // Append link to `head` tag.
      this._document.querySelector('head')?.appendChild(link);
    }

    // Update robots.
    if (options.robots) {
      this._addOrUpdateMeta('name="robots"', {
        name: 'robots',
        content: options.robots.join(' '),
      });
    }

    // Update image.
    if (options.imageUrl) {
      this._addOrUpdateMeta('name="twitter:image"', {
        name: 'twitter:image',
        content: options.imageUrl,
      });

      this._addOrUpdateMeta('property="og:image"', {
        property: 'og:image',
        content: options.imageUrl,
      });
    }
  }

  /**
   * Find meta tag with `selector` and create or update with `tag`.
   * @param selector - Selector to find an existing meta tag.
   * @param tag - Meta definition to create or update.
   */
  private _addOrUpdateMeta(selector: string, tag: MetaDefinition): void {
    const meta = this._meta.getTag(selector);

    if (meta) {
      this._meta.updateTag(tag, selector);
    } else {
      this._meta.addTag(tag);
    }
  }
}
