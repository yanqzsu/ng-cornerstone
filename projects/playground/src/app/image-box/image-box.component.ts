import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
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
import { OrientationEnum } from '../core/config/constants';
import { ViewportComponent } from '../viewport/viewport.component';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types/IViewport';
import setStacksForViewports from '../core/load/setStackForViewports';
import { ImageInfo } from '../core/config/type';

export type ViewportConfig = Omit<PublicViewportInput, 'element'>;

@Component({
  selector: 'app-image-box',
  templateUrl: './image-box.component.html',
  styleUrls: ['./image-box.component.scss'],
})
export class ImageBoxComponent implements AfterViewInit, OnChanges {
  @Input()
  imageInfo?: ImageInfo;
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
    ToolEnum.Previous,
    ToolEnum.Next,
    ToolEnum.FlipV,
    ToolEnum.FlipH,
    ToolEnum.Reset,
  ];

  @ViewChildren(ViewportComponent)
  viewports!: QueryList<ViewportComponent>;
  viewportType: ViewportType;
  viewportIds: string[] = [];
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
      viewportId: 'VIEWPORT_ID_2',
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
    {
      viewportId: 'VIEWPORT_ID_5',
      type: ViewportType.STACK,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
      },
    },
  ];

  private volumeRefreshSubject = new Subject<ImageInfo>();

  constructor(private cdr: ChangeDetectorRef) {
    this.renderingEngine = new RenderingEngine(this.renderingEngineId);
    this.viewportType = ViewportType.ORTHOGRAPHIC;
    this.viewportIds = this.viewportConfigs.map((config) => config.viewportId);
    this.focusedViewportId = this.viewportIds[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo } = changes;
    if (imageInfo && this.imageInfo) {
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
      this.viewportType = value.viewportType;
      this.cdr.detectChanges();
      const viewportIds = this.viewportConfigs
        .filter((config) => config.type === value.viewportType)
        .map((value) => value.viewportId);
      const imageIds = await createImageIdsAndCacheMetaData(value);
      if (value.viewportType === ViewportType.ORTHOGRAPHIC) {
        const volumeID = `${this.volumeLoaderScheme}:${value.volumeId}`;
        const volume = await volumeLoader.createAndCacheVolume(volumeID, {
          imageIds,
        });
        volume['load']();
        console.log('ORTHOGRAPHIC');
        await setVolumesForViewports(
          this.renderingEngine,
          [
            {
              volumeId: volumeID,
              callback: setCtTransferFunctionForVolumeActor,
            },
          ],
          viewportIds,
          true,
        );
      } else if (value.viewportType === ViewportType.STACK) {
        // const viewport = this.renderingEngine.getViewport(
        //   viewportIds[0],
        // ) as IStackViewport;
        // // this.renderingEngine.enableElement(viewport);
        // await viewport.setStack(imageIds, 0);
        // // Set the VOI of the stack
        // viewport.setProperties({ voiRange: ctVoiRange });
        // // Render the image
        // viewport.render();
        await setStacksForViewports(
          this.renderingEngine,
          viewportIds,
          imageIds,
          0,
        );
      }
    });
  }

  focusViewport(viewportId: string) {
    this.focusedViewportId = viewportId;
  }
}
