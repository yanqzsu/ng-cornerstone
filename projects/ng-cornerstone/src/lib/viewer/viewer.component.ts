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
  AfterViewInit,
} from '@angular/core';
import { Enums as csCoreEnum, imageLoader, Types, volumeLoader } from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';

import { BehaviorSubject, combineLatest, debounceTime, filter, map, Subject } from 'rxjs';

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
export class ViewerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  Layout = LayoutEnum;
  toolGroupId = 'TOOL_GROUP_ID';
  viewportInputs: Partial<Types.PublicViewportInput>[] = [];
  activeViewportId: string = '';

  private resizeObserver!: ResizeObserver;
  private resizeSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  // 跟踪需要渲染的状态
  private pendingImageRender$ = new BehaviorSubject<boolean>(false);
  private pendingSegmentRender$ = new BehaviorSubject<boolean>(false);

  // 跟踪已初始化的viewport
  private initializedViewports = new Set<string>();
  private viewportsToInit = new Set<string>();
  private viewportInitialized$ = new BehaviorSubject<string>('');
  private viewportDestroyed$ = new Subject<string>();

  // 跟踪viewport是否全部已初始化
  private allViewportsInitialized$ = new BehaviorSubject<boolean>(false);

  // 跟踪工具栏是否已初始化
  private toolbarInitialized$ = new BehaviorSubject<boolean>(false);

  // 跟踪所有组件（工具栏和视口）是否都已初始化
  private allComponentsInitialized$ = new BehaviorSubject<boolean>(false);

  // 跟踪上一次的viewportType
  private previousViewportType?: csCoreEnum.ViewportType;

  @Input()
  layout?: LayoutEnum;

  @Input()
  imageInfo?: ImageInfo;

  @Input()
  segmentInfo?: ImageInfo;

  // 新增加的属性：用于存储已加载的图像和分段信息
  loadedImageInfo?: ImageInfo;
  loadedSegmentInfo?: ImageInfo;

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
    // 初始化时记录当前的viewportType
    this.initResizeObserver();
    this.previousViewportType = this.imageInfo?.viewportType;
    this.initComponentsTracking();
    // this.generateViewports();

    // 设置初始化标志，等待viewport初始化后再渲染
    if (this.imageInfo) {
      this.pendingImageRender$.next(true);
    }

    if (this.segmentInfo) {
      this.pendingSegmentRender$.next(true);
    }
  }

  ngAfterViewInit(): void {
    // ViewChild已经完成初始化
    if (this.toolBarComponent) {
      // 订阅工具栏的初始化事件
      this.toolBarComponent.toolbarInit.pipe(takeUntil(this.destroy$)).subscribe(() => {
        console.debug('Toolbar initialized');
        this.toolbarInitialized$.next(true);
      });

      // 订阅工具栏的销毁事件
      this.toolBarComponent.toolbarDestroy.pipe(takeUntil(this.destroy$)).subscribe(() => {
        console.debug('Toolbar destroyed');
        this.toolbarInitialized$.next(false);
      });
    } else {
      console.warn('ToolBarComponent not found in view children');
    }
  }

  private initResizeObserver(): void {
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

  private initComponentsTracking(): void {
    // 初始化视口跟踪
    this.initViewportTracking();

    // 监听工具栏初始化状态变化
    this.toolbarInitialized$.pipe(takeUntil(this.destroy$)).subscribe((initialized) => {
      if (initialized && this.toolBarComponent) {
        // 当toolbar初始化后，注册所有已初始化的viewport
        console.debug(`Toolbar initialized, registering all viewports`);
        this.initializedViewports.forEach((viewportId) => {
          this.toolBarComponent.registerViewport(viewportId);
        });
      }
    });

    // 监听工具栏和视口的初始化状态
    combineLatest([this.toolbarInitialized$, this.allViewportsInitialized$])
      .pipe(
        takeUntil(this.destroy$),
        map(([toolbarInitialized, viewportsInitialized]) => toolbarInitialized && viewportsInitialized),
      )
      .subscribe((allInitialized) => {
        console.debug(`All components initialized: ${allInitialized}`);
        this.allComponentsInitialized$.next(allInitialized);
      });

    // 当所有组件都初始化完成且有待处理的渲染任务时执行渲染
    combineLatest([this.allComponentsInitialized$, this.pendingImageRender$, this.pendingSegmentRender$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([allInitialized, pendingImage, pendingSegment]) => allInitialized && (pendingImage || pendingSegment)),
      )
      .subscribe(([_, pendingImage, pendingSegment]) => {
        console.debug('All components ready, processing pending renders');
        if (pendingImage && this.imageInfo) {
          this.loadedImageInfo = undefined;
          this.loadedSegmentInfo = undefined;
          segmentation.state.removeAllSegmentations();
          this.retrieveImage(false);
          this.pendingImageRender$.next(false);
        }

        if (pendingSegment && this.segmentInfo) {
          this.loadedSegmentInfo = undefined;
          segmentation.state.removeAllSegmentations();
          this.retrieveImage(true);
          this.pendingSegmentRender$.next(false);
        }
      });
  }

  private initViewportTracking(): void {
    // 处理viewport初始化事件
    this.viewportInitialized$.pipe(takeUntil(this.destroy$)).subscribe((viewportId) => {
      console.debug(`Viewport initialized: ${viewportId}`);
      this.initializedViewports.add(viewportId);

      // 如果toolbar已初始化，直接注册viewport
      if (this.toolbarInitialized$.value && this.toolBarComponent) {
        this.toolBarComponent.registerViewport(viewportId);
      }

      this.checkAllViewportsInitialized();
    });

    // 处理viewport销毁事件
    this.viewportDestroyed$.pipe(takeUntil(this.destroy$)).subscribe((viewportId) => {
      console.debug(`Viewport destroyed: ${viewportId}`);
      this.initializedViewports.delete(viewportId);
      this.viewportsToInit.delete(viewportId);

      // 仅当toolbar已初始化时才注销viewport
      if (this.toolbarInitialized$.value && this.toolBarComponent) {
        this.toolBarComponent.unregisterViewport(viewportId);
      }

      this.checkAllViewportsInitialized();
    });
  }

  private checkAllViewportsInitialized(): void {
    const allInitialized =
      this.viewportsToInit.size > 0 && this.initializedViewports.size === this.viewportsToInit.size;
    console.debug(`Checking viewports initialized: ${this.initializedViewports.size}/${this.viewportsToInit.size}`);
    this.allViewportsInitialized$.next(allInitialized);

    // 设置默认的active viewport，如果所有viewport都初始化完成且尚未设置
    if (allInitialized && !this.activeViewportId && this.viewportIds.length > 0) {
      this.activeViewportId = this.viewportIds[0];
      this.cdr.detectChanges();
    }
  }

  onViewportInit(viewportId: string) {
    console.debug('Viewport initialized event received:', viewportId);
    this.viewportInitialized$.next(viewportId);
  }

  onViewportDestroy(viewportId: string) {
    console.debug('Viewport destroyed event received:', viewportId);
    this.viewportDestroyed$.next(viewportId);
  }

  onToolbarInit() {
    console.debug('ToolBar initialized event received');
    this.toolbarInitialized$.next(true);
    // 注册逻辑已移到toolbarInitialized$订阅中处理
  }

  onToolbarDestroy() {
    console.debug('ToolBar destroyed event received');
    this.toolbarInitialized$.next(false);
    // 销毁逻辑已移到toolbarInitialized$订阅中处理
  }

  generateViewports() {
    // 重置viewport跟踪
    this.initializedViewports.clear();
    this.viewportsToInit.clear();
    this.allViewportsInitialized$.next(false);

    if (this.layout !== undefined && this.imageInfo?.viewportType) {
      const suffix = generateRandomString();
      this.viewportInputs = generateViewportInputs(this.layout, suffix, this.imageInfo);
      this.viewportInputs.forEach((viewport) => {
        if (viewport.viewportId) {
          this.viewportsToInit.add(viewport.viewportId);
        }
      });
      // Reset activeViewportId
      this.activeViewportId = '';
    }
    console.debug(`Generated ${this.viewportsToInit.size} viewports to initialize`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo, segmentInfo, layout } = changes;
    let viewportTypeChanged = false;

    // 检查imageInfo的viewportType是否变更
    if (imageInfo && this.imageInfo) {
      const currentViewportType = this.imageInfo.viewportType;

      // 使用SimpleChanges提供的previousValue和currentValue进行比较
      if (imageInfo.previousValue?.viewportType !== imageInfo.currentValue?.viewportType) {
        viewportTypeChanged = true;
      }
      // 如果SimpleChanges没有提供足够信息，使用我们自己跟踪的previousViewportType
      else if (this.previousViewportType !== currentViewportType) {
        viewportTypeChanged = true;
      }

      // 更新记录的viewportType
      this.previousViewportType = currentViewportType;
    }

    // 布局发生变化或viewportType变更时重新生成viewport
    if ((layout && !layout.isFirstChange()) || viewportTypeChanged) {
      console.debug(`Layout or ViewportType changed, regenerating viewports`);
      this.generateViewports();

      // 设置标志表示需要在viewport初始化后渲染
      if (this.imageInfo) {
        this.pendingImageRender$.next(true);
      }
      if (this.segmentInfo) {
        this.pendingSegmentRender$.next(true);
      }
    } else {
      // 其他变化情况处理
      if (imageInfo && this.imageInfo) {
        this.pendingImageRender$.next(true);
      }

      if (segmentInfo && this.segmentInfo) {
        this.pendingSegmentRender$.next(true);
      }

      // 如果所有组件已初始化，触发状态检查以执行渲染
      if (this.allComponentsInitialized$.value) {
        // 重新检查所有组件的初始化状态
        this.checkAllViewportsInitialized();
      }
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
          // 更新 loadedSegmentInfo 而不是直接修改输入的 segmentInfo
          this.loadedSegmentInfo = { ...imageInfo!, imageIds: derivedSegmentationImageIds };
        } else {
          // 更新 loadedImageInfo 而不是直接修改输入的 imageInfo
          this.loadedImageInfo = { ...imageInfo!, volumeId, imageIds };
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
        // 更新 loadedSegmentInfo 而不是直接修改输入的 segmentInfo
        this.loadedSegmentInfo = { ...imageInfo!, imageIds: derivedSegmentationImageIds };
      } else {
        // 更新 loadedImageInfo 而不是直接修改输入的 imageInfo
        this.loadedImageInfo = { ...imageInfo!, imageIds };
      }

      this.cdr.detectChanges();
      this.imageLoaded.emit();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
    console.debug('viewer destroyed');
  }
}
