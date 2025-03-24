import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { CONSTANTS, Enums, Types, utilities, volumeLoader } from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';
import { CornerstoneService, ImageIdService, ctVoiRange, imageInfoToUniqueId, ImageInfo } from '../core';
import { BaseViewportComponent } from './base-viewport.component';
import { IStackViewport } from '@cornerstonejs/core/dist/esm/types';
import { NgZone } from '@angular/core';

@Component({
  selector: 'nc-stack-viewport',
  template: `<div #imageBox class="dicom-viewer-viewport-container"></div>`,
  styleUrls: ['./viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackViewportComponent extends BaseViewportComponent implements OnInit, OnChanges {
  constructor(protected override csService: CornerstoneService, private imageIdService: ImageIdService, zone: NgZone) {
    super(csService, zone);
  }

  override ngOnInit(): void {
    // 确保视口类型设置为STACK
    if (this.viewportInput) {
      this.viewportInput.type = Enums.ViewportType.STACK;
    }
    super.ngOnInit();
  }

  override async renderImage(image: ImageInfo): Promise<void> {
    console.log('render stack Image');
    if (!image || !this.viewport || !this.viewportInput?.viewportId) {
      return;
    }

    try {
      // 获取ImageIds
      const imageIds = image.imageIds || [];
      // 设置Stack
      await (this.viewport as IStackViewport).setStack(imageIds);

      // 设置VOI范围
      (this.viewport as IStackViewport).setProperties({ voiRange: ctVoiRange });

      // 渲染视口
      this.renderingEngine.renderViewport(this.viewport.id);
    } catch (error) {
      console.error('Failed to render stack viewport:', error);
    }
  }

  override async renderSegment(image: ImageInfo, segment: ImageInfo): Promise<void> {
    if (!segment || !image || !this.viewport || !this.viewportInput?.viewportId) {
      return;
    }

    try {
      // 获取ImageIds
      const segmentationId = imageInfoToUniqueId(segment);
      segmentation.addSegmentationRepresentations(this.viewportInput.viewportId, [
        {
          segmentationId: segmentationId,
          type: csToolEnum.SegmentationRepresentations.Labelmap,
        },
      ]);
    } catch (error) {
      console.error('Failed to render segment in stack viewport:', error);
    }
  }

  private get toolGroupId(): string {
    return `${this.viewportInput?.viewportId}_toolgroup`;
  }
}
