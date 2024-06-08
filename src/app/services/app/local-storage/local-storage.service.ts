import { Injectable } from '@angular/core';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../utils/logger';

/** A service that manages `localStorage` */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /** Logger */
  private readonly _logger = new Logger('LocalStorageService');

  /**
   * Set `value` to `localStorage` by `key`.
   * @param key - A key for `value`.
   * @param value - Value to set.
   */
  set(key: string, value: string): void {
    if (Platform.isBrowser) {
      if (localStorage) {
        localStorage.setItem(key, value);
      } else {
        this._logger.error('LocalStorage not found');
      }
    }
  }

  /**
   * Get a value from `localStorage` by `key`.
   * @param key - Key to get value.
   * @return Value found by `key`. It there is no value, it returns empty string.
   */
  get(key: string): string {
    if (Platform.isBrowser) {
      if (localStorage) {
        return localStorage.getItem(key) || '';
      } else {
        this._logger.error('LocalStorage not found');
      }
    }

    return '';
  }

  /**
   * Remove a value from `localStorage` by `key`.
   * @param key - Key to remove value.
   */
  remove(key: string): void {
    if (Platform.isBrowser) {
      if (localStorage) {
        localStorage.removeItem(key);
      } else {
        this._logger.error('LocalStorage not found');
      }
    }
  }
}
