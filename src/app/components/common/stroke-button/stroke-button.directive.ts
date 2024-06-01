import { Directive } from '@angular/core';
import { BaseButton } from '../base-button/base-button';

/** A directive to set stroke type styles for a button */
@Directive({
  selector: 'button[appStrokeButton]',
  standalone: true,
  host: {
    class:
      'px-2 h-10 border rounded transition-colors disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-100',
  },
})
export class StrokeButtonDirective extends BaseButton {
  override get primaryThemeClasses(): object {
    return {
      'text-primary-600': true,
      'border-primary-600': true,
      'hover:bg-primary-100': true,
      'active:bg-primary-200': true,
    };
  }

  override get secondaryThemeClasses(): object {
    return {
      'text-secondary-400': true,
      'border-secondary-400': true,
      'hover:bg-secondary-100': true,
      'active:bg-secondary-200': true,
    };
  }

  override get tertiaryThemeClasses(): object {
    return {
      'text-tertiary-400': true,
      'border-tertiary-400': true,
      'hover:bg-tertiary-50': true,
      'active:bg-tertiary-100': true,
    };
  }

  override get warnThemeClasses(): object {
    return {
      'text-warn-400': true,
      'border-warn-400': true,
      'hover:bg-warn-100': true,
      'active:bg-warn-200': true,
    };
  }

  override get errorThemeClasses(): object {
    return {
      'text-error-400': true,
      'border-error-400': true,
      'hover:bg-error-100': true,
      'active:bg-error-200': true,
    };
  }

  override get successThemeClasses(): object {
    return {
      'text-success-400': true,
      'border-success-400': true,
      'hover:bg-success-100': true,
      'active:bg-success-200': true,
    };
  }
}
