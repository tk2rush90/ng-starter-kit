import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../utils/logger';

/** A snapshot data of textarea value for history */
export interface TextareaHistorySnapshot {
  /** Captured value */
  value: string;

  /** Captured selectionStart */
  selectionStart: number;

  /** Captured selectionEnd */
  selectionEnd: number;
}

/** A service that manages history of textarea changes programmatically */
@Injectable()
export class TextareaHistoryService implements OnDestroy {
  /** Textarea element to manage history */
  private _textarea!: HTMLTextAreaElement;

  /** Capture timeout timer */
  private _captureTimer: any;

  /** Index of current history */
  private _historyIndex = -1;

  /** Captured history snapshots */
  private _histories: TextareaHistorySnapshot[] = [];

  /** Maximum history snapshot amount */
  private readonly _maxHistoriesLength = 300;

  /** Timeout delay to capture history */
  private readonly _historyCaptureTimeout = 100;

  /** Logger */
  private readonly _logger = new Logger('TextareaHistoryService');

  /** Get total length of histories */
  get historiesLength(): number {
    return this._histories.length;
  }

  /** Get the last index of histories */
  get historiesLastIndex(): number {
    return this.historiesLength - 1;
  }

  ngOnDestroy() {
    this.unregister();
  }

  /**
   * Register a textarea to
   * @param textarea
   */
  register(textarea: HTMLTextAreaElement): void {
    if (this._textarea) {
      this._logger.warn('Textarea is already set to manage histories');
    } else {
      this._textarea = textarea;

      // Capture current state on register.
      this.captureState();

      // Add keydown event listener.
      this._textarea.addEventListener('keydown', this._keydownListener);
    }
  }

  /**
   * Keydown event listener to detect undo and redo commands.
   * @param event - Keyboard event.
   */
  private readonly _keydownListener = (event: KeyboardEvent) => {
    const commandKey = Platform.isApple ? event.metaKey : event.ctrlKey;

    if (
      (commandKey && event.key.toLowerCase() === 'y') ||
      (commandKey && event.shiftKey && event.key.toLowerCase() === 'z')
    ) {
      // Redo.
      event.preventDefault();

      this.redo();
    } else if (commandKey && event.key.toLowerCase() === 'z') {
      // Undo.
      event.preventDefault();

      this.undo();
    } else {
      // Capture changes.
      clearTimeout(this._captureTimer);

      this._captureTimer = setTimeout(() => {
        this.captureState();
      }, this._historyCaptureTimeout);
    }
  };

  /** Capture snapshot of current status */
  captureState(): void {
    const currentHistory = this._histories[this._historyIndex];

    // When data not changed, return.
    if (
      currentHistory?.value === this._textarea.value &&
      currentHistory?.selectionStart === this._textarea.selectionStart &&
      currentHistory?.selectionEnd === this._textarea.selectionEnd
    ) {
      this._logger.log('Data not changed. Ignore capture');

      return;
    }

    // Delete after current index.
    this._histories = this._histories.slice(0, this._historyIndex + 1);

    // Push history data.
    this._histories.push({
      value: this._textarea.value,
      selectionStart: this._textarea.selectionStart,
      selectionEnd: this._textarea.selectionEnd,
    });

    // Cut old data.
    if (this.historiesLength > this._maxHistoriesLength) {
      this._histories = this._histories.slice(
        this.historiesLength - this._maxHistoriesLength,
      );
    }

    // Cursor on the last index.
    this._historyIndex = this.historiesLastIndex;

    this._logger.debug(
      'Captured state',
      this._histories[this.historiesLastIndex],
    );

    this._logger.debug('Index after captured', this._historyIndex);
  }

  /** Undo to previous history */
  undo(): void {
    this._logger.log('Undo');

    if (this._historyIndex > 0) {
      this._historyIndex--;
      this.applyHistoryData();

      this.dispatchInputEvent();
    }
  }

  /** Redo to next history */
  redo(): void {
    this._logger.log('Redo');

    if (this._historyIndex < this.historiesLastIndex) {
      this._historyIndex++;
      this.applyHistoryData();

      this.dispatchInputEvent();
    }
  }

  /** Apply history data to textarea by current history index */
  applyHistoryData(): void {
    const historyData = this._histories[this._historyIndex];

    if (historyData) {
      this._textarea.value = historyData.value;
      this._textarea.selectionStart = historyData.selectionStart;
      this._textarea.selectionEnd = historyData.selectionEnd;
    }
  }

  /** Unregister textarea and event listener for keydown */
  unregister(): void {
    this._textarea.removeEventListener('keydown', this._keydownListener);

    // Delete registered textarea.
    this._textarea = undefined as any;
  }

  /** Dispatch input event to trigger `valueChanges` of NgControl */
  dispatchInputEvent(): void {
    this._textarea.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true }),
    );
  }
}
