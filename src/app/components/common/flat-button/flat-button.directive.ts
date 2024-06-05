import { Directive } from '@angular/core';
import { BaseButton } from '../base-button/base-button';

/** A directive to set flat type styles for a button */
@Directive({
  selector: 'button[appFlatButton]',
  standalone: true,
  host: {
    class:
      'px-2 rounded h-8 text-sm transition-colors disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400',
  },
})
export class FlatButtonDirective extends BaseButton {
  override get primaryThemeClasses(): object {
    return {
      'text-primary-50': true,
      'bg-primary-600': true,
      'hover:bg-primary-700': true,
      'active:bg-primary-800': true,
    };
  }

  override get secondaryThemeClasses(): object {
    return {
      'text-secondary-50': true,
      'bg-secondary-400': true,
      'hover:bg-secondary-500': true,
      'active:bg-secondary-600': true,
    };
  }

  override get tertiaryThemeClasses(): object {
    return {
      'text-tertiary-900': true,
      'bg-tertiary-100': true,
      'hover:bg-tertiary-200': true,
      'active:bg-tertiary-300': true,
    };
  }

  override get warnThemeClasses(): object {
    return {
      'text-warn-50': true,
      'bg-warn-400': true,
      'hover:bg-warn-500': true,
      'active:bg-warn-600': true,
    };
  }

  override get errorThemeClasses(): object {
    return {
      'text-error-50': true,
      'bg-error-400': true,
      'hover:bg-error-500': true,
      'active:bg-error-600': true,
    };
  }

  override get successThemeClasses(): object {
    return {
      'text-success-50': true,
      'bg-success-400': true,
      'hover:bg-success-500': true,
      'active:bg-success-600': true,
    };
  }
}
