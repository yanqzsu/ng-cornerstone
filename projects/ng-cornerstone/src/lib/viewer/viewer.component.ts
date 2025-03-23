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
import { Enums as csCoreEnum, imageLoader, Types, volumeLoader } from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';

import { debounceTime, Subject } from 'rxjs';

import { ToolBarComponent, ToolEnum } from '../tool';
import {
  CornerstoneService,
  generateRandomString,
  generateViewportInputs,
  ImageIdService,
  ImageInfo,
  imageInfoToUniqueId,
  LayoutEnum,
  RequestSchema,
} from '../core';
import { takeUntil } from 'rxjs/operators';
import { BaseViewportComponent } from '../viewport';
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

  private destroy$ = new Subject();

  toolGroupId = '';

  viewportType?: csCoreEnum.ViewportType;
  viewportInputs: Partial<Types.PublicViewportInput>[] = [];
  activeViewportId: string = '';

  volumeId?: string;
  segmentId?: string;
  resizeObserver!: ResizeObserver;
  private resizeSubject = new Subject<void>();
  private suffix: string = '';
  private toolInitialized = false;
  private initializedViewportIds = new Set<string>();

  @Input()
  layout?: LayoutEnum;

  @Input()
  imageInfo?: ImageInfo;

  @Input()
  segmentInfo?: ImageInfo;

  @ViewChild(ToolBarComponent)
  toolBarComponent!: ToolBarComponent;

  @ViewChildren(BaseViewportComponent)
  viewportComponentList!: QueryList<BaseViewportComponent>;

  @Input()
  toolList: ToolEnum[] = [];

  @Output() viewportActivated = new EventEmitter<string>();
  @Output() imageLoaded = new EventEmitter<void>();

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
    // Add debounce time
    this.resizeSubject
      .pipe(
        debounceTime(300), // Set debounce time to 300ms
        takeUntil(this.destroy$), // Unsubscribe when component is destroyed
      )
      .subscribe(() => {
        const renderingEngine = this.csService.getRenderingEngine();
        if (renderingEngine) {
          renderingEngine.resize(true, false);
        }
      });
  }

  onToolbarInit() {
    this.toolInitialized = true;
    // Register all initialized viewports
    if (this.initializedViewportIds.size > 0) {
      this.initializedViewportIds.forEach((viewportId) => {
        this.toolBarComponent.registerViewport(viewportId);
      });
    }
  }

  onToolbarDestroy() {
    this.toolInitialized = false;
    // Unregister all viewports
    this.initializedViewportIds.forEach((viewportId) => {
      this.toolBarComponent.unregisterViewport(viewportId);
    });
  }

  onViewportInit(viewportId: string) {
    // Record viewport as initialized
    this.initializedViewportIds.add(viewportId);

    // Check if all viewports are initialized
    const allViewportsReady = this.viewportIds.every((id) => this.initializedViewportIds.has(id));

    if (this.viewportIds.length > 0 && allViewportsReady) {
      console.debug('All viewports are ready');

      // Set default active viewport
      if (!this.activeViewportId) {
        this.activeViewportId = this.viewportIds[0];
      }

      // Register viewport if toolbar is initialized
      if (this.toolInitialized) {
        this.toolBarComponent.registerViewport(viewportId);
      }
    }
  }

  onViewportDestroy(viewportId: string) {
    // Remove viewport from initialized set
    this.initializedViewportIds.delete(viewportId);

    // Unregister viewport if toolbar is initialized
    if (this.toolInitialized) {
      this.toolBarComponent.unregisterViewport(viewportId);
    }
  }

  generateViewports() {
    if (this.layout !== undefined) {
      // Reset initialized viewport set
      this.initializedViewportIds.clear();
      this.viewportInputs = generateViewportInputs(this.layout, this.suffix, this.imageInfo);
      // Reset activeViewportId
      this.activeViewportId = '';
    } else {
      this.initializedViewportIds.clear();
      this.viewportInputs = [];
      // Reset activeViewportId
      this.activeViewportId = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo, segmentInfo, layout } = changes;

    // When imageInfo changes, regenerate viewport layout to reflect new viewportType
    if ((imageInfo && this.imageInfo) || (layout && !layout.isFirstChange())) {
      this.generateViewports();
    }

    // If imageInfo or segmentInfo changes, retrieve image data again
    if (imageInfo && this.imageInfo) {
      segmentation.state.removeAllSegmentations();
      this.retrieveImage(false);
    }
    if (segmentInfo && this.segmentInfo) {
      segmentation.state.removeAllSegmentations();
      this.retrieveImage(true);
    }

    // Change detection - refresh view
    this.cdr.detectChanges();
  }

  onViewportClick(viewportId: string | undefined) {
    if (viewportId) {
      this.activeViewportId = viewportId;
      this.viewportActivated.emit(viewportId);
    }
  }

  /**
   * Retrieve image data without rendering
   * Rendering is handled by each viewport component
   */
  async retrieveImage(isSegment: boolean = false): Promise<void> {
    const imageInfo = isSegment ? this.segmentInfo : this.imageInfo;
    if (!imageInfo) {
      return;
    }

    let imageIds: string[] = [];

    // 根据不同schema获取imageIds
    if (imageInfo.schema === RequestSchema.wadoRs) {
      imageIds = await this.imageIdService.wadoRsCreateImageIdsAndCacheMetaData(imageInfo);
    } else if (imageInfo.schema === RequestSchema.nifti) {
      imageIds = await createNiftiImageIdsAndCacheMetadata({ url: imageInfo.urlRoot });
    } else {
      console.error('Unsupported request schema');
      return;
    }

    // 准备分段和图像数据的处理函数
    const processSegmentation = async (labelImages: any[], uniqueId: string) => {
      const derivedSegmentationImages = await imageLoader.createAndCacheDerivedLabelmapImages(imageIds);
      const derivedSegmentationImageIds = derivedSegmentationImages.map((image) => image.imageId);

      // 处理标签数据
      for (let i = 0; i < derivedSegmentationImages.length; i++) {
        const voxelManager = derivedSegmentationImages[i].voxelManager!;
        const scalarData = voxelManager.getScalarData();
        const labelImage = labelImages[i];
        if (labelImage) {
          scalarData.set(labelImage.getPixelData());
          voxelManager.setScalarData(scalarData);
        }
      }

      // Check if segmentation already exists and remove it
      const existingSegmentation = segmentation.state.getSegmentation(uniqueId);
      if (existingSegmentation && segmentation.removeSegmentation) {
        segmentation.removeSegmentation(uniqueId);
      }

      // Add new segmentation
      segmentation.addSegmentations([
        {
          segmentationId: uniqueId,
          representation: {
            type: csToolEnum.SegmentationRepresentations.Labelmap,
            data: {
              imageIds: derivedSegmentationImageIds,
            },
          },
        },
      ]);

      return derivedSegmentationImageIds;
    };

    // Process data based on viewport type
    if (imageInfo.viewportType !== csCoreEnum.ViewportType.STACK) {
      // Volume rendering processing
      const volumeId = imageInfoToUniqueId(imageInfo);
      const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds });

      await volume.load(async () => {
        if (isSegment) {
          const labelImages = volume.getCornerstoneImages();
          const uniqueId = imageInfoToUniqueId(imageInfo);
          const derivedSegmentationImageIds = await processSegmentation(labelImages, uniqueId);
          this.segmentInfo = { ...imageInfo!, imageIds: derivedSegmentationImageIds };
        } else {
          this.imageInfo = { ...imageInfo!, volumeId, imageIds };
        }
        this.cdr.detectChanges();
        this.imageLoaded.emit();
      });
    } else {
      // Plane image processing
      const images = await imageLoader.loadAndCacheImages(imageIds);

      if (isSegment) {
        const uniqueId = imageInfoToUniqueId(imageInfo);
        const derivedSegmentationImageIds = await processSegmentation(await Promise.all(images), uniqueId);
        this.segmentInfo = { ...imageInfo!, imageIds: derivedSegmentationImageIds };
      } else {
        this.imageInfo = { ...imageInfo!, imageIds };
      }

      this.cdr.detectChanges();
      this.imageLoaded.emit();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.initializedViewportIds.clear();
    this.destroy$.next(null);
    this.destroy$.complete();
    console.debug('viewer destroyed');
  }
}
