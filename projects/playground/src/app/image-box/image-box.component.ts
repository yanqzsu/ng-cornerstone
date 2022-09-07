import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  RenderingEngine,
  setVolumesForViewports,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import {
  createImageIdsAndCacheMetaData,
  setCtTransferFunctionForVolumeActor,
} from '../core/load';
import { ORIENTATION } from '@cornerstonejs/core/dist/esm/constants';
import { ToolEnum } from '../tool-group/tool.config';
import { ToolGroupComponent } from '../tool-group/tool-group.component';
import { OrientationEnum } from '../core/constants';
import { ViewportComponent } from '../viewport/viewport.component';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types/IViewport';

export interface ImageInfo {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  wadoRsRoot: string;
  viewportType: ViewportType;
  volumeId: string;
}
export type ViewportConfig = Omit<PublicViewportInput, 'element'>;

@Component({
  selector: 'app-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  imageInfo!: ImageInfo;
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:VOLUME_ID`; // VolumeId with loader id + volume id
  renderingEngineId = 'myRenderingEngine';
  renderingEngine: RenderingEngine;

  @ViewChild(ToolGroupComponent)
  toolGroupComponent?: ToolGroupComponent;
  toolGroupId = 'MY_TOOLGROUP_ID';
  toolList = [
    ToolEnum.StackScrollTool,
    ToolEnum.PanTool,
    ToolEnum.ZoomTool,
    ToolEnum.WindowLevelTool,
    ToolEnum.ArrowAnnotateTool,
    ToolEnum.LengthTool,
    ToolEnum.AngleTool,
    ToolEnum.RectangleROITool,
    ToolEnum.EllipticalROITool,
    ToolEnum.TrackballRotateTool,
    ToolEnum.Rotate,
    ToolEnum.FlipV,
    ToolEnum.FlipH,
    ToolEnum.Reset,
  ];

  @ViewChildren(ViewportComponent)
  viewports!: QueryList<ViewportComponent>;
  viewportIds: string[];
  focusedViewportId: string = '';
  viewportConfigs: ViewportConfig[] = [
    {
      viewportId: 'VIEWPORT_ID_1',
      type: ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: ORIENTATION[OrientationEnum.AXIAL],
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId: 'VIEWPORT_ID_3',
      type: ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: ORIENTATION[OrientationEnum.SAGITTAL],
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId: 'VIEWPORT_ID_3',
      type: ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: ORIENTATION[OrientationEnum.CORONAL],
        background: <Types.Point3>[0, 0, 0],
      },
    },
  ];

  private volumeRefreshSubject = new Subject<ImageInfo>();

  constructor() {
    this.renderingEngine = new RenderingEngine(this.renderingEngineId);
    this.viewportIds = this.viewportConfigs.map((config) => config.viewportId!);
    this.focusedViewportId = this.viewportIds[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo } = changes;
    if (imageInfo) {
      this.volumeRefreshSubject.next(this.imageInfo!);
    }
  }

  ngAfterViewInit(): void {
    const viewportInputArray: PublicViewportInput[] = this.viewports.map(
      (component) => {
        return {
          ...this.viewportConfigs.find(
            (value) => value.viewportId === component.viewportId,
          ),
          element: component.element.nativeElement,
        } as PublicViewportInput;
      },
    );
    this.renderingEngine.setViewports(viewportInputArray);

    this.volumeRefreshSubject.subscribe(async (value) => {
      console.warn('volume load');
      const imageIds = await createImageIdsAndCacheMetaData(value);
      const volumeID = `${this.volumeLoaderScheme}:${value.volumeId}`;
      const volume = await volumeLoader.createAndCacheVolume(volumeID, {
        imageIds,
      });
      volume['load']();
      await setVolumesForViewports(
        this.renderingEngine,
        [
          {
            volumeId: volumeID,
            callback: setCtTransferFunctionForVolumeActor,
          },
        ],
        this.viewportIds,
        true,
      );
    });
    this.volumeRefreshSubject.next(this.imageInfo);
  }

  ngOnInit(): void {}

  focusViewport(viewportId: string) {
    this.focusedViewportId = viewportId;
  }
}
