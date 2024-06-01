import { Directive, HostBinding, Input } from '@angular/core';
import { ButtonTheme } from '../../../types/button-theme';

/**
 * An abstract class to create button directives.
 * Do not bind this directive to element or component from the template.
 */
@Directive({
  selector: '[appBaseButton]',
})
export abstract class BaseButton {
  /** Apply theme to flat button */
  @Input() theme: ButtonTheme = 'primary';

  /**
   * Getter to return class object according to `theme`.
   * It is bound to `class` attribute of host element.
   */
  @HostBinding('class')
  get themeClasses(): object {
    switch (this.theme) {
      case 'primary': {
        return this.primaryThemeClasses;
      }

      case 'secondary': {
        return this.secondaryThemeClasses;
      }

      case 'tertiary': {
        return this.tertiaryThemeClasses;
      }

      case 'warn': {
        return this.warnThemeClasses;
      }

      case 'error': {
        return this.errorThemeClasses;
      }

      case 'success': {
        return this.successThemeClasses;
      }
    }
  }

  /** Abstract getter to return class object for `primary` theme */
  abstract get primaryThemeClasses(): object;

  /** Abstract getter to return class object for `secondary` theme */
  abstract get secondaryThemeClasses(): object;

  /** Abstract getter to return class object for `tertiary` theme */
  abstract get tertiaryThemeClasses(): object;

  /** Abstract getter to return class object for `warn` theme */
  abstract get warnThemeClasses(): object;

  /** Abstract getter to return class object for `error` theme */
  abstract get errorThemeClasses(): object;

  /** Abstract getter to return class object for `success` theme */
  abstract get successThemeClasses(): object;
}
