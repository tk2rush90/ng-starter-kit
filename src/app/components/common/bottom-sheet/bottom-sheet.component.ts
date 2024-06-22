import { AfterContentInit, booleanAttribute, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { slideInOutBottom } from '../../../animations/slide-in-out-bottom';
import { fadeInOut } from '../../../animations/fade-in-out';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { ClickDetectorService } from '../../../services/app/click-detector/click-detector.service';
import { IconArrowLeftComponent } from '../../icons/icon-arrow-left/icon-arrow-left.component';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';

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
      'fixed bg-white rounded-2xl py-6 px-8 gap-4 flex-col-stretch shadow-lg bottom-4 left-1/2 pointer-events-auto max-h-[calc(100vh-32px)] overflow-auto w-[calc(100%-32px)] max-w-[300px]',
    // To bind `transform` animation or TailwindCSS classes, use `translate` attribute.
    '[style.translate]': `'-50% 0'`,
    '[@bottomSheetFadeInOut]': '',
    '[@bottomSheetSlideInOutBottom]': '',
  },
})
export class BottomSheetComponent implements AfterContentInit, OnDestroy {
  /** Set sheet title */
  @Input() sheetTitle = '';

  /** Set to keep opening on outside click */
  @Input({ transform: booleanAttribute }) keepOnOutsideClick = false;

  /** Set to display close button */
  @Input({ transform: booleanAttribute }) displayClose = false;

  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _overlayService: OverlayService,
    private readonly _clickDetectorService: ClickDetectorService,
  ) {}

  ngAfterContentInit() {
    // When outside is clicked, close bottom sheet. It only works when `keepOnOutsideClick` is `false`.
    this._clickDetectorService.detectClick(this._elementRef.nativeElement, {
      onOutsideClick: () => {
        if (!this.keepOnOutsideClick) {
          this.close();
        }
      },
    });
  }

  ngOnDestroy() {
    this._clickDetectorService.cancelDetect(this._elementRef.nativeElement);
  }

  /** Close bottom sheet */
  close(): void {
    this._overlayService.closeByElement(this._elementRef.nativeElement);
  }
}
