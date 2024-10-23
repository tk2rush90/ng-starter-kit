import {
  ApplicationRef,
  DestroyRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { OverlayOutletComponent } from '../../../components/common/overlay-outlet/overlay-outlet.component';
import { Platform } from '../../../utils/platform';
import { OVERLAY_REF } from '../../../tokens/overlay-ref';

/** Options to open overlay */
export interface OverlayOptions {
  /** Any context to pass to overlay */
  context?: any;

  /**
   * `DestroyRef` to destroy overlay on destroying component.
   *  When it's not provided, overlay only can be destroyed manually.
   */
  destroyRef?: DestroyRef;

  /** Callback to call when destroying EmbeddedViewRef. */
  onDestroy?: () => void;

  /** Set to allow opening duplicated template at once */
  allowDuplicated?: boolean;

  /** Set to prevent closing on click outside */
  preventOutsideClosing?: boolean;

  /** Set to prevent closing overlay by Escape key */
  preventKeyboardClosing?: boolean;
}

/** Reference of opened overlay */
export interface OverlayRef<C = any> {
  /** Rendered `EmbeddedViewRef` of overlay */
  embeddedViewRef?: EmbeddedViewRef<C>;

  /** Original `TemplateRef` of overlay */
  templateRef: TemplateRef<C>;

  /** Keyboard closing prevented status */
  keyboardClosingPrevented: boolean;

  /** Outside closing prevented status */
  outsideClosingPrevented: boolean;

  /** Overlay ready status. Outside closing works after ready*/
  ready: boolean;

  /** Close overlay */
  close: () => void;
}

/** A service to open overlays */
@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  /** Opened overlays */
  private _openedOverlayRefs: OverlayRef[] = [];

  /**
   * By default, opening an overlay will create viewContainerRef to render overlay.
   * Once viewContainerRef is created, that is cached to this property to prevent creating multiple viewContainerRefs.
   */
  private _cachedViewContainerRef?: ViewContainerRef;

  private _closeableOverlayRefs: OverlayRef[] = [];

  private _mouseUpTimeout: any;

  constructor(private readonly _applicationRef: ApplicationRef) {
    if (Platform.isBrowser) {
      window.addEventListener(
        'mousedown',
        (event) => {
          if (event.target instanceof Element) {
            const target = event.target;

            this._openedOverlayRefs.forEach((_overlayRef) => {
              if (!_overlayRef.outsideClosingPrevented && _overlayRef.ready) {
                const clickableRootNodes: HTMLElement[] =
                  _overlayRef.embeddedViewRef?.rootNodes.filter(
                    (_rootNode) =>
                      _rootNode instanceof HTMLElement &&
                      getComputedStyle(_rootNode).getPropertyValue('pointer-events') !== 'none',
                  ) || [];

                // 클릭 가능한 요소 그 어떤 것에도 mousedown 이 일어나지 않았을 경우만 close 가능한 OverlayRef 으로 지정
                if (clickableRootNodes.every((_node) => !_node.contains(target))) {
                  this._closeableOverlayRefs.push(_overlayRef);
                }
              }
            });
          }
        },
        {
          capture: true,
        },
      );

      window.addEventListener(
        'mouseup',
        () => {
          clearTimeout(this._mouseUpTimeout);

          // 마우스를 뗐을 경우 close 가능한 OverlayRef 클리어
          // click 이벤트 감지 이후 실행하기 위해 setTimeout 사용
          this._mouseUpTimeout = setTimeout(() => {
            this._closeableOverlayRefs = [];
          });
        },
        {
          capture: true,
        },
      );

      // close on outside clicking
      window.addEventListener(
        'click',
        (event) => {
          if (event.target instanceof Element) {
            const target = event.target;

            this._openedOverlayRefs.forEach((_overlayRef) => {
              if (!_overlayRef.outsideClosingPrevented && _overlayRef.ready) {
                const clickableRootNodes: HTMLElement[] =
                  _overlayRef.embeddedViewRef?.rootNodes.filter(
                    (_rootNode) =>
                      _rootNode instanceof HTMLElement &&
                      getComputedStyle(_rootNode).getPropertyValue('pointer-events') !== 'none',
                  ) || [];

                if (clickableRootNodes.some((_node) => _node.contains(target))) {
                  return;
                } else if (this._closeableOverlayRefs.includes(_overlayRef)) {
                  _overlayRef.close();
                }
              }
            });
          }
        },
        {
          capture: true,
        },
      );
    }
  }

  /**
   * Get `ViewContainerRef` to render overlays.
   * It creates `OverlayOutletComponent` when there is no outlet in view.
   */
  get viewContainerRef(): ViewContainerRef {
    if (!this._cachedViewContainerRef) {
      const rootViewContainerRef = this._applicationRef.components[0].injector.get(ViewContainerRef);
      const overlayOutletRef = rootViewContainerRef.createComponent(OverlayOutletComponent);

      overlayOutletRef.changeDetectorRef.detectChanges();

      this._cachedViewContainerRef = overlayOutletRef.instance.viewContainerRef;
    }

    return this._cachedViewContainerRef;
  }

  get hasOpenedOverlay(): boolean {
    return this._openedOverlayRefs.length > 0;
  }

  /**
   * Open a template as overlay.
   * @param templateRef - `TemplateRef` to open as an overlay.
   * @param options - Options to open overlay.
   * @return `EmbeddedViewRef` of rendered `TemplateRef`.
   */
  open<C = any>(templateRef: TemplateRef<C>, options?: OverlayOptions): OverlayRef<C> {
    // When duplication not allowed, return existing `OverlayRef` if found.
    if (!options?.allowDuplicated) {
      const duplicatedOverlayRef = this._openedOverlayRefs.find(
        (_openedOverlayRef) => _openedOverlayRef.templateRef === templateRef,
      );

      if (duplicatedOverlayRef) {
        return duplicatedOverlayRef;
      }
    }

    // Create `OverlayRef`.
    const overlayRef: OverlayRef = {
      templateRef,
      keyboardClosingPrevented: !!options?.preventKeyboardClosing,
      outsideClosingPrevented: !!options?.preventOutsideClosing,
      ready: false,
      close: () => {
        this.close(overlayRef);
      },
    };

    // Create `EmbeddedView`.
    const embeddedViewRef = this.viewContainerRef.createEmbeddedView(templateRef, options?.context, {
      injector: Injector.create({
        providers: [
          {
            provide: OVERLAY_REF,
            useValue: overlayRef,
          },
        ],
      }),
    });

    overlayRef.embeddedViewRef = embeddedViewRef;

    this._openedOverlayRefs.push(overlayRef);

    embeddedViewRef.onDestroy(() => {
      this._openedOverlayRefs = this._openedOverlayRefs.filter(
        (_openedOverlayRef) => _openedOverlayRef.embeddedViewRef !== embeddedViewRef,
      );

      if (options?.onDestroy) {
        options.onDestroy();
      }
    });

    // When `destroyRef` provided, destroy overlay when `destroyRef` destroyed.
    if (options?.destroyRef) {
      options.destroyRef.onDestroy(() => {
        overlayRef.close();
      });
    }

    // To prevent closing instantly, set ready status after timeout
    setTimeout(() => (overlayRef.ready = true));

    // Return created `OverlayRef`.
    return overlayRef;
  }

  /** Close latest overlay. It cannot close OverlayRef that has `keyboardClosingPrevented` */
  closeLatest(): void {
    // Filter only closeable OverlayRefs.
    const closeableOverlayRefs = this._openedOverlayRefs.filter((_overlayRef) => !_overlayRef.keyboardClosingPrevented);

    const latestOverlayRef = closeableOverlayRefs.pop();

    // `latestOverlayRef` will be removed from the `_openedOverlayRefs` when the `onDestroy()` method run.
    latestOverlayRef?.embeddedViewRef?.destroy();
  }

  /**
   * Close OverlayRef.
   * @param overlayRef - OverlayRef to close.
   */
  close(overlayRef: OverlayRef): void {
    // Destroy rendered `EmbeddedViewRef` of found target.
    overlayRef?.embeddedViewRef?.destroy();

    // Remove `OverlayRef` from the list.
    this._openedOverlayRefs = this._openedOverlayRefs.filter((_overlayRef) => _overlayRef !== overlayRef);
  }
}
