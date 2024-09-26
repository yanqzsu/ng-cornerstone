import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  CONSTANTS,
  Enums as csCoreEnum,
  setVolumesForViewports,
  Types,
  utilities,
  volumeLoader,
} from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';

import { BehaviorSubject, combineLatest, Subject } from 'rxjs';

import { ToolBarComponent, ToolEnum } from '../tool';
import { CornerstoneService, ctVoiRange, ImageIdService, ImageInfo, imageInfoToVolumeId, RequestSchema } from '../core';
import { takeUntil } from 'rxjs/operators';
import { ViewportComponent } from '../viewport/viewport.component';
import { SegmentationPublicInput } from '@cornerstonejs/tools/dist/types/types/SegmentationStateTypes';

@Component({
  selector: 'nc-viewer',
  exportAs: 'ncViewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  static readonly ORTHOGRAPHIC_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
    {
      viewportId: 'viewport-mpr-1',
      type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: csCoreEnum.OrientationAxis.CORONAL,
      },
    },
    {
      viewportId: 'viewport-mpr-2',
      type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: csCoreEnum.OrientationAxis.AXIAL,
      },
    },
    {
      viewportId: 'viewport-mpr-3',
      type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: csCoreEnum.OrientationAxis.SAGITTAL,
      },
    },
  ];
  static readonly VOLUME_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
    {
      viewportId: 'viewport-volume-1',
      type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: csCoreEnum.OrientationAxis.CORONAL,
      },
    },
    {
      viewportId: 'viewport-volume-2',
      type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: csCoreEnum.OrientationAxis.AXIAL,
      },
    },
    {
      viewportId: 'viewport-volume-3',
      type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: csCoreEnum.OrientationAxis.SAGITTAL,
      },
    },
    {
      viewportId: 'viewport--volume-3d',
      type: csCoreEnum.ViewportType.VOLUME_3D,
      defaultOptions: {
        // background: CONSTANTS.BACKGROUND_COLORS.slicer3D as Types.RGB,
        background: <Types.Point3>[0.2, 0, 0.2],
      },
    },
  ];
  static readonly STACK_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
    {
      viewportId: 'viewport-stack',
      type: csCoreEnum.ViewportType.STACK,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
      },
    },
  ];
  VIEWPORT_TYPE_ENUM = csCoreEnum.ViewportType;

  private volumeRefreshSubject = new BehaviorSubject<ImageInfo | undefined>(undefined);
  private segmentRefreshSubject = new BehaviorSubject<ImageInfo | undefined>(undefined);
  private destroy$ = new Subject();

  viewportType?: csCoreEnum.ViewportType;
  viewportInputs: Partial<Types.PublicViewportInput>[] = [];
  viewportReadySet = new Set<string>();
  activeViewportId: string = '';

  volumeId?: string;
  segmentId?: string;

  @Input()
  imageInfo?: ImageInfo;

  @Input()
  segmentInfo?: ImageInfo;

  @ViewChild(ToolBarComponent)
  toolBarComponent!: ToolBarComponent;

  @ViewChildren(ViewportComponent)
  imageBoxComponentList!: QueryList<ViewportComponent>;

  @Input()
  toolList: ToolEnum[] = [];

  get renderingEngine() {
    return this.csService.getRenderingEngine();
  }

  get viewportIds() {
    return this.viewportInputs.map((value) => value.viewportId!);
  }

  constructor(
    private imageIdService: ImageIdService,
    private csService: CornerstoneService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.csService.viewportReady$.pipe(takeUntil(this.destroy$)).subscribe(async (viewportId: string) => {
      this.viewportReadySet.add(viewportId);
      if (this.viewportIds.every((id) => this.viewportReadySet.has(id))) {
        console.log('All viewports are ready');
        this.activeViewportId = this.viewportIds?.[0] ?? '';
        await this.renderAll();
        this.cdr.detectChanges();
      }
    });

    combineLatest([this.volumeRefreshSubject, this.segmentRefreshSubject])
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ([imageInfo, segmentInfo]) => {
        if (imageInfo && imageInfo.viewportType !== this.viewportType) {
          this.updateViewports(imageInfo.viewportType);
        } else {
          await this.renderAll();
        }
      });
  }

  async renderAll() {
    if (this.imageInfo) {
      await this.retrieveImage(this.imageInfo);
      await this.renderingVolume(this.imageInfo);
    }
    if (this.imageInfo && this.segmentInfo) {
      await this.retrieveImage(this.segmentInfo);
      await this.renderingSegment(this.segmentInfo);
    }
  }

  updateViewports(viewportType: csCoreEnum.ViewportType) {
    if (viewportType !== this.viewportType) {
      this.viewportType = viewportType;
      if (viewportType === csCoreEnum.ViewportType.STACK) {
        this.viewportInputs = [...ViewerComponent.STACK_VIEWPORT_INPUTS];
      } else if (viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC) {
        this.viewportInputs = [...ViewerComponent.ORTHOGRAPHIC_VIEWPORT_INPUTS];
      } else if (viewportType === csCoreEnum.ViewportType.VOLUME_3D) {
        this.viewportInputs = [...ViewerComponent.VOLUME_VIEWPORT_INPUTS];
      }
      this.viewportReadySet.clear();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo, segmentInfo } = changes;
    if (imageInfo && this.imageInfo) {
      this.volumeRefreshSubject.next(this.imageInfo);
    }
    if (segmentInfo && this.segmentInfo) {
      this.segmentRefreshSubject.next(this.segmentInfo);
    }
  }

  onViewportClick(viewportId: string | undefined) {
    if (viewportId) {
      this.activeViewportId = viewportId;
    }
  }

  async retrieveImage(imageInfo: ImageInfo | undefined): Promise<void> {
    if (!imageInfo) {
      return;
    }
    if (imageInfo.schema === RequestSchema.wadoRs) {
      const imageIds = await this.imageIdService.wadoRsCreateImageIdsAndCacheMetaData(imageInfo);
      if (imageInfo.viewportType === csCoreEnum.ViewportType.STACK) {
        await this.retrieveAndRenderingStack(imageIds);
      } else {
        const volumeId = imageInfoToVolumeId(imageInfo);
        const volume = await volumeLoader.createAndCacheVolume(volumeId, {
          imageIds,
        });
        volume['load']();
      }
    } else if (imageInfo.schema === RequestSchema.nifti) {
      if (imageInfo.viewportType === csCoreEnum.ViewportType.STACK) {
        console.error('Nifti dont support stack view');
      } else if (
        imageInfo.viewportType === csCoreEnum.ViewportType.VOLUME_3D ||
        imageInfo.viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC
      ) {
        const volumeId = imageInfoToVolumeId(imageInfo);
        const volume = await volumeLoader.createAndCacheVolume(volumeId);
        volume['load']();
      }
    } else {
      console.error('Unsupported request schema');
    }
  }

  async retrieveAndRenderingStack(imageIds: string[]) {
    const setStackPromises = this.viewportIds.map(async (viewportId) => {
      const viewport = this.renderingEngine.getViewport(viewportId) as Types.IStackViewport;
      await viewport.setStack(imageIds);
      // Set the VOI of the stack
      viewport.setProperties({ voiRange: ctVoiRange });
    });
    await Promise.all(setStackPromises);
  }

  async renderingVolume(imageInfo: ImageInfo | undefined) {
    if (!imageInfo) {
      return;
    }
    const volumeId = imageInfoToVolumeId(imageInfo);
    if (!!volumeId) {
      const volume3dViewportIds = this.viewportInputs
        ?.filter((viewport) => viewport.type === csCoreEnum.ViewportType.VOLUME_3D)
        .map((viewport) => viewport.viewportId!);
      if (volume3dViewportIds && volume3dViewportIds?.length !== 0) {
        await setVolumesForViewports(this.renderingEngine, [{ volumeId }], volume3dViewportIds as Array<string>);
        volume3dViewportIds.forEach((viewportId) => {
          const volumeActor = this.renderingEngine.getViewport(viewportId).getDefaultActor().actor as Types.VolumeActor;
          utilities.applyPreset(
            volumeActor,
            CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Chest-Contrast-Enhanced')!,
          );
        });
      }
      const orthographicViewportIds = this.viewportInputs
        ?.filter((viewport) => viewport.type === csCoreEnum.ViewportType.ORTHOGRAPHIC)
        .map((viewport) => viewport.viewportId!);
      if (orthographicViewportIds && orthographicViewportIds?.length !== 0) {
        await setVolumesForViewports(
          this.renderingEngine,
          [
            {
              volumeId,
            },
          ],
          orthographicViewportIds,
        );
      }
    }
  }

  async renderingSegment(segmentInfo: ImageInfo | undefined) {
    if (!segmentInfo) {
      return;
    }
    const segmentationId = imageInfoToVolumeId(segmentInfo);
    if (segmentationId && !!segmentInfo?.segmentType) {
      const existSegmentation = segmentation.state.getSegmentation(segmentationId);
      if (existSegmentation) {
        // existSegmentation.
      } else {
        segmentation.addSegmentations([
          {
            segmentationId: segmentationId,
            representation: {
              type: segmentInfo.segmentType,
              data: {
                volumeId: segmentationId,
              },
            },
          } as SegmentationPublicInput,
        ]);
      }
      // TODO: only labelmap now
      if (segmentInfo.segmentType === csToolEnum.SegmentationRepresentations.Labelmap) {
        await this.toolBarComponent.addSegmentationRepresentations(segmentationId, segmentInfo!.segmentType!);
      } else {
        console.warn('Surface segment is not support yet');
      }
    } else {
      console.error('Nifti dont support stack view');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    console.debug('viewer destroyed');
  }
}
