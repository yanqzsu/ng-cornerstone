import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CONSTANTS, Enums, Types, setVolumesForViewports, utilities } from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';
import { CornerstoneService, ImageInfo, imageInfoToUniqueId } from '../core';
import { BaseViewportComponent } from './base-viewport.component';
import { NgZone } from '@angular/core';

@Component({
  selector: 'nc-orthographic-viewport',
  template: `<div #imageBox class="dicom-viewer-viewport-container"></div>`,
  styleUrls: ['./viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrthographicViewportComponent extends BaseViewportComponent implements OnInit, OnChanges {
  constructor(protected override csService: CornerstoneService, zone: NgZone) {
    super(csService, zone);
  }

  ngOnInit(): void {
    // 确保视口类型设置为ORTHOGRAPHIC
    if (this.viewportInput) {
      this.viewportInput.type = Enums.ViewportType.ORTHOGRAPHIC;
    }
  }

  protected override async renderImage(image: ImageInfo): Promise<void> {
    if (!image || !this.viewportInput?.viewportId) return;

    try {
      const volumeId = image.volumeId || imageInfoToUniqueId(image);
      await setVolumesForViewports(this.renderingEngine, [{ volumeId }], [this.viewportInput.viewportId]);
      this.renderingEngine.renderViewport(this.viewportInput.viewportId);
    } catch (error) {
      console.error('Failed to render volume in orthographic viewport:', error);
    }
  }

  protected override async renderSegment(image: ImageInfo, segment: ImageInfo): Promise<void> {
    if (!segment || !image || !this.viewportInput?.viewportId) {
      return;
    }

    // 获取分段ID和引用体积ID
    const segmentationId = imageInfoToUniqueId(segment);

    if (!segmentationId) {
      console.error('Invalid segmentation or reference volume data');
      return;
    }

    try {
      // 将分段添加到视口
      if (this.viewportInput.viewportId) {
        segmentation.addSegmentationRepresentations(this.viewportInput.viewportId, [
          {
            segmentationId,
            type: csToolEnum.SegmentationRepresentations.Labelmap,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to render segment in orthographic viewport:', error);
    }
  }
}
