import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Types, Enums } from '@cornerstonejs/core';

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
  viewportType?: Enums.ViewportType;

  @ViewChild('imageBox', { read: ElementRef, static: true })
  viewportElementRef?: ElementRef<HTMLElement>;

  @Output()
  viewportEvent = new EventEmitter<Types.PublicViewportInput>();

  viewportInput?: Types.PublicViewportInput;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { viewportType } = changes;
    if (viewportType) {
      this.updateViewport();
    }
  }

  private updateViewport() {
    if (this.viewportType === Enums.ViewportType.STACK) {
      this.viewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: Enums.ViewportType.STACK,
        defaultOptions: {
          background: <Types.Point3>[0, 0, 0],
        },
      };
      console.log('viewport init');
      this.viewportEvent.emit(this.viewportInput);
    } else if (this.viewportType === Enums.ViewportType.ORTHOGRAPHIC) {
      this.viewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
          orientation: Enums.OrientationAxis.AXIAL,
          background: <Types.Point3>[0, 0, 0],
        },
      };
      console.log('viewport init');
      this.viewportEvent.emit(this.viewportInput);
    } else if (this.viewportType === Enums.ViewportType.VOLUME_3D) {
      this.viewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: Enums.ViewportType.VOLUME_3D,
        defaultOptions: {
          orientation: Enums.OrientationAxis.CORONAL,
          background: <Types.Point3>[0.2, 0, 0.2],
        },
      };
      console.log('viewport init');
      this.viewportEvent.emit(this.viewportInput);
    }
  }
}
