import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { OrientationAxis } from '@cornerstonejs/core/dist/esm/enums';
import { Types } from '@cornerstonejs/core';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types';

@Component({
  selector: 'nc-image-box',
  exportAs: 'ncImageBox',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements OnChanges {
  @Input()
  viewportId!: string;

  @Input()
  viewportType?: ViewportType;

  @ViewChild('imageBox', { read: ElementRef, static: true })
  viewportElementRef?: ElementRef<HTMLElement>;

  @Output()
  viewportEvent = new EventEmitter<PublicViewportInput>();

  viewportInput?: PublicViewportInput;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { viewportType } = changes;
    if (viewportType) {
      this.updateViewport();
    }
  }

  private updateViewport() {
    if (this.viewportType === ViewportType.STACK) {
      this.viewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: ViewportType.STACK,
        defaultOptions: {
          background: <Types.Point3>[0, 0, 0],
        },
      };
      console.log('viewport init');
      this.viewportEvent.emit(this.viewportInput);
    } else if (this.viewportType === ViewportType.ORTHOGRAPHIC) {
      this.viewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
          orientation: OrientationAxis.AXIAL,
          background: <Types.Point3>[0, 0, 0],
        },
      };
      console.log('viewport init');
      this.viewportEvent.emit(this.viewportInput);
    }
  }
}
