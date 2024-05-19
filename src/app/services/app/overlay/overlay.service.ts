import {
  ApplicationRef,
  DestroyRef,
  EmbeddedViewRef,
  Injectable,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { OverlayOutletComponent } from '../../../components/common/overlay-outlet/overlay-outlet.component';

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
}

/** Reference of opened overlay */
export interface OverlayRef<C> {
  /** Rendered `EmbeddedViewRef` of overlay */
  embeddedViewRef: EmbeddedViewRef<C>;

  /** Original `TemplateRef` of overlay */
  templateRef: TemplateRef<C>;
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
    const overlayRef = {
      embeddedViewRef,
      templateRef,
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
        embeddedViewRef.destroy();
      });
    }

    // Return created `OverlayRef`.
    return overlayRef;
  }

  /** Close latest overlay */
  closeLatest(): void {
    const latestOverlayRef =
      this._openedOverlayRefs[this._openedOverlayRefs.length - 1]; // item is removed from the `onDestroy()` method

    latestOverlayRef?.embeddedViewRef.destroy();
  }
}
