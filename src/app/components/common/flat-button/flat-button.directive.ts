import { Directive, HostBinding, Input } from '@angular/core';

/** Theme of flat button */
export type FlatButtonTheme =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'warn'
  | 'success';

/** A directive to set flat type styles for a button */
@Directive({
  selector: 'button[appFlatButton]',
  standalone: true,
  host: {
    class:
      'px-2 rounded h-10 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400',
  },
})
export class FlatButtonDirective {
  /** Apply theme to flat button */
  @Input() theme: FlatButtonTheme = 'primary';

  /**
   * Get class object to apply by theme.
   * @return Object with class names to apply.
   */
  @HostBinding('class')
  get themeClasses(): object {
    switch (this.theme) {
      case 'primary': {
        return {
          'text-primary-50': true,
          'bg-primary-600': true,
          'hover:bg-primary-700': true,
          'active:bg-primary-800': true,
        };
      }

      case 'secondary': {
        return {
          'text-secondary-50': true,
          'bg-secondary-400': true,
          'hover:bg-secondary-500': true,
          'active:bg-secondary-600': true,
        };
      }

      case 'tertiary': {
        return {
          'text-tertiary-900': true,
          'bg-tertiary-100': true,
          'hover:bg-tertiary-200': true,
          'active:bg-tertiary-300': true,
        };
      }

      case 'error': {
        return {
          'text-error-50': true,
          'bg-error-400': true,
          'hover:bg-error-500': true,
          'active:bg-error-600': true,
        };
      }

      case 'warn': {
        return {
          'text-warn-50': true,
          'bg-warn-400': true,
          'hover:bg-warn-500': true,
          'active:bg-warn-600': true,
        };
      }

      case 'success': {
        return {
          'text-success-50': true,
          'bg-success-400': true,
          'hover:bg-success-500': true,
          'active:bg-success-600': true,
        };
      }
    }
  }
}
