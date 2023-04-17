import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DICOM_SERVER, SeriesInfo } from '../core';
import { api } from 'dicomweb-client';
import { createSingleImageIdsAndCacheMetaData } from '../core/load/createSingleImageIdAndCache';
import { RenderingEngine } from '@cornerstonejs/core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { IStackViewport } from '@cornerstonejs/core/dist/esm/types';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit, OnDestroy {
  @Input()
  seriesInfo!: SeriesInfo;

  @ViewChild('thumbnail', { static: true })
  thumbnailElement!: ElementRef<HTMLDivElement>;

  @ViewChild('desc', { static: true })
  descElement!: ElementRef<HTMLDivElement>;
  renderingEngine!: RenderingEngine;
  viewportId!: string;
  constructor() {}
  ngOnInit(): void {
    this.initRender(this.seriesInfo);
    const client = new api.DICOMwebClient({ url: DICOM_SERVER });
    client
      .retrieveSeriesMetadata({
        studyInstanceUID: this.seriesInfo.studyInstanceUID,
        seriesInstanceUID: this.seriesInfo.seriesInstanceUID,
      })
      .then((instances: Array<any>) => {
        const INSTANCE_NUMBER = '00200013';
        if (instances) {
          instances.sort((a, b) => {
            const numberA = a?.[INSTANCE_NUMBER]?.Value?.[0] || 0;
            const numberB = b?.[INSTANCE_NUMBER]?.Value?.[0] || 0;
            return numberA - numberB;
          });
          if (instances.length > 1) {
            const middle = Math.round(instances.length / 2);
            this.downloadAndView(instances[middle]);
          } else if (instances.length === 1) {
            this.downloadAndView(instances[0]);
          }
        }
      });
  }

  initRender(seriesInfo: SeriesInfo) {
    const renderingEngineId = 'SeriesRenderingEngine' + seriesInfo.seriesNumber;
    this.viewportId = 'SeriesViewport' + seriesInfo.seriesNumber;
    this.renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportInput = {
      viewportId: this.viewportId,
      element: this.thumbnailElement.nativeElement as HTMLDivElement,
      type: ViewportType.STACK,
    };

    this.renderingEngine.enableElement(viewportInput);
  }

  downloadAndView(instanceMeta: any) {
    const imageId = createSingleImageIdsAndCacheMetaData(instanceMeta, true);
    const viewport = this.renderingEngine.getViewport(
      this.viewportId,
    ) as IStackViewport;
    viewport
      .setStack([imageId], 0)
      .then(() => {
        viewport.render();
      })
      .catch((err) => console.error(err));
  }

  ngOnDestroy(): void {
    if (!this.renderingEngine.hasBeenDestroyed) {
      this.renderingEngine.destroy();
    }
  }
}
