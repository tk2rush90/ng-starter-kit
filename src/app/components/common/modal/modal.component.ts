import { AfterContentInit, booleanAttribute, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { fadeInOut } from '../../../animations/fade-in-out';
import { ClickDetectorService } from '../../../services/app/click-detector/click-detector.service';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { scaleUpDown } from '../../../animations/scale-up-down';
import { IconButtonDirective } from '../icon-button/icon-button.directive';
import { IconXMarkComponent } from '../../icons/icon-x-mark/icon-x-mark.component';

/** A modal container */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconButtonDirective, IconXMarkComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    'class':
      'fixed bg-white rounded-2xl p-6 flex-col-stretch gap-5 shadow-lg top-1/2 left-1/2 pointer-events-auto max-h-[calc(100vh-32px)] overflow-auto w-full max-w-screen-xs',
    // To bind `transform` animation or TailwindCSS classes, use `translate` attribute.
    '[style.translate]': `'-50% -50%'`,
    '[@modalFadeInOut]': '',
    '[@modalScaleUpDown]': '',
  },
  animations: [fadeInOut('modalFadeInOut'), scaleUpDown('modalScaleUpDown')],
})
export class ModalComponent implements AfterContentInit, OnDestroy {
  /** Set modal title */
  @Input() modalTitle = '';

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
    // When outside is clicked, close modal. It only works when `keepOnOutsideClick` is `false`.
    this._clickDetectorService.detectClick(this._elementRef.nativeElement, {
      onOutsideClick: () => {
        if (!this.keepOnOutsideClick) {
          this._overlayService.closeByElement(this._elementRef.nativeElement);
        }
      },
    });
  }

  ngOnDestroy() {
    this._clickDetectorService.cancelDetect(this._elementRef.nativeElement);
  }

  /** Close modal */
  close(): void {
    this._overlayService.closeByElement(this._elementRef.nativeElement);
  }
}
