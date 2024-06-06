import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { ToastOutletComponent } from '../../../components/common/toast-outlet/toast-outlet.component';

/** An interface of toast message */
export interface ToastMessage {
  /** Message to display */
  message: string;

  /** Duration in milliseconds until auto close */
  duration: number;

  /** Timeout timer assigned to toast message */
  timeout: any;

  /** Close toast method */
  close: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /** Opened toasts */
  toasts: ToastMessage[] = [];

  /** Rendered ToastOutletComponent */
  private _toastOutletRef?: ComponentRef<ToastOutletComponent>;

  constructor(private readonly _applicationRef: ApplicationRef) {
    this._applicationRef.isStable.subscribe((stable) => {
      if (stable && !this._toastOutletRef) {
        const rootViewContainerRef =
          this._applicationRef.components[0].injector.get(ViewContainerRef);
        this._toastOutletRef =
          rootViewContainerRef.createComponent(ToastOutletComponent);

        this._toastOutletRef.changeDetectorRef.detectChanges();
      }
    });
  }

  /**
   * Open a new toast message.
   * @param message - Message to display.
   * @param duration - Duration in milliseconds until auto close.
   */
  open(message: string, duration = 3000): void {
    // Create ToastMessage.
    const toastMessage: ToastMessage = {
      message,
      duration,
      timeout: setTimeout(() => {
        this.close(toastMessage);
      }, duration),
      close: () => {
        this.close(toastMessage);
      },
    };

    this.toasts.push(toastMessage);
  }

  /**
   * Close toast message.
   * @param toast - Toast to close.
   */
  close(toast: ToastMessage): void {
    this.toasts = this.toasts.filter((_toast) => _toast !== toast);
  }
}
