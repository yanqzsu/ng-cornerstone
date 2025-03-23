import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CONSTANTS, Enums, Types, setVolumesForViewports, utilities } from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';
import { CornerstoneService, ImageInfo, imageInfoToUniqueId } from '../core';
import { BaseViewportComponent } from './base-viewport.component';
import { NgZone } from '@angular/core';

@Component({
  selector: 'nc-volume3d-viewport',
  template: `<div #imageBox class="dicom-viewer-viewport-container"></div>`,
  styleUrls: ['./viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Volume3DViewportComponent extends BaseViewportComponent implements OnInit {
  @Input() volumeId?: string;

  constructor(protected override csService: CornerstoneService, zone: NgZone) {
    super(csService, zone);
  }

  ngOnInit(): void {
    // 确保视口类型设置为VOLUME_3D
    if (this.viewportInput) {
      this.viewportInput.type = Enums.ViewportType.VOLUME_3D;
    }
  }

  override async renderImage(image: ImageInfo): Promise<void> {
    if (!image) return;

    try {
      await setVolumesForViewports(this.renderingEngine, [{ volumeId: image.volumeId! }], [this.viewport.id]);
      const actor = this.viewport.getDefaultActor().actor as Types.VolumeActor;
      utilities.applyPreset(
        actor,
        CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Chest-Contrast-Enhanced')!,
      );
    } catch (error) {
      console.error('Failed to render volume in volume3d viewport:', error);
    }
  }

  override async renderSegment(image: ImageInfo, segment: ImageInfo): Promise<void> {
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
            type: csToolEnum.SegmentationRepresentations.Surface,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to render segment in orthographic viewport:', error);
    }
  }
}
