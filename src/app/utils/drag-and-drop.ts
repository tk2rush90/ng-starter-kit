import { Points } from '../data/points';
import { DragAndDropOptions } from '../data/drag-and-drop-options';

/**
 * 드래그 앤 드랍 기능 구현을 위한 DragAndDrop 클래스
 * Element의 data attribute를 이용한 드래그 앤 드랍 컨트롤
 *
 * 사용 가능한 attribute 목록
 * - data-dnd-group-name (필수)
 *  드래그 할 요소와 드랍존에 설정
 *  드래그 중인 요소는 동일한 그룹명을 가진 드랍존에만 드랍 가능
 * - data-dnd-dropzone-name (필수)
 *  드랍존에 설정
 *  드랍존의 이름을 정할 수 있으며, 이름이 있어야 드래그 시작 시 드랍 가능한 요소 목록에 저장됨
 * - data-dnd-dropzone-y-adjust (옵션)
 *  드랍존에 설정
 *  드랍존 인식 가능 범위를 y 축을 기준으로 수정하는 옵션으로 숫자만 입력 가능
 *  예를 들어 20 입력 시, 드랍존이 위로 20px, 아래로 20px 만큼 확장되어 인식
 *  -20 입력 시 드랍존이 위로 -20px, 아래로 -20px 만큼 축소되어 인식
 * - data-dnd-dropzone-x-adjust (옵션)
 *  드랍존에 설정
 *  드랍존 인식 가능 범위를 x 축을 기준으로 수정하는 옵션으로 숫자만 입력 가능
 *  예를 들어 20 입력 시, 드랍존이 왼쪽으로 20px, 오른쪽으로 20px 만큼 확장되어 인식
 *  -20 입력 시 드랍존이 왼쪽으로 -20px, 오른쪽으로 -20px 만큼 축소되어 인식
 * - data-dnd-dropzone-z-index (옵션)
 *  드랍존에 설정
 *  설정하지 않을 경우 기본 값은 0이며, 여러 드랍존이 겹쳐있을 때 z-index가 높은 드랍존을 우선 인식
 *  정수만 입력 가능
 */
export class DragAndDrop {
  draggingElement?: Element;

  /** 드래그를 시작한 요소의 기존 DomRect */
  draggingDomRect?: DOMRect;

  /** 드래그를 시작한 요소의 group name */
  draggingGroupName = '';

  /** Dropzone 역할을 하는 HTML 요소들 */
  dropzoneElements: Element[] = [];

  /**
   * 드래그 컨테이너 요소들
   * 요소의 끝 부분에 위치할 때 스크롤 가능한 경우 자동 스크롤
   * window 는 기본으로 포함
   */
  dragContainerElements: (Window | Element)[] = [];

  initialX = 0;

  initialY = 0;

  movedX = 0;

  movedY = 0;

  /** 드래그가 활성화 되었을 경우 true */
  isDragging = false;

  private readonly _onDragStart?: (element: Element | undefined) => void;

  private readonly _onDragging?: (element: Element | undefined) => void;

  private readonly _onDropzoneActivated?: (element: Element | undefined, dropzone: Element) => void;

  private readonly _onDropzoneDeactivated?: (element: Element | undefined) => void;

  private readonly _onDrop?: (element: Element | undefined, dropzone?: Element) => void;

  private readonly _mouseDownTriggerDistance?: number;

  private readonly _touchStartTriggerTimer?: number;

  private _touchStartTimeout: any;

  private _dropzoneDetectorTimeout: any;

  private _dragContainerDetectInterval: any;

  constructor(options: DragAndDropOptions) {
    this._onDragStart = options.onDragStart;
    this._onDragging = options.onDragging;
    this._onDropzoneActivated = options.onDropzoneActivated;
    this._onDropzoneDeactivated = options.onDropzoneDeactivated;
    this._onDrop = options.onDrop;

    this._mouseDownTriggerDistance = options.mouseDownTriggerDistance;
    this._touchStartTriggerTimer = options.touchStartTriggerTimer;

    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
  }

  static getXYFromEvent(event: MouseEvent | TouchEvent): Points {
    if (event instanceof MouseEvent) {
      return {
        x: event.x,
        y: event.y,
      };
    } else {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  }

  static getDistance(points1: Points, points2: Points): number {
    const dx = points2.x - points1.x;
    const dy = points2.y - points2.y;

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }

  /** points 가 rect 내에 존재하는지 확인 */
  static isPointOverlapping(points: Points, rect: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>): boolean {
    return (
      points.x >= rect.x && points.x <= rect.x + rect.width && points.y >= rect.y && points.y <= rect.y + rect.height
    );
  }

  detectDrag(event: MouseEvent | TouchEvent, element: HTMLElement): void {
    const points = DragAndDrop.getXYFromEvent(event);

    this.initialX = points.x;
    this.initialY = points.y;
    this.movedX = this.initialX;
    this.movedY = this.initialY;

    this.draggingElement = element;
    this.draggingDomRect = this.draggingElement.getBoundingClientRect();
    this.draggingGroupName = this.draggingElement.getAttribute('data-dnd-group-name') || '';

    if (!this.draggingGroupName) {
      throw new Error('There is no data-dnd-group-name');
    }

    // 동일한 그룹에 속한 dropzone 목록 조회
    const dropzoneElementList = document.querySelectorAll(
      `[data-dnd-group-name="${this.draggingGroupName}"][data-dnd-dropzone-name]`,
    );

    dropzoneElementList.forEach((_dropzoneElement) => {
      this.dropzoneElements.push(_dropzoneElement);
    });

    // 드래그 컨테이너 요소들 조회
    const dragContainerElementList = document.querySelectorAll(
      `[data-dnd-group-name="${this.draggingGroupName}"][data-dnd-container]`,
    );

    this.dragContainerElements.push(window);

    dragContainerElementList.forEach((_dragContainerElement) => {
      this.dragContainerElements.push(_dragContainerElement);
    });

    // Drag container 감지 시작
    clearInterval(this._dragContainerDetectInterval);

    this._dragContainerDetectInterval = setInterval(() => {
      this.dragContainerElements.forEach((_dragContainerElement) => {
        const rect: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> =
          _dragContainerElement instanceof Window
            ? {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight,
              }
            : _dragContainerElement.getBoundingClientRect().toJSON();

        const isLeftOverlapping = DragAndDrop.isPointOverlapping(
          {
            x: this.movedX,
            y: this.movedY,
          },
          {
            ...rect,
            width: rect.width * 0.1,
          },
        );

        const isRightOverlapping = DragAndDrop.isPointOverlapping(
          {
            x: this.movedX,
            y: this.movedY,
          },
          {
            ...rect,
            x: rect.x + rect.width * 0.9,
          },
        );

        const isTopOverlapping = DragAndDrop.isPointOverlapping(
          {
            x: this.movedX,
            y: this.movedY,
          },
          {
            ...rect,
            height: rect.height * 0.1,
          },
        );

        const isBottomOverlapping = DragAndDrop.isPointOverlapping(
          {
            x: this.movedX,
            y: this.movedY,
          },
          {
            ...rect,
            y: rect.y + rect.height * 0.9,
          },
        );

        _dragContainerElement.scrollBy({
          left: isLeftOverlapping ? -rect.width * 0.3 : isRightOverlapping ? rect.width * 0.3 : 0,
          top: isTopOverlapping ? -rect.height * 0.3 : isBottomOverlapping ? rect.height * 0.3 : 0,
          behavior: 'smooth',
        });
      });
    }, 200);

    if (event instanceof MouseEvent) {
      // 이동 거리 설정이 없을 경우 즉시 드래그 활성화
      if (this._mouseDownTriggerDistance === undefined) {
        this._startDragging();
      }

      this._setWindowEvents();
    } else {
      // 대기 시간 설정이 없을 경우 즉시 드래그 활성화
      // 아닌 경우 정해진 시간 이후 드래그 활성화
      if (this._touchStartTriggerTimer === undefined) {
        this._startDragging();
      } else {
        clearTimeout(this._touchStartTimeout);

        this._touchStartTimeout = setTimeout(() => {
          this._startDragging();
        }, this._touchStartTriggerTimer);
      }

      this._setWindowEvents();
    }
  }

  drag(event: MouseEvent | TouchEvent): void {
    if (event instanceof TouchEvent && !event.cancelable) {
      clearTimeout(this._touchStartTimeout);

      return;
    }

    const points = DragAndDrop.getXYFromEvent(event);

    this.movedX = points.x;
    this.movedY = points.y;

    if (!this.isDragging && this._mouseDownTriggerDistance !== undefined) {
      const distance = DragAndDrop.getDistance(
        {
          x: this.initialX,
          y: this.initialY,
        },
        {
          x: this.movedX,
          y: this.movedY,
        },
      );

      // 설정된 거리만큼 이동 후 드래그 활성화
      if (Math.abs(distance) > this._mouseDownTriggerDistance && event instanceof MouseEvent) {
        this._startDragging();
      }
    } else {
      if (event.cancelable) {
        event.preventDefault();
      }

      if (this._onDragging) {
        this._onDragging(this.draggingElement);
      }

      clearTimeout(this._dropzoneDetectorTimeout);

      this._dropzoneDetectorTimeout = setTimeout(() => {
        // 활성화 된 dropzone 찾기
        const activatedDropzone = this.getActivatedDropzone();

        if (activatedDropzone) {
          if (this._onDropzoneActivated) {
            this._onDropzoneActivated(this.draggingElement, activatedDropzone);
          }
        } else if (this._onDropzoneDeactivated) {
          this._onDropzoneDeactivated(this.draggingElement);
        }
      });
    }
  }

  drop(): void {
    if (this._onDrop) {
      if (this.isDragging) {
        const activatedDropzone = this.getActivatedDropzone();

        this._onDrop(this.draggingElement, activatedDropzone);
      } else {
        this._onDrop(this.draggingElement);
      }
    }

    delete this.draggingElement;
    delete this.draggingDomRect;
    this.dropzoneElements = [];
    this.dragContainerElements = [];
    this.isDragging = false;

    this._removeWindowEvents();

    clearTimeout(this._touchStartTimeout);
    clearTimeout(this._dropzoneDetectorTimeout);
    clearInterval(this._dragContainerDetectInterval);
  }

  getActivatedDropzone(): Element | undefined {
    let dropzoneElement: Element | undefined;
    let lastDropzoneZIndex = -1;

    this.dropzoneElements.find((_dropzone) => {
      const dropzoneDomRect = _dropzone.getBoundingClientRect();

      const xAdjust = _dropzone.getAttribute('data-dnd-dropzone-x-adjust');
      const xAdjustValue = xAdjust ? parseFloat(xAdjust) : 0;

      const yAdjust = _dropzone.getAttribute('data-dnd-dropzone-y-adjust');
      const yAdjustValue = yAdjust ? parseFloat(yAdjust) : 0;

      const dropzoneZIndex = _dropzone.getAttribute('data-dnd-dropzone-z-index');
      const dropzoneZIndexValue = dropzoneZIndex ? parseInt(dropzoneZIndex) : 0;

      const isOverlapping = DragAndDrop.isPointOverlapping(
        {
          x: this.movedX,
          y: this.movedY,
        },
        {
          width: dropzoneDomRect.width + xAdjustValue * 2,
          x: dropzoneDomRect.x - xAdjustValue,
          height: dropzoneDomRect.height + yAdjustValue * 2,
          y: dropzoneDomRect.y - yAdjustValue,
        },
      );

      if (isOverlapping && dropzoneZIndexValue > lastDropzoneZIndex) {
        dropzoneElement = _dropzone;
        lastDropzoneZIndex = dropzoneZIndexValue;
      }
    });

    return dropzoneElement;
  }

  destroy(): void {
    this._removeWindowEvents();

    clearTimeout(this._touchStartTimeout);
    clearTimeout(this._dropzoneDetectorTimeout);
    clearInterval(this._dragContainerDetectInterval);
  }

  private _startDragging(): void {
    this.isDragging = true;

    if (this._onDragStart) {
      this._onDragStart(this.draggingElement);
    }
  }

  private _setWindowEvents(): void {
    window.addEventListener('mousemove', this.drag);
    window.addEventListener('touchmove', this.drag, { passive: false });
    window.addEventListener('mouseup', this.drop);
    window.addEventListener('touchcancel', this.drop);
    window.addEventListener('touchend', this.drop);
  }

  private _removeWindowEvents(): void {
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('touchmove', this.drag);
    window.removeEventListener('mouseup', this.drop);
    window.removeEventListener('touchcancel', this.drop);
    window.removeEventListener('touchend', this.drop);
  }
}
