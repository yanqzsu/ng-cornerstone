import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Types, Enums, CONSTANTS } from '@cornerstonejs/core';

import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types/IViewport';
import { OrientationEnum } from '../core/constants';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements OnInit {
  @Input()
  viewportId = 'viewport';

  @Input()
  orientation: OrientationEnum = OrientationEnum.AXIAL;

  get viewportInput(): PublicViewportInput {
    return {
      viewportId: this.viewportId,
      type: Enums.ViewportType.ORTHOGRAPHIC,
      element: this.element.nativeElement,
      defaultOptions: {
        orientation: CONSTANTS.ORIENTATION[this.orientation],
        background: <Types.Point3>[0, 0, 0],
      },
    };
  }

  constructor(public element: ElementRef) {}

  ngOnInit(): void {}
}
