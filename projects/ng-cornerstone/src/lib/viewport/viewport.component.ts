import {
  AfterViewInit,
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
  cache,
  CONSTANTS,
  Enums,
  eventTarget,
  RenderingEngine,
  setVolumesForViewports,
  Types,
  utilities,
  volumeLoader,
} from '@cornerstonejs/core';

import { BehaviorSubject, combineLatest, filter, first, merge, ReplaySubject, startWith, Subject, zip } from 'rxjs';

import { ToolBarComponent, ToolEnum } from '../tool';
import { CornerstoneInitService, ImageIdService, ImageInfo, RequestSchema, setStacksForViewports } from '../core';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  activatedViewportId = 'VIEWPORT_ID';
  renderingEngineId = 'RENDERING_ENGINE_ID';
  viewportType?: Enums.ViewportType;
  private defaultVolumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  private volumeIdRoot = `${this.defaultVolumeLoaderScheme}:VOLUME_ID:`; // VolumeId with loader id + volume id + instance uid
  private renderingEngine!: RenderingEngine;
  private volumeRefreshSubject = new ReplaySubject<ImageInfo>(1);
  private destroy$ = new Subject<void>();

  viewportIds?: string[];
  viewportIdsSubject = new BehaviorSubject<string[]>([]);

  @Input()
  imageInfo?: ImageInfo;

  @ViewChild(ToolBarComponent)
  toolBarComponent!: ToolBarComponent;

  @ViewChildren(ImageBoxComponent)
  imageBoxComponentList!: QueryList<ImageBoxComponent>;

  @Input()
  toolList: ToolEnum[] = [];

  constructor(private cornerStoneInitService: CornerstoneInitService, private imageIdService: ImageIdService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo } = changes;
    if (imageInfo) {
      this.volumeRefreshSubject.next(this.imageInfo!);
    }
  }

  ngOnInit(): void {
    this.cornerStoneInitService.ready$
      .pipe(
        startWith(this.cornerStoneInitService.ready),
        filter((ready) => ready),
        first(),
      )
      .subscribe(() => {
        this.renderingEngine = new RenderingEngine(this.renderingEngineId);
        combineLatest([this.viewportIdsSubject, this.volumeRefreshSubject]).subscribe(
          async ([viewportIds, imageInfo]) => {
            if (imageInfo.viewportType !== this.viewportType) {
              this.viewportType = imageInfo.viewportType;
              return;
            }
            if (imageInfo.schema === RequestSchema.wadoRs) {
              const imageIds = await this.imageIdService.wadoRsCreateImageIdsAndCacheMetaData(imageInfo);
              const firstInstanceUID = imageInfo.sopInstanceUIDs![0] || '';
              const volumeId = this.volumeIdRoot + firstInstanceUID;
              if (imageInfo.viewportType === Enums.ViewportType.ORTHOGRAPHIC) {
                const volume = await volumeLoader.createAndCacheVolume(volumeId, {
                  imageIds,
                });
                volume['load']();
                await setVolumesForViewports(
                  this.renderingEngine,
                  [
                    {
                      volumeId,
                    },
                  ],
                  viewportIds,
                );
                if (!this.renderingEngine.hasBeenDestroyed) {
                  this.renderingEngine.render();
                  this.renderingEngine.renderViewports(viewportIds);
                }
              } else if (imageInfo.viewportType === Enums.ViewportType.STACK) {
                await setStacksForViewports(this.renderingEngine, viewportIds, imageIds, 0);
              } else if (imageInfo.viewportType === Enums.ViewportType.VOLUME_3D) {
                const volume = await volumeLoader.createAndCacheVolume(volumeId, {
                  imageIds,
                });
                volume['load']();
                await setVolumesForViewports(this.renderingEngine, [{ volumeId }], viewportIds);
                viewportIds.forEach((viewportId) => {
                  const volumeActor = this.renderingEngine.getViewport(viewportId).getDefaultActor()
                    .actor as Types.VolumeActor;
                  utilities.applyPreset(
                    volumeActor,
                    CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Chest-Contrast-Enhanced')!,
                  );
                });
                if (!this.renderingEngine.hasBeenDestroyed) {
                  this.renderingEngine.render();
                  this.renderingEngine.renderViewports(viewportIds);
                }
              }
            } else if (imageInfo.schema === RequestSchema.nifti) {
              const volumeId = RequestSchema.nifti + imageInfo.urlRoot;
              const volume = await volumeLoader.createAndCacheVolume(volumeId);
              volume['load']();
              if (imageInfo.viewportType === Enums.ViewportType.ORTHOGRAPHIC) {
                await setVolumesForViewports(
                  this.renderingEngine,
                  [
                    {
                      volumeId,
                    },
                  ],
                  viewportIds,
                );
                if (!this.renderingEngine.hasBeenDestroyed) {
                  this.renderingEngine.render();
                  this.renderingEngine.renderViewports(viewportIds);
                }
              } else if (imageInfo.viewportType === Enums.ViewportType.STACK) {
                // await setStacksForViewports(this.renderingEngine, viewportIds, imageIds, 0);
              } else if (imageInfo.viewportType === Enums.ViewportType.VOLUME_3D) {
                await setVolumesForViewports(this.renderingEngine, [{ volumeId }], viewportIds);
                viewportIds.forEach((viewportId) => {
                  const volumeActor = this.renderingEngine.getViewport(viewportId).getDefaultActor()
                    .actor as Types.VolumeActor;
                  utilities.applyPreset(
                    volumeActor,
                    CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Chest-Contrast-Enhanced')!,
                  );
                });
                if (!this.renderingEngine.hasBeenDestroyed) {
                  this.renderingEngine.render();
                  this.renderingEngine.renderViewports(viewportIds);
                }
              }
            }
          },
        );
      });
  }

  ngAfterViewInit(): void {
    const imageBoxChange$ = this.imageBoxComponentList.changes.pipe(
      startWith(this.imageBoxComponentList),
      takeUntil(this.destroy$),
      filter((value) => !!value),
    );

    merge(
      imageBoxChange$,
      imageBoxChange$.pipe(
        switchMap((imageBoxComponents: QueryList<ImageBoxComponent>) =>
          zip(imageBoxComponents.map((imageBox) => imageBox.viewportEvent)),
        ),
      ),
    ).subscribe(() => {
      const viewportInputs = this.imageBoxComponentList.map((component) => component?.viewportInput!) || [];
      this.viewportIds = viewportInputs.map((viewportInput) => viewportInput.viewportId);
      this.renderingEngine.setViewports(viewportInputs);
      this.toolBarComponent?.setViewport(this.viewportIds);
      this.viewportIdsSubject.next(this.viewportIds);
    });
  }

  ngOnDestroy(): void {
    console.log('viewport destroyed');
    this.viewportIds?.forEach((id) => {
      this.renderingEngine.disableElement(id);
    });
    eventTarget.reset();
    cache.purgeCache();
    this.renderingEngine.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
