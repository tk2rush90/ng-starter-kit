import {
  Component,
  HostListener,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { OverlayService } from '../../../services/app/overlay/overlay.service';

/** Outlet to render overlays */
@Component({
  selector: 'app-overlay-outlet',
  standalone: true,
  imports: [],
  templateUrl: './overlay-outlet.component.html',
  styleUrl: './overlay-outlet.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class:
      'block fixed z-[9999] top-0 bottom-0 left-0 right-0 pointer-events-none',
  },
})
export class OverlayOutletComponent {
  /** `ViewContainerRef` to render overlays */
  @ViewChild('container', { read: ViewContainerRef })
  viewContainerRef!: ViewContainerRef;

  constructor(private readonly _overlayService: OverlayService) {}

  /** When `escape` keydown, close latest overlay */
  @HostListener('window:keydown.escape')
  onWindowEscapeKeydown(): void {
    this._overlayService.closeLatest();
  }
}
