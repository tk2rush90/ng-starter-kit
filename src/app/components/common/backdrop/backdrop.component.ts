import { Component } from '@angular/core';
import { fadeInOut } from '../../../animations/fade-in-out';

/**
 * A transparent backdrop.
 * Color can be set by binding bg class to component.
 */
@Component({
  selector: 'app-backdrop',
  standalone: true,
  imports: [],
  templateUrl: './backdrop.component.html',
  styleUrl: './backdrop.component.scss',
  animations: [fadeInOut('backdropFadeInOut')],
  host: {
    class: 'fixed top-0 left-0 right-0 bottom-0 block pointer-events-auto',
    '[@backdropFadeInOut]': '',
  },
})
export class BackdropComponent {}
