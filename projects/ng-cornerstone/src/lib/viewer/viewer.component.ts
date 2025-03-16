import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  Output,
  EventEmitter,
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

import { BehaviorSubject, combineLatest, debounceTime, Subject } from 'rxjs';

import { ToolBarComponent, ToolEnum } from '../tool';
import {
  CornerstoneService,
  ctVoiRange,
  generateRandomString,
  generateViewportInputs,
  ImageIdService,
  ImageInfo,
  imageInfoToVolumeId,
  LayoutEnum,
  RequestSchema,
} from '../core';
import { takeUntil } from 'rxjs/operators';
import { ViewportComponent } from '../viewport/viewport.component';
import { SegmentationPublicInput } from '@cornerstonejs/tools/dist/esm/types';
import { createNiftiImageIdsAndCacheMetadata } from '@cornerstonejs/nifti-volume-loader';

@Component({
  selector: 'nc-viewer',
  exportAs: 'ncViewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  static readonly TOOL_GROUP_ID = 'TOOL_GROUP_ID';

  Layout = LayoutEnum;

  private volumeRefreshSubject = new BehaviorSubject<ImageInfo | undefined>(undefined);
  private segmentRefreshSubject = new BehaviorSubject<ImageInfo | undefined>(undefined);
  private destroy$ = new Subject();

  toolGroupId = '';

  viewportType?: csCoreEnum.ViewportType;
  viewportInputs: Partial<Types.PublicViewportInput>[] = [];
  viewportReadySet = new Set<string>();
  activeViewportId: string = '';

  volumeId?: string;
  segmentId?: string;
  resizeObserver!: ResizeObserver;
  private resizeSubject = new Subject<void>();
  private suffix: string = '';
  private toolInitialized = false;

  @Input()
  layout?: LayoutEnum;

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

  @Output() viewportActivated = new EventEmitter<string>();
  @Output() volumeLoaded = new EventEmitter<void>();

  get renderingEngine() {
    return this.csService.getRenderingEngine();
  }

  get viewportIds() {
    return this.viewportInputs.map((value) => value.viewportId!);
  }

  constructor(
    private elementRef: ElementRef,
    private imageIdService: ImageIdService,
    private csService: CornerstoneService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.suffix = generateRandomString();
    this.toolGroupId = ViewerComponent.TOOL_GROUP_ID + this.suffix;
    this.generateViewports();
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.resizeSubject.next();
      }
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
    // 使用 debounceTime 添加防抖
    this.resizeSubject
      .pipe(
        debounceTime(300), // 防抖时间设置为 300ms
        takeUntil(this.destroy$), // 组件销毁时取消订阅
      )
      .subscribe(() => {
        const renderingEngine = this.csService.getRenderingEngine();
        if (renderingEngine) {
          // const presentations = viewports.map((viewport) => viewport.getViewPresentation());
          renderingEngine.resize(true, false);
          // viewports.forEach((viewport, idx) => {
          //   viewport.setViewPresentation(presentations[idx]);
          // });
        }
      });

    combineLatest([this.volumeRefreshSubject, this.segmentRefreshSubject])
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ([imageInfo, segmentInfo]) => {
        if (this.viewportReadySet?.size > 0) {
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
    this.renderingEngine.renderViewports(this.viewportIds);
  }

  onToolbarInit() {
    this.toolInitialized = true;
    if (this.viewportIds?.length > 0 && this.viewportIds.every((id) => this.viewportReadySet.has(id))) {
      this.viewportReadySet.forEach((viewportId) => {
        this.toolBarComponent.registerViewport(viewportId);
      });
    }
  }

  onViewportInit(viewportId: string) {
    this.viewportReadySet.add(viewportId);
    if (this.viewportIds?.length > 0 && this.viewportIds.every((id) => this.viewportReadySet.has(id))) {
      console.debug('All viewports are ready');
      this.activeViewportId = this.viewportIds?.[0] ?? '';
      if (this.toolInitialized) {
        this.toolBarComponent.registerViewport(viewportId);
      }
      this.renderAll();
    }
  }

  onViewportDestroy(viewportId: string) {
    this.viewportReadySet.delete(viewportId);
    if (this.toolInitialized) {
      this.toolBarComponent.unregisterViewport(viewportId);
    }
  }

  generateViewports() {
    if (this.layout !== undefined) {
      this.viewportReadySet.clear();
      this.viewportInputs = generateViewportInputs(this.layout, this.suffix);
    } else {
      this.viewportReadySet.clear();
      this.viewportInputs = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo, segmentInfo, layout } = changes;
    if (imageInfo && this.imageInfo) {
      this.volumeRefreshSubject.next(this.imageInfo);
    }
    if (segmentInfo && this.segmentInfo) {
      this.segmentRefreshSubject.next(this.segmentInfo);
    }
    if (layout && !layout.isFirstChange) {
      this.generateViewports();
    }
  }

  onViewportClick(viewportId: string | undefined) {
    if (viewportId) {
      this.activeViewportId = viewportId;
      this.viewportActivated.emit(viewportId);
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
        volume.load();
      }
    } else if (imageInfo.schema === RequestSchema.nifti) {
      if (imageInfo.viewportType === csCoreEnum.ViewportType.STACK) {
        console.error("Nifti don't support stack view");
      } else if (
        imageInfo.viewportType === csCoreEnum.ViewportType.VOLUME_3D ||
        imageInfo.viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC
      ) {
        // similar to the rest of the cornerstone3D image loader
        const imageIds = await createNiftiImageIdsAndCacheMetadata({ url: imageInfo.urlRoot });
        // For stack viewports
        // viewport.setStack(imageIds);
        const volumeId = imageInfoToVolumeId(imageInfo);
        const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds });
        await volume.load();
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
    this.resizeObserver.disconnect();
    this.viewportReadySet.clear();
    this.destroy$.next(null);
    this.destroy$.complete();
    console.debug('viewer destroyed');
  }
}
