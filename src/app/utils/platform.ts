import UAParser, { IBrowser, IOS } from 'ua-parser-js';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

/** A class to detect about platform specification */
export class Platform {
  /** User agent parser */
  private static readonly _parser = new UAParser();

  /** Platform id */
  private static _platformId: Object;

  /** Set platform id */
  static setPlatformId(platformId: Object): void {
    this._platformId = platformId;
  }

  /**
   * Get status whether platform is browser or not.
   * @return Boolean status.
   */
  static get isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }

  /**
   * Get status whether platform is server or not.
   * @return Boolean status.
   */
  static get isServer(): boolean {
    return isPlatformServer(this._platformId);
  }

  /**
   * Get OS information from UA.
   * @return OS information.
   */
  static get os(): IOS {
    return this._parser.getOS();
  }

  /**
   * Get browser information from UA.
   * @return Browser information.
   */
  static get browser(): IBrowser {
    return this._parser.getBrowser();
  }
}
