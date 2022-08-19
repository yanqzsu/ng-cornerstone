import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { defer } from 'rxjs';
import ImageVolume, {
  RenderingEngine,
  Types,
  Enums,
  setVolumesForViewports,
  volumeLoader,
  CONSTANTS,
} from '@cornerstonejs/core';
import {
  addTool,
  ToolGroupManager,
  Enums as ToolsEnums,
  PanTool,
  ZoomTool,
  WindowLevelTool,
  LengthTool,
  AngleTool,
  StackScrollTool,
} from '@cornerstonejs/tools';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';

import {
  createImageIdsAndCacheMetaData,
  setCtTransferFunctionForVolumeActor,
} from '../core/load';
import { ORIENTATION } from '@cornerstonejs/core/dist/esm/constants';

@Component({
  selector: 'app-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements OnInit {
  volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:${this.volumeName}`; // VolumeId with loader id + volume id
  toolGroupId = 'MY_TOOLGROUP_ID';
  toolGroup: IToolGroup;
  toolList = [
    StackScrollTool,
    PanTool,
    ZoomTool,
    WindowLevelTool,
    LengthTool,
    AngleTool,
  ];
  orientationList = ['AXIAL', 'SAGITTAL', 'CORONAL', 'OBLIQUE'];
  renderingEngine!: RenderingEngine;

  @ViewChild('axial')
  axialRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sagittal')
  sagittalRef!: ElementRef<HTMLDivElement>;
  @ViewChild('coronal')
  coronalRef!: ElementRef<HTMLDivElement>;

  activeToolName?: string;

  constructor() {
    this.toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId)!;
  }

  ngOnInit(): void {
    this.toolList.forEach((value) => {
      addTool(value);
      this.toolGroup.addTool(value.toolName);
      // this.toolGroup.setToolActive(value.toolName, {
      //   bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
      // });
    });
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

        // Create the viewports
        const viewportId1 = 'CT_AXIAL';
        const viewportId2 = 'CT_SAGITTAL';
        const viewportId3 = 'CT_CORONAL';

        const viewportInputArray = [
          {
            viewportId: viewportId1,
            type: Enums.ViewportType.ORTHOGRAPHIC,
            element: this.axialRef.nativeElement,
            defaultOptions: {
              orientation: CONSTANTS.ORIENTATION['AXIAL'],
              background: <Types.Point3>[0, 0, 0],
            },
          },
          {
            viewportId: viewportId2,
            type: Enums.ViewportType.ORTHOGRAPHIC,
            element: this.sagittalRef.nativeElement,
            defaultOptions: {
              orientation: CONSTANTS.ORIENTATION['SAGITTAL'],
              background: <Types.Point3>[0, 0, 0],
            },
          },
          {
            viewportId: viewportId3,
            type: Enums.ViewportType.ORTHOGRAPHIC,
            element: this.coronalRef.nativeElement,
            defaultOptions: {
              orientation: CONSTANTS.ORIENTATION['CORONAL'],
              background: <Types.Point3>[0, 0, 0],
            },
          },
        ];

        this.renderingEngine.setViewports(viewportInputArray);

        this.toolGroup.addViewport(viewportId1, renderingEngineId);
        this.toolGroup.addViewport(viewportId2, renderingEngineId);
        this.toolGroup.addViewport(viewportId3, renderingEngineId);
        volume['load']();
        await setVolumesForViewports(
          this.renderingEngine,
          [
            {
              volumeId: this.volumeId,
              callback: setCtTransferFunctionForVolumeActor,
            },
          ],
          [viewportId1, viewportId2, viewportId3],
        );
      }.bind(this),
    ).subscribe(() => {
      const viewportId1 = 'CT_AXIAL';
      const viewportId2 = 'CT_SAGITTAL';
      const viewportId3 = 'CT_CORONAL';
      this.renderingEngine.renderViewports([
        viewportId1,
        viewportId2,
        viewportId3,
      ]);
    });
  }

  toolActive(toolName: string) {
    if (this.activeToolName) {
      this.toolGroup.setToolPassive(this.activeToolName);
    }
    this.activeToolName = toolName;
    this.toolGroup.setToolActive(toolName, {
      bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
    });
  }

  changeOrientation(event: any) {
    const selectedValue = event?.target?.value;
    const viewport = this.renderingEngine.getViewport('CT_AXIAL');

    // TODO -> Maybe we should rename sliceNormal to viewPlaneNormal everywhere?
    let viewUp;
    let viewPlaneNormal;

    switch (selectedValue) {
      case 'AXIAL':
        viewUp = ORIENTATION['AXIAL'].viewUp;
        viewPlaneNormal = ORIENTATION['AXIAL'].sliceNormal;
        break;
      case 'SAGITTAL':
        viewUp = ORIENTATION['SAGITTAL'].viewUp;
        viewPlaneNormal = ORIENTATION['SAGITTAL'].sliceNormal;

        break;
      case 'CORONAL':
        viewUp = ORIENTATION['CORONAL'].viewUp;
        viewPlaneNormal = ORIENTATION['CORONAL'].sliceNormal;

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
