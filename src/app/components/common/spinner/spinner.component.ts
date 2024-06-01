import { Component } from '@angular/core';

/** A loading spinner. Width and height must be set when using */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  host: {
    class:
      'inline-block rounded-full relative before:border before:border-[2px] before:absolute before:rounded-full before:border-box',
  },
})
export class SpinnerComponent {}
