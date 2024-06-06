import { Component } from '@angular/core';
import { slideInOutBottom } from '../../../../animations/slide-in-out-bottom';
import { fadeInOut } from '../../../../animations/fade-in-out';

/** Toast message component */
@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss',
  host: {
    class:
      'py-2 px-4 rounded-2xl bg-black/80 text-white text-sm w-full max-w-[300px] break-all pointer-events-auto absolute cursor-pointer select-none',
    '[@toastSlideInOutBottom]': '',
    '[@toastFadeInOut]': '',
  },
  animations: [
    fadeInOut('toastFadeInOut'),
    slideInOutBottom('toastSlideInOutBottom'),
  ],
})
export class ToastMessageComponent {}
