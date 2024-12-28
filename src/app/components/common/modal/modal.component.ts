import { booleanAttribute, Component, Inject, Input } from '@angular/core';
import { fadeInOut } from '../../../animations/fade-in-out';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { scaleUpDown } from '../../../animations/scale-up-down';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** A modal container */
@Component({
    selector: 'app-modal',
    imports: [IconButtonDirective, IconXMarkComponent],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    host: {
        'class': 'fixed bg-white rounded-2xl p-6 flex-col-stretch gap-5 shadow-lg top-1/2 left-1/2 pointer-events-auto max-h-[calc(100vh-32px)] overflow-auto w-[calc(100%-32px)]',
        // To bind `transform` animation or TailwindCSS classes, use `translate` attribute.
        '[style.translate]': `'-50% -50%'`,
        '[@modalFadeInOut]': '',
        '[@modalScaleUpDown]': '',
    },
    animations: [fadeInOut('modalFadeInOut'), scaleUpDown('modalScaleUpDown')]
})
export class ModalComponent {
  /** Set modal title */
  @Input() modalTitle = '';

  /** Set to display close button */
  @Input({ transform: booleanAttribute }) displayClose = false;

  constructor(@Inject(OVERLAY_REF) private readonly _overlayRef: OverlayRef) {}

  /** Close modal */
  close(): void {
    this._overlayRef.close();
  }
}
