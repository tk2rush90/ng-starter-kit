import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Enhanced validator functions */
export class AppValidators {
  /** When value contains space character, it binds space error */
  static noSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if ((control.value as string).search(/\s/g) !== -1) {
        return {
          space: true,
        };
      }
    }

    return null;
  }

  /** When value contains incomplete Korean character, it binds incomplete error */
  static noIncompleteCharacter(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if ((control.value as string).search(/[ㄱ-ㅎㅏ-ㅣ]/g) !== -1) {
        return {
          incomplete: true,
        };
      }
    }

    return null;
  }

  /** When value contains special characters, it binds specialCharacter error */
  static noSpecialCharacter(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if (control.value.search(/[^가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ ]/g) !== -1) {
        return {
          specialCharacter: true,
        };
      }
    }

    return null;
  }

  /** Better email validator */
  static email(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/[Symbol.match](control.value)) {
        return {
          email: true,
        };
      }
    }

    return null;
  }

  /** Better required validator */
  static required(control: AbstractControl): ValidationErrors | null {
    if (!control.value || String(control.value).trim().length === 0) {
      return {
        required: true,
      };
    }

    return null;
  }
}
