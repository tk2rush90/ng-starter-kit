import { Component, HostBinding } from '@angular/core';
import { RadioGroupService } from '../../../../../services/app/radio-group/radio-group.service';
import { fadeInOut } from '../../../../../animations/fade-in-out';

/** A button that displays selected status */
@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  host: {
    class: 'flex-center w-5 h-5 rounded-full border transition-colors',
  },
  animations: [fadeInOut('radioButtonFadeInOut')],
})
export class RadioButtonComponent {
  /** Internal selected status to show and hide selected icon */
  selected = false;

  constructor(private readonly _radioGroupService: RadioGroupService) {}

  /** Get classes for host element by `focused` status */
  @HostBinding('class')
  get hostClasses(): object {
    // When selected and focused.
    if (this.selected) {
      if (this._radioGroupService.focused) {
        return {
          'border-primary-500': true,
          'bg-primary-100': true,
        };
      }
    }

    return {
      'border-zinc-300': true,
    };
  }

  /** Get classes for selected indicator by `focused` status */
  get indicatorClasses(): object {
    if (this._radioGroupService.focused) {
      return {
        'bg-primary-500': true,
      };
    } else {
      return {
        'bg-zinc-400': true,
      };
    }
  }
}
