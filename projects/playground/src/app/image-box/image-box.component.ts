import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  SegmentationDisplayTool,
  ToolGroupManager,
  Enums as ToolsEnums,
  segmentation,
  RectangleScissorsTool,
  SphereScissorsTool,
  CircleScissorsTool,
  BrushTool,
  PanTool,
  ZoomTool,
  StackScrollMouseWheelTool,
  WindowLevelTool,
} from '@cornerstonejs/tools';

import {
  initDemo,
  createImageIdsAndCacheMetaData,
  setCtTransferFunctionForVolumeActor,
} from '../init';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';
import StackScrollTool from '@cornerstonejs/tools/dist/esm/tools/StackScrollTool';

@Component({
  selector: 'app-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements OnInit {
  title = 'playground';

  volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:${this.volumeName}`; // VolumeId with loader id + volume id
  segmentationId = 'MY_SEGMENTATION_ID';
  toolGroupId = 'MY_TOOLGROUP_ID';
  toolGroup: IToolGroup;
  toolList = [StackScrollTool, PanTool, ZoomTool, WindowLevelTool];
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
    Promise.resolve(initDemo())
      .then(() => {
        this.toolList.forEach((value) => {
          addTool(value);
          this.toolGroup.addTool(value.toolName);
          // this.toolGroup.setToolActive(value.toolName, {
          //   bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
          // });
        });
        return createImageIdsAndCacheMetaData({
          StudyInstanceUID:
            '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
          SeriesInstanceUID:
            '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
          wadoRsRoot: 'https://d1qmxk7r72ysft.cloudfront.net/dicomweb',
          type: 'VOLUME',
        });
      })
      .then((imageIds) => {
        return volumeLoader.createAndCacheVolume(this.volumeId, {
          imageIds,
        });
      })
      .then((volume) => {
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

        // Set the volume to load
        volume['load']();
        return setVolumesForViewports(
          this.renderingEngine,
          [
            {
              volumeId: this.volumeId,
              callback: setCtTransferFunctionForVolumeActor,
            },
          ],
          [viewportId1, viewportId2, viewportId3],
        );
      })
      .then(() => {
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
}
