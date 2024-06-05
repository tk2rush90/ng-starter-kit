export class MarkdownTextArea {
  constructor(public readonly textarea: HTMLTextAreaElement) {}

  get isRanged(): boolean {
    return this.selectionStart < this.selectionEnd;
  }

  get selectionStart(): number {
    return this.textarea.selectionStart;
  }

  get selectionEnd(): number {
    return this.textarea.selectionEnd;
  }

  get selectionBeforeText(): string {
    return this.textarea.value.substring(0, this.selectionStart);
  }

  get selectionText(): string {
    return this.textarea.value.substring(
      this.selectionStart,
      this.selectionEnd,
    );
  }

  get selectionAfterText(): string {
    return this.textarea.value.substring(this.selectionEnd);
  }

  get isMultiLineSelected(): boolean {
    return this.selectionStartLineIndex < this.selectionEndLineIndex;
  }

  get selectionStartLineIndex(): number {
    return this.selectionBeforeText.split('\n').length - 1;
  }

  get selectionEndLineIndex(): number {
    return (
      (this.selectionBeforeText + this.selectionText).split('\n').length - 1
    );
  }

  get selectionStartLine(): string {
    return this.getEditableLines()[this.selectionStartLineIndex] || '';
  }

  get selectionEndLine(): string {
    return this.getEditableLines()[this.selectionEndLineIndex] || '';
  }

  getEditableLines(): string[] {
    return this.textarea.value.split('\n');
  }

  /**
   * Toggle bold style to content of `textarea`.
   * When selection is between 2 `**`, it removes bold style.
   * If not, it applies bold style to selection by adding `**` aside of the selection.
   */
  toggleBold(): void {
    this._toggleWrapper('**');
  }

  /**
   * Toggle italic style to content of `textarea`.
   * When selection is between 2 `_`, it removes italic style.
   * If not, it applies italic style to selection by adding `_` aside of the selection.
   */
  toggleItalic(): void {
    this._toggleWrapper('_');
  }

  /**
   * Toggle strike style to content of `textarea`.
   * When selection is between 2 `~~`, it removes strike style.
   * If not, it applies strike style to selection by adding `~~` aside of the selection.
   */
  toggleStrike(): void {
    this._toggleWrapper('~~');
  }

  /**
   * Toggle code style to content of `textarea`.
   * When selection is between 2 `\``, it removes code style.
   * If not, it applies code style to selection by adding `~~` aside of the selection.
   */
  toggleCode(): void {
    this._toggleWrapper('`');
  }

  private _toggleWrapper(wrapper: string): void {
    if (this.isWrappedWithCharacters(wrapper)) {
      this.unwrapCharacters(wrapper.length);
    } else {
      this.wrapWithCharacters(wrapper);
    }
  }

  /**
   * Get status of whether selection is wrapped with `characters` or not.
   * @param characters - Characters to check.
   * @return When selection is wrapped with `characters`, return `true`.
   */
  isWrappedWithCharacters(characters: string): boolean {
    // Return status of whether wrapped with `characters` or not.
    return (
      this.selectionBeforeText.endsWith(characters) &&
      this.selectionAfterText.startsWith(characters)
    );
  }

  /**
   * Wrap selection with `characters`.
   * @param characters - Characters to add before and after selection.
   */
  wrapWithCharacters(characters: string): void;

  /**
   * Wrap selection with `startCharacter` and `endCharacter`.
   * @param startCharacter - Character to add before selection.
   * @param endCharacter - Character to add after selection.
   */
  wrapWithCharacters(startCharacter: string, endCharacter: string): void;

  wrapWithCharacters(startCharacter: string, endCharacter?: string): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Update value.
    this.textarea.value = `${this.selectionBeforeText}${startCharacter}${this.selectionText}${endCharacter || startCharacter}${this.selectionAfterText}`;

    // Update selection positions.
    this.updateSelection(
      selectionStart + startCharacter.length,
      selectionEnd + (endCharacter || startCharacter).length,
    );
  }

  /**
   * Unwrap characters by length from the selection.
   * @param length - Length of characters to unwrap.
   */
  unwrapCharacters(length: number): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Update value.
    this.textarea.value = `${this.selectionBeforeText.substring(0, this.selectionBeforeText.length - length)}${this.selectionText}${this.selectionAfterText.substring(length)}`;

    // Update selection positions.
    this.updateSelection(selectionStart - length, selectionEnd - length);
  }

  /** Indent lines */
  indent(): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Get editable lines.
    const lines = this.getEditableLines();

    // Slice selected lines.
    const slicedLines = lines.slice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex + 1,
    );

    // Indent lines. Use 4 spaces for indentation.
    const indentedLines = slicedLines.map((_line) => {
      return `    ${_line}`;
    });

    // Replace lines.
    lines.splice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex - this.selectionStartLineIndex + 1,
      ...indentedLines,
    );

    // Update value.
    this.textarea.value = lines.join('\n');

    // Update selection.
    this.updateSelection(
      selectionStart + 4,
      selectionEnd + 4 * slicedLines.length,
    );
  }

  /** Outdent lines */
  outdent(): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Get editable lines.
    const lines = this.getEditableLines();

    // Slice selected lines.
    const slicedLines = lines.slice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex + 1,
    );

    // Removable spaces in first line.
    const spacesCanBeRemovedInFirstLine =
      slicedLines[0]?.match(/^\s{0,4}/)?.[0].length || 0;

    // Removable spaces for entire lines.
    let spacesCanBeRemovedForAllLines = 0;

    // Indent lines. Use 2 spaces for indentation.
    const indentedLines = slicedLines.map((_line) => {
      // Calculate removable spaces for all lines to update `selectionEnd`.
      spacesCanBeRemovedForAllLines += _line.match(/^\s{0,4}/)?.[0].length || 0;

      return _line.replace(/^\s{0,4}/, '');
    });

    // Replace lines.
    lines.splice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex - this.selectionStartLineIndex + 1,
      ...indentedLines,
    );

    // Update value.
    this.textarea.value = lines.join('\n');

    // Update selection.
    this.updateSelection(
      selectionStart - spacesCanBeRemovedInFirstLine,
      selectionEnd - spacesCanBeRemovedForAllLines,
    );
  }

  /**
   * Insert `characters` after the selection.
   * @param characters - Characters to insert.
   */
  insertCharacters(characters: string): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Insert characters.
    this.textarea.value = `${this.selectionBeforeText}${characters}${this.selectionAfterText}`;

    // Update selection.
    this.updateSelection(
      selectionStart + characters.length,
      selectionEnd + characters.length,
    );
  }

  /**
   * Insert a heading block to textarea.
   * @param level - Heading level from 1 to 6.
   */
  insertHeading(level: number): void {
    // Create heading prefix.
    const prefix = ''.padStart(level, '#');

    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Get editable lines.
    const lines = this.getEditableLines();

    // Get existing prefix.
    const existingPrefix = this.selectionStartLine.match(/^#{1,6} /)?.[0] || '';

    // Check whether previous prefix exists or not.
    const hasPrefix = existingPrefix.length > 0;

    // Replace line.
    lines.splice(
      this.selectionStartLineIndex,
      1,
      hasPrefix
        ? this.selectionStartLine.replace(/^#{1,6} /, `${prefix} `)
        : `${prefix} ${this.selectionStartLine}`,
    );

    // Get heading characters included in selected text.
    const selectedHeading = this.selectionText.match(/^#{1,6}/)?.[0] || '';

    // When having selected heading, set adjust selection start position with heading length and space.
    const selectedHeadingAdjust =
      selectedHeading.length > 0 ? selectedHeading.length + 1 : 0;

    // Update value
    this.textarea.value = lines.join('\n');

    // Update selection.
    this.updateSelection(
      hasPrefix
        ? selectionStart +
            (prefix.length - existingPrefix.length) +
            1 + // Space.
            selectedHeadingAdjust
        : selectionStart + prefix.length + 1,
      hasPrefix
        ? selectionEnd + (prefix.length - existingPrefix.length) + 1
        : selectionEnd + prefix.length + 1,
    );
  }

  /**
   * Insert list block by type.
   * @param type - List type to insert.
   */
  insertList(type: 'ordered' | 'unordered'): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Get editable lines.
    const lines = this.getEditableLines();

    // Slice selected lines.
    const slicedLines = lines.slice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex + 1,
    );

    const prefix = type === 'ordered' ? '1. ' : '- ';

    lines.splice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex - this.selectionStartLineIndex + 1,
      ...slicedLines.map((_line) => {
        return `${prefix}${_line}`;
      }),
    );

    // Update value.
    this.textarea.value = lines.join('\n');

    // Update selection.
    this.updateSelection(
      selectionStart + prefix.length,
      selectionEnd + prefix.length * slicedLines.length,
    );
  }

  /** Toggle quote block */
  toggleQuote(): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;

    // Get editable lines.
    const lines = this.getEditableLines();

    // Slice selected lines.
    const slicedLines = lines.slice(
      this.selectionStartLineIndex,
      this.selectionEndLineIndex + 1,
    );

    // Get first line.
    const firstLine = slicedLines[0];

    // Get the prefix of first line.
    const previousPrefixOfFirstLine = firstLine.match(/^>+ /)?.[0] || '';

    if (previousPrefixOfFirstLine.length > 0) {
      // Remove quote.
      let removedPrefixLength = 0;

      const newLines = slicedLines.map((_line) => {
        const previousPrefixOfLine = _line.match(/^>+ /)?.[0] || '';

        // When has prefix, they should be removed.
        if (previousPrefixOfLine.length > 0) {
          removedPrefixLength += previousPrefixOfLine.length;
        }

        return _line.replace(/^>+ /, '');
      });

      // Replace line.
      lines.splice(
        this.selectionStartLineIndex,
        this.selectionEndLineIndex - this.selectionStartLineIndex + 1,
        ...newLines,
      );

      // Update value.
      this.textarea.value = lines.join('\n');

      this.updateSelection(
        selectionStart - previousPrefixOfFirstLine.length,
        selectionEnd - removedPrefixLength,
      );
    } else {
      // Add quote.
      let addedPrefixLength = 0;

      const prefix = '> ';

      const newLines = slicedLines.map((_line) => {
        const previousPrefixOfLine = _line.match(/^>+ /)?.[0] || '';

        // When no prefix, prefix should be added.
        if (previousPrefixOfLine.length === 0) {
          addedPrefixLength += prefix.length;

          return `${prefix}${_line}`;
        } else {
          return _line;
        }
      });

      // Replace line.
      lines.splice(
        this.selectionStartLineIndex,
        this.selectionEndLineIndex - this.selectionStartLineIndex + 1,
        ...newLines,
      );

      // Update value.
      this.textarea.value = lines.join('\n');

      this.updateSelection(
        selectionStart + prefix.length,
        selectionEnd + addedPrefixLength,
      );
    }
  }

  /** Insert a new line by keeping prefixes */
  insertNewLine(): void {
    // Keep previous selection.
    const selectionStart = this.selectionStart;

    // Get prefix to be kept.
    const prefix =
      this.selectionStartLine.match(/^\s*- |^\s*\d+\. |^\s*>+ /)?.[0] || '';

    // Get editable lines.
    const lines = this.getEditableLines();

    // To check whether cursor is on the end of the line or not.
    const selectionBeforeLinesLength = lines
      .slice(0, this.selectionStartLineIndex)
      .join('\n').length;

    if (
      // When line content is empty, remove prefix.
      this.selectionStartLine.replace(prefix, '').trim().length === 0 &&
      // When cursor is on the end of the line.
      // If `selectionBeforeLinesLength` is not 0, then it has `\n` between selection start line and before line.
      // So, add 1.
      selectionStart ===
        selectionBeforeLinesLength +
          prefix.length +
          (selectionBeforeLinesLength ? 1 : 0) &&
      !this.isRanged
    ) {
      // Replace line.
      lines.splice(this.selectionStartLineIndex, 1, '');

      // Update value.
      this.textarea.value = lines.join('\n');

      // Update selection.
      this.updateSelection(
        selectionStart - prefix.length,
        selectionStart - prefix.length,
      );
    } else {
      // Update value.
      this.textarea.value = `${this.selectionBeforeText}\n${prefix}${this.selectionAfterText}`;

      // Update selection.
      this.updateSelection(
        selectionStart + 1 + prefix.length,
        selectionStart + 1 + prefix.length,
      );
    }
  }

  /** Delete selected lines */
  deleteLine(): void {
    // Get editable lines.
    const lines = this.getEditableLines();

    // Get before lines.
    const beforeLines = lines.slice(0, this.selectionStartLineIndex).join('\n');

    // Calculate selection position for updated content.
    const selection =
      beforeLines.length === 0 ? beforeLines.length : beforeLines.length + 1;

    // Remove line.
    lines.splice(this.selectionStartLineIndex, 1);

    // Update value.
    this.textarea.value = lines.join('\n');

    // Update selection.
    this.updateSelection(selection, selection);
  }

  /**
   * Update selection. It dispatches InputEvent to trigger change.
   * @param selectionStart - Selection start.
   * @param selectionEnd - Selection end.
   */
  updateSelection(selectionStart: number, selectionEnd: number): void {
    this.textarea.selectionStart = selectionStart;
    this.textarea.selectionEnd = selectionEnd;

    this.dispatchInputEvent();
  }

  /** Dispatch input event to trigger `valueChanges` of NgControl */
  dispatchInputEvent(): void {
    this.textarea.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true }),
    );
  }
}
