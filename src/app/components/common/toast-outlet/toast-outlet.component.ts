import { Component } from '@angular/core';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import {
  ToastMessage,
  ToastService,
} from '../../../services/app/toast/toast.service';

/** An outlet container to render toast overlays */
@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  imports: [ToastMessageComponent],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  host: {
    class:
      'fixed z-[9999] top-0 bottom-0 left-0 right-0 pointer-events-none p-4 flex flex-col items-center justify-end',
  },
})
export class ToastOutletComponent {
  constructor(private readonly _toastService: ToastService) {}

  get toasts(): ToastMessage[] {
    return this._toastService.toasts;
  }
}
