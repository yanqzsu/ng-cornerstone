import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { defer } from 'rxjs';
import {
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from '@cornerstonejs/core';
import {
  createImageIdsAndCacheMetaData,
  setCtTransferFunctionForVolumeActor,
} from '../core/load';
import { ORIENTATION } from '@cornerstonejs/core/dist/esm/constants';
import { ToolEnum } from '../tool-group/tool.config';
import { ToolGroupComponent } from '../tool-group/tool-group.component';
import { OrientationEnum, OrientationStringList } from '../core/constants';
import { ViewportComponent } from '../viewport/viewport.component';

@Component({
  selector: 'app-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements OnInit, AfterViewInit {
  volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:${this.volumeName}`; // VolumeId with loader id + volume id
  toolGroupId = 'MY_TOOLGROUP_ID';
  toolList = [
    ToolEnum.StackScrollTool,
    ToolEnum.PanTool,
    ToolEnum.ZoomTool,
    ToolEnum.WindowLevelTool,
    ToolEnum.LengthTool,
    ToolEnum.AngleTool,
  ];
  viewportId = 'VIEWPORT_ID';
  orientation = OrientationEnum.SAGITTAL;
  orientationList = OrientationStringList;
  renderingEngine!: RenderingEngine;

  @ViewChild(ToolGroupComponent)
  toolGroupComponent?: ToolGroupComponent;

  @ViewChild(ViewportComponent)
  viewportComponent?: ViewportComponent;

  constructor() {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    defer(
      async function () {
        const imageIds = await createImageIdsAndCacheMetaData({
          //   StudyInstanceUID:
          //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
          //   SeriesInstanceUID:
          //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
          //   wadoRsRoot: 'https://d1qmxk7r72ysft.cloudfront.net/dicomweb',

          //   StudyInstanceUID:
          //     '1.2.840.113619.2.207.3596.11798570.20933.1191218624.826',
          //   SeriesInstanceUID:
          //     '1.2.840.113619.2.207.3596.11798570.20933.1191218624.828',
          //   wadoRsRoot: 'http://localhost:8080/dicom-web',
          StudyInstanceUID:
            '1.2.840.113711.7041813.2.3212.182276852.26.2116281012.16720',
          SeriesInstanceUID:
            '1.3.12.2.1107.5.2.6.14114.30000006101211003631200000970',
          wadoRsRoot: 'http://10.81.20.156:8080/dicom-web',
          type: 'VOLUME',
        });
        const volume = await volumeLoader.createAndCacheVolume(this.volumeId, {
          imageIds,
        });
        const renderingEngineId = 'myRenderingEngine';
        this.renderingEngine = new RenderingEngine(renderingEngineId);

        const viewportInputArray = [this.viewportComponent?.viewportInput];

        this.renderingEngine.setViewports(viewportInputArray);

        const toolGroup = this.toolGroupComponent?.toolGroup;
        if (toolGroup) {
          toolGroup.addViewport(this.viewportId, renderingEngineId);
        }
        volume['load']();
        await setVolumesForViewports(
          this.renderingEngine,
          [
            {
              volumeId: this.volumeId,
              callback: setCtTransferFunctionForVolumeActor,
            },
          ],
          [this.viewportId],
        );
      }.bind(this),
    ).subscribe(() => {
      this.renderingEngine.renderViewports([this.viewportId]);
    });
  }

  changeOrientation(event: any) {
    const selectedValue = event?.target?.value;
    const viewport = this.renderingEngine.getViewport(this.viewportId);

    // TODO -> Maybe we should rename sliceNormal to viewPlaneNormal everywhere?
    let viewUp;
    let viewPlaneNormal;

    switch (selectedValue) {
      case 'AXIAL':
      case 'CORONAL':
      case 'SAGITTAL':
        viewUp = ORIENTATION[selectedValue].viewUp;
        viewPlaneNormal = ORIENTATION[selectedValue].sliceNormal;
        break;
      case 'OBLIQUE':
        // Some random oblique value for this dataset
        viewUp = [-0.5962687530844388, 0.5453181550345819, -0.5891448751239446];
        viewPlaneNormal = [
          -0.5962687530844388, 0.5453181550345819, -0.5891448751239446,
        ];
        break;
      default:
        throw new Error('undefined orientation option');
    }

    // TODO -> Maybe we should have a helper for this on the viewport
    // Set the new orientation
    viewport.setCamera({ viewUp, viewPlaneNormal });
    // Reset the camera after the normal changes
    viewport.resetCamera();
    viewport.render();
  }
}
