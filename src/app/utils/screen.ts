import { Platform } from './platform';

/** Class that contains features related with screen size */
export class Screen {
  /** Get min height of window. From the mobile, it reduces the address bar */
  static get minHeight(): string {
    return Platform.isBrowser ? window.innerHeight + 'px' : '';
  }
}
