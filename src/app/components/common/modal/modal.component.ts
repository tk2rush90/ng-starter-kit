import { AfterContentInit, booleanAttribute, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { fadeInOut } from '../../../animations/fade-in-out';
import { ClickDetectorService } from '../../../services/app/click-detector/click-detector.service';
import { OverlayService } from '../../../services/app/overlay/overlay.service';
import { scaleUpDown } from '../../../animations/scale-up-down';

/** A modal container */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    'class':
      'fixed bg-white rounded-lg p-4 flex-col-stretch shadow-lg top-1/2 left-1/2 pointer-events-auto max-h-[calc(100vh-32px)] overflow-auto',
    // To bind `transform` animation or TailwindCSS classes, use `translate` attribute.
    '[style.translate]': `'-50% -50%'`,
    '[@modalFadeInOut]': '',
    '[@modalScaleUpDown]': '',
  },
  animations: [fadeInOut('modalFadeInOut'), scaleUpDown('modalScaleUpDown')],
})
export class ModalComponent implements AfterContentInit, OnDestroy {
  /** Set to keep opening on outside click */
  @Input({ transform: booleanAttribute }) keepOnOutsideClick = false;

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
}
