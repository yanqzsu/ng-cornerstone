import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  cache,
  CONSTANTS,
  Enums as csCoreEnum,
  eventTarget,
  RenderingEngine,
  setVolumesForViewports,
  Types,
  utilities,
  volumeLoader,
} from '@cornerstonejs/core';
import { Enums as csToolEnum, segmentation } from '@cornerstonejs/tools';

import { BehaviorSubject, combineLatest, filter, ReplaySubject, Subject, switchMap } from 'rxjs';

import { ToolBarComponent, ToolEnum } from '../tool';
import { ctVoiRange, ImageIdService, ImageInfo, RequestSchema } from '../core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private renderingEngine!: RenderingEngine;
  private volumeRefreshSubject = new ReplaySubject<ImageInfo>(1);
  private segmentRefreshSubject = new ReplaySubject<ImageInfo>(1);
  private viewportReadySubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  renderingEngineId = 'RENDERING_ENGINE_ID';
  _viewportType!: csCoreEnum.ViewportType;
  viewportId = 'VIEWPORT_ID';
  viewportIds = [this.viewportId];
  viewportIdsSubject = new BehaviorSubject<string[]>([]);

  enableSegment = true;

  @Input()
  imageInfo?: ImageInfo;

  @Input()
  segmentInfo?: ImageInfo;

  @ViewChild(ToolBarComponent)
  toolBarComponent!: ToolBarComponent;

  // @ViewChildren(ImageBoxComponent)
  // imageBoxComponentList!: QueryList<ImageBoxComponent>;

  @Input()
  toolList: ToolEnum[] = [];

  @ViewChild('imageBox', { read: ElementRef, static: true })
  viewportElementRef?: ElementRef<HTMLElement>;

  constructor(private imageIdService: ImageIdService) {}

  ngAfterViewInit(): void {
    this.viewportReadySubject.next();
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

  ngOnInit(): void {
    this.renderingEngine = new RenderingEngine(this.renderingEngineId);
    this.viewportReadySubject
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          combineLatest([this.volumeRefreshSubject.pipe(filter((image) => !!image)), this.segmentRefreshSubject]).pipe(
            takeUntil(this.destroy$),
          ),
        ),
      )
      .subscribe(async ([imageInfo, segmentInfo]) => {
        if (imageInfo) {
          if (imageInfo.viewportType !== this.viewportType) {
            this.viewportType = imageInfo.viewportType;
          }
          const volumeId = await this.retrieveImage(imageInfo);
          if (imageInfo.viewportType === csCoreEnum.ViewportType.VOLUME_3D) {
            await this.renderingVolume(volumeId);
          } else if (imageInfo.viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC) {
            await this.renderingOrthographic(volumeId);
          }
        }
        if (imageInfo && segmentInfo) {
          const segmentId = await this.retrieveImage(segmentInfo);
          await this.renderingSegment(segmentInfo, segmentId);
        }
        if (!this.renderingEngine.hasBeenDestroyed) {
          this.renderingEngine.render();
          this.renderingEngine.renderViewports(this.viewportIds);
        }
      });
  }

  async retrieveImage(imageInfo) {
    let volumeId;
    if (imageInfo.schema === RequestSchema.wadoRs) {
      const imageIds = await this.imageIdService.wadoRsCreateImageIdsAndCacheMetaData(imageInfo);
      if (imageInfo.viewportType === csCoreEnum.ViewportType.STACK) {
        await this.retrieveAndRenderingStack(imageIds);
      } else {
        volumeId = RequestSchema.wadoRs + imageInfo?.studyInstanceUID + imageInfo?.seriesInstanceUID;
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
        volumeId = RequestSchema.nifti + imageInfo.urlRoot;
        const volume = await volumeLoader.createAndCacheVolume(volumeId);
        volume['load']();
      }
    } else {
      console.error('Unsupported request schema');
    }
    return volumeId;
  }

  set viewportType(viewportType: csCoreEnum.ViewportType) {
    this._viewportType = viewportType;
    const viewportInput = {
      element: this.viewportElementRef?.nativeElement as HTMLDivElement,
      viewportId: this.viewportId,
      type: viewportType,
      defaultOptions: {},
    };
    if (viewportType === csCoreEnum.ViewportType.STACK) {
      viewportInput.defaultOptions = {
        background: <Types.Point3>[0, 0, 0],
      };
    } else if (viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC) {
      viewportInput.defaultOptions = {
        orientation: csCoreEnum.OrientationAxis.AXIAL,
        background: <Types.Point3>[0, 0, 0],
      };
    } else if (viewportType === csCoreEnum.ViewportType.VOLUME_3D) {
      viewportInput.defaultOptions = {
        // background: CONSTANTS.BACKGROUND_COLORS.slicer3D as Types.RGB,
        background: <Types.Point3>[0.2, 0, 0.2],
      };
    }
    this.renderingEngine.setViewports([viewportInput!]);
  }

  get viewportType(): csCoreEnum.ViewportType {
    return this._viewportType;
  }

  // ngAfterViewInit(): void {
  // const imageBoxChange$ = this.imageBoxComponentList.changes.pipe(
  //   startWith(this.imageBoxComponentList),
  //   takeUntil(this.destroy$),
  //   filter((value) => !!value),
  // );
  //
  // merge(
  //   imageBoxChange$,
  //   imageBoxChange$.pipe(
  //     switchMap((imageBoxComponents: QueryList<ImageBoxComponent>) =>
  //       zip(imageBoxComponents.map((imageBox) => imageBox.viewportEvent)),
  //     ),
  //   ),
  // ).subscribe((value) => {
  //   console.log(value);
  //   const viewportInputs = this.imageBoxComponentList.map((component) => component?.viewportInput!) || [];
  //   this.viewportIds = this.imageBoxComponentList.map((component) => component?.viewportId!);
  //   this.toolBarComponent?.setViewport(this.viewportIds);
  //   this.viewportIdsSubject.next(this.viewportIds);
  // });
  // }

  async retrieveAndRenderingStack(imageIds) {
    const setStackPromises = this.viewportIds.map(async (viewportId) => {
      const viewport = this.renderingEngine.getViewport(viewportId) as Types.IStackViewport;
      await viewport.setStack(imageIds);
      // Set the VOI of the stack
      viewport.setProperties({ voiRange: ctVoiRange });
    });
    await Promise.all(setStackPromises);
  }

  async renderingSegment(segmentInfo: ImageInfo, segmentationId: string) {
    if (segmentInfo.viewportType === csCoreEnum.ViewportType.STACK) {
      console.error('Nifti dont support stack view');
    } else if (
      (segmentInfo.viewportType === csCoreEnum.ViewportType.VOLUME_3D ||
        segmentInfo.viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC) &&
      !!segmentInfo.segmentType
    ) {
      const existSegmentation = segmentation.state.getSegmentation(segmentationId);
      if (existSegmentation) {
        // existSegmentation.
      } else {
        segmentation.addSegmentations([
          {
            segmentationId: segmentationId,
            representation: {
              // type: csToolEnum.SegmentationRepresentations.Labelmap,
              // type: csToolEnum.SegmentationRepresentations.Surface,
              // type: csToolEnum.SegmentationRepresentations.Contour,
              type: segmentInfo.segmentType,
              data: {
                volumeId: segmentationId,
              },
            },
          },
        ]);
      }

      if (segmentInfo.segmentType === csToolEnum.SegmentationRepresentations.Labelmap) {
        await this.toolBarComponent.addSegmentationRepresentations(segmentationId, segmentInfo.segmentType);
      } else {
        console.warn('Surface segment is not support yet');
      }
    }
  }

  async renderingOrthographic(volumeId) {
    await setVolumesForViewports(
      this.renderingEngine,
      [
        {
          volumeId,
        },
      ],
      this.viewportIds,
    );
  }

  async renderingVolume(volumeId) {
    await setVolumesForViewports(this.renderingEngine, [{ volumeId }], this.viewportIds);
    this.viewportIds.forEach((viewportId) => {
      const volumeActor = this.renderingEngine.getViewport(viewportId).getDefaultActor().actor as Types.VolumeActor;
      utilities.applyPreset(
        volumeActor,
        CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Chest-Contrast-Enhanced')!,
      );
    });
  }

  ngOnDestroy(): void {
    this.renderingEngine.disableElement(this.viewportId);
    eventTarget.reset();
    cache.purgeCache();
    this.renderingEngine.destroy();
    this.destroy$.next();
    this.destroy$.complete();
    console.debug('viewport destroyed');
  }
}
