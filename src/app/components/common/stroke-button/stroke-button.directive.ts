import { Directive } from '@angular/core';

/** A directive to set stroke type styles for a button */
@Directive({
  selector: 'button[appStrokeButton]',
  standalone: true,
  host: {
    class:
      'px-2 h-10 border border-zinc-300 rounded hover:bg-zinc-100 active:bg-zinc-200 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-100',
  },
})
export class StrokeButtonDirective {}
