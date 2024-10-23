import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * A directive that handles file uploading for file input.
 * Explicit `accept` attribute is required without wildcard character.
 */
@Directive({
  selector: 'input[type="file"][appFileUploader]',
  standalone: true,
})
export class FileUploaderDirective {
  /** Emits when files are uploaded */
  @Output() uploaded = new EventEmitter<File[]>();

  /** Emits when some uploaded files have invalid mimetype */
  @Output() hasInvalidFiles = new EventEmitter<number>();

  constructor(private readonly _elementRef: ElementRef<HTMLInputElement>) {}

  /** Listen `change` event of host element to handle uploaded files */
  @HostListener('change')
  onHostChange(): void {
    // Get allowed mimetypes from `accept` attribute.
    const allowedMimetypes = this._elementRef.nativeElement.accept.split(',');

    // Array to contain accepted files.
    const acceptedFiles: File[] = [];

    if (this._elementRef.nativeElement.files) {
      let numberOfInvalidFiles = 0;

      for (let i = 0; i < this._elementRef.nativeElement.files.length; i++) {
        // Get file.
        const _file = this._elementRef.nativeElement.files[i];

        // Check type matched.
        const typeMatched = allowedMimetypes.some((_mimetype) => {
          if (_mimetype === '*/*') {
            return true;
          } else if (/.+\/*/.exec(_mimetype)) {
            const starts = _mimetype.split('/')[0];

            return _file.type.startsWith(starts);
          } else {
            return _mimetype === _file.type;
          }
        });

        if (typeMatched) {
          // Add `_file` to `acceptedFiles`.
          acceptedFiles.push(_file);
        } else {
          numberOfInvalidFiles++;
        }
      }

      this.uploaded.emit(acceptedFiles);

      if (numberOfInvalidFiles) {
        this.hasInvalidFiles.emit(numberOfInvalidFiles);
      }
    }

    // Reset value.
    this._elementRef.nativeElement.value = '';
  }
}
