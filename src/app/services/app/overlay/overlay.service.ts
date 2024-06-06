import {
  ApplicationRef,
  DestroyRef,
  EmbeddedViewRef,
  Injectable,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { OverlayOutletComponent } from '../../../components/common/overlay-outlet/overlay-outlet.component';
import { NodeUtil } from '../../../utils/node-util';

/** Options to open overlay */
export interface OverlayOptions {
  /**
   * `DestroyRef` to destroy overlay on destroying component.
   *  When it's not provided, overlay only can be destroyed manually.
   */
  destroyRef?: DestroyRef;

  /** Callback to call when destroying EmbeddedViewRef. */
  onDestroy?: () => void;

  /** Set to allow opening duplicated template at once */
  allowDuplicated?: boolean;

  /** Set to prevent closing overlay by Escape key */
  preventKeyboardClosing?: boolean;
}

/** Reference of opened overlay */
export interface OverlayRef<C> {
  /** Rendered `EmbeddedViewRef` of overlay */
  embeddedViewRef: EmbeddedViewRef<C>;

  /** Original `TemplateRef` of overlay */
  templateRef: TemplateRef<C>;

  /** Keyboard closing prevented status */
  keyboardClosingPrevented: boolean;

  /** Close overlay */
  close: () => void;
}

/** A service to open overlays */
@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  /** Opened overlays */
  private _openedOverlayRefs: OverlayRef<any>[] = [];

  /**
   * By default, opening an overlay will create viewContainerRef to render overlay.
   * Once viewContainerRef is created, that is cached to this property to prevent creating multiple viewContainerRefs.
   */
  private _cachedViewContainerRef?: ViewContainerRef;

  constructor(private readonly _applicationRef: ApplicationRef) {}

  /**
   * Get `ViewContainerRef` to render overlays.
   * It creates `OverlayOutletComponent` when there is no outlet in view.
   */
  get viewContainerRef(): ViewContainerRef {
    if (!this._cachedViewContainerRef) {
      const rootViewContainerRef =
        this._applicationRef.components[0].injector.get(ViewContainerRef);
      const overlayOutletRef = rootViewContainerRef.createComponent(
        OverlayOutletComponent,
      );

      overlayOutletRef.changeDetectorRef.detectChanges();

      this._cachedViewContainerRef = overlayOutletRef.instance.viewContainerRef;
    }

    return this._cachedViewContainerRef;
  }

  /**
   * Open a template as overlay.
   * @param templateRef - `TemplateRef` to open as an overlay.
   * @param options - Options to open overlay.
   * @return `EmbeddedViewRef` of rendered `TemplateRef`.
   */
  open<C = any>(
    templateRef: TemplateRef<C>,
    options?: OverlayOptions,
  ): OverlayRef<C> {
    // When duplication not allowed, return existing `OverlayRef` if found.
    if (!options?.allowDuplicated) {
      const duplicatedOverlayRef = this._openedOverlayRefs.find(
        (_openedOverlayRef) => _openedOverlayRef.templateRef === templateRef,
      );

      if (duplicatedOverlayRef) {
        return duplicatedOverlayRef;
      }
    }

    // Create `EmbeddedView`.
    const embeddedViewRef =
      this.viewContainerRef.createEmbeddedView(templateRef);

    // Create `OverlayRef`.
    const overlayRef: OverlayRef<any> = {
      embeddedViewRef,
      templateRef,
      keyboardClosingPrevented: !!options?.preventKeyboardClosing,
      close: () => {
        this.close(overlayRef);
      },
    };

    this._openedOverlayRefs.push(overlayRef);

    embeddedViewRef.onDestroy(() => {
      this._openedOverlayRefs = this._openedOverlayRefs.filter(
        (_openedOverlayRef) =>
          _openedOverlayRef.embeddedViewRef !== embeddedViewRef,
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

    // Return created `OverlayRef`.
    return overlayRef;
  }

  /** Close latest overlay. It cannot close OverlayRef that has `keyboardClosingPrevented` */
  closeLatest(): void {
    // Filter only closeable OverlayRefs.
    const closeableOverlayRefs = this._openedOverlayRefs.filter(
      (_overlayRef) => !_overlayRef.keyboardClosingPrevented,
    );

    const latestOverlayRef = closeableOverlayRefs.pop();

    // `latestOverlayRef` will be removed from the `_openedOverlayRefs` when the `onDestroy()` method run.
    latestOverlayRef?.embeddedViewRef.destroy();
  }

  /**
   * Close an overlay that contains provided `element` as a child.
   * If overlay not found, it does nothing.
   * @param element - `HTMLElement` to find `OverlayRef`.
   */
  closeByElement(element: HTMLElement): void {
    // Find target `OverlayRef` that contains `element` as a child.
    const targetOverlayRef = this._openedOverlayRefs.find((_overlayRef) => {
      return _overlayRef.embeddedViewRef.rootNodes.some((_node) => {
        return _node === element || NodeUtil.containsTargetNode(_node, element);
      });
    });

    if (targetOverlayRef) {
      this.close(targetOverlayRef);
    }
  }

  /**
   * Close OverlayRef.
   * @param overlayRef - OverlayRef to close.
   */
  close(overlayRef: OverlayRef<any>): void {
    // Destroy rendered `EmbeddedViewRef` of found target.
    overlayRef?.embeddedViewRef.destroy();

    // Remove `OverlayRef` from the list.
    this._openedOverlayRefs = this._openedOverlayRefs.filter(
      (_overlayRef) => _overlayRef !== overlayRef,
    );
  }
}
