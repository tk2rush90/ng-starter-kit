import { isDevMode } from '@angular/core';

/** A class to create log in console only for DevMode */
export class Logger {
  constructor(private readonly _context: string) {}

  /**
   * Wrapper method of `console.log()`.
   * @param data - Any data.
   */
  log(...data: any): void {
    if (isDevMode()) {
      this._startGroup();
      console.log(...data);
      this._endGroup();
    }
  }

  /**
   * Wrapper method of `console.info()`.
   * @param data - Any data.
   */
  info(...data: any): void {
    if (isDevMode()) {
      this._startGroup();
      console.info(...data);
      this._endGroup();
    }
  }

  /**
   * Wrapper method of `console.debug()`.
   * @param data - Any data.
   */
  debug(...data: any): void {
    if (isDevMode()) {
      this._startGroup();
      console.debug(...data);
      this._endGroup();
    }
  }

  /**
   * Wrapper method of `console.warn()`.
   * @param data - Any data.
   */
  warn(...data: any): void {
    if (isDevMode()) {
      this._startGroup();
      console.warn(...data);
      this._endGroup();
    }
  }

  /**
   * Wrapper method of `console.error()`.
   * @param data - Any data.
   */
  error(...data: any): void {
    if (isDevMode()) {
      this._startGroup();
      console.error(...data);
      this._endGroup();
    }
  }

  /** Start log grouping. It starts group when `_context` is set */
  private _startGroup(): void {
    if (this._context) {
      console.group(this._context);
    }
  }

  /** End log grouping. It ends group when `_context` is set */
  private _endGroup(): void {
    if (this._context) {
      console.groupEnd();
    }
  }
}
