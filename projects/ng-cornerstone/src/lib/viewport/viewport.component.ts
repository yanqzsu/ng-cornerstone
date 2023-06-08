import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { OrientationAxis } from '@cornerstonejs/core/dist/esm/enums';
import { RenderingEngine, setVolumesForViewports, Types, volumeLoader } from '@cornerstonejs/core';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types';

import { combineLatest, filter, first, ReplaySubject } from 'rxjs';

import { ToolEnum, ToolBarComponent } from '../tool';
import {
  CornerstoneInitService,
  ImageIdService,
  ImageInfo,
  RequestSchema,
  setCtTransferFunctionForVolumeActor,
  setStacksForViewports,
} from '../core';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements OnInit, OnChanges {
  viewportId = 'VIEWPORT_ID';
  renderingEngineId = 'RENDERING_ENGINE_ID';
  defaultVolumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeIdRoot = `${this.defaultVolumeLoaderScheme}:VOLUME_ID:`; // VolumeId with loader id + volume id + instance uid
  viewportType: ViewportType = ViewportType.STACK;
  renderingEngine!: RenderingEngine;

  @Input()
  imageInfo?: ImageInfo;

  @ViewChild(ToolBarComponent)
  toolBarComponent?: ToolBarComponent;

  @ViewChild('viewport', { read: ElementRef, static: true })
  viewportElementRef?: ElementRef<HTMLElement>;

  @Input()
  toolList: ToolEnum[] = [];

  private volumeRefreshSubject = new ReplaySubject<ImageInfo>(1);
  private readySubject = new ReplaySubject<boolean>(1);

  constructor(private cornerStoneInitService: CornerstoneInitService, private imageIdService: ImageIdService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo } = changes;
    if (imageInfo && this.imageInfo) {
      this.volumeRefreshSubject.next(this.imageInfo!);
    }
  }

  ngOnInit(): void {
    combineLatest([this.readySubject, this.volumeRefreshSubject]).subscribe(async ([ready, imageInfo]) => {
      if (!ready || !imageInfo) {
        return;
      }
      if (imageInfo.viewportType !== this.viewportType) {
        this.viewportType = imageInfo.viewportType;
        this.setViewports();
      }
      if (imageInfo.schema === RequestSchema.WadoRs) {
        const imageIds = await this.imageIdService.wadoRsCreateImageIdsAndCacheMetaData(imageInfo);
        const firstInstanceUID = imageInfo.sopInstanceUIDs![0] || '';
        const volumeId = this.volumeIdRoot + firstInstanceUID;
        if (imageInfo.viewportType === ViewportType.ORTHOGRAPHIC) {
          const volume = await volumeLoader.createAndCacheVolume(volumeId, {
            imageIds,
          });
          volume['load']();
          await setVolumesForViewports(
            this.renderingEngine,
            [
              {
                volumeId,
                callback: setCtTransferFunctionForVolumeActor,
              },
            ],
            [this.viewportId],
          );
          this.renderingEngine.renderViewports([this.viewportId]);
        } else if (imageInfo.viewportType === ViewportType.STACK) {
          await setStacksForViewports(this.renderingEngine, [this.viewportId], imageIds, 0);
        }
      }
    });
    this.cornerStoneInitService.ready$
      .pipe(
        filter((ready) => ready),
        first(),
      )
      .subscribe(() => {
        this.renderingEngine = new RenderingEngine(this.renderingEngineId);
        this.setViewports();
        this.readySubject.next(true);
      });
  }

  private setViewports() {
    const viewports: PublicViewportInput[] = [];
    if (this.viewportType === ViewportType.STACK) {
      const viewportInput: PublicViewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: ViewportType.STACK,
        defaultOptions: {
          background: <Types.Point3>[0, 0, 0],
        },
      };
      viewports.push(viewportInput);
    } else if (this.viewportType === ViewportType.ORTHOGRAPHIC) {
      const viewportInput: PublicViewportInput = {
        element: this.viewportElementRef?.nativeElement as HTMLDivElement,
        viewportId: this.viewportId,
        type: ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
          orientation: OrientationAxis.AXIAL,
          background: <Types.Point3>[0, 0, 0],
        },
      };
      viewports.push(viewportInput);
    }
    this.renderingEngine.setViewports(viewports);
    this.toolBarComponent?.updateViewport();
  }
}
