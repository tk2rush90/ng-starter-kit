import { booleanAttribute, Component, Inject, Input } from '@angular/core';
import { slideInOutBottom } from '../../../animations/slide-in-out-bottom';
import { fadeInOut } from '../../../animations/fade-in-out';
import { OverlayRef } from '../../../services/app/overlay/overlay.service';
import { IconArrowLeftComponent } from '../../icons/icon-arrow-left/icon-arrow-left.component';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** An overlay that appears from the bottom */
@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [IconArrowLeftComponent, IconButtonDirective, IconXMarkComponent],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  animations: [fadeInOut('bottomSheetFadeInOut'), slideInOutBottom('bottomSheetSlideInOutBottom')],
  host: {
    'class':
      'fixed bg-white rounded-2xl py-6 px-8 gap-4 flex-col-stretch shadow-lg bottom-4 left-1/2 pointer-events-auto max-h-[calc(100vh-32px)] overflow-auto w-[calc(100%-32px)]',
    // To bind `transform` animation or TailwindCSS classes, use `translate` attribute.
    '[style.translate]': `'-50% 0'`,
    '[@bottomSheetFadeInOut]': '',
    '[@bottomSheetSlideInOutBottom]': '',
  },
})
export class BottomSheetComponent {
  /** Set sheet title */
  @Input() sheetTitle = '';

  /** Set to display close button */
  @Input({ transform: booleanAttribute }) displayClose = false;

  constructor(@Inject(OVERLAY_REF) private readonly _overlayRef: OverlayRef) {}

  /** Close bottom sheet */
  close(): void {
    this._overlayRef.close();
  }
}
