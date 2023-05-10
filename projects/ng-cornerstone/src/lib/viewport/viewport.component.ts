import { Component, Input, OnInit, ViewChild } from '@angular/core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { OrientationAxis } from '@cornerstonejs/core/dist/esm/enums';
import { RenderingEngine, Types } from '@cornerstonejs/core';
import { filter, first, Subject } from 'rxjs';

import { CornerstoneInitService } from '../core/init/corner-stone-init.service';
import { ToolBarComponent } from '../tool/tool-bar.component';
import { ImageInfo, OrientationEnum, ToolEnum, ViewportConfig } from '../core';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements OnInit {
  viewportId = 'VIEWPORT_ID';
  renderingEngineId = 'RENDERING_ENGINE_ID';
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:VOLUME_ID`; // VolumeId with loader id + volume id

  @Input()
  imageInfo?: ImageInfo;
  renderingEngine: RenderingEngine | undefined;

  @ViewChild(ToolBarComponent)
  toolBarComponent?: ToolBarComponent;

  @Input()
  toolList: ToolEnum[] = [];

  @Input()
  viewportType: ViewportType = ViewportType.STACK;

  viewportConfigs: ViewportConfig[] = [
    {
      viewportId: 'VIEWPORT_ID_1',
      type: ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: OrientationAxis[OrientationEnum.AXIAL],
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

  constructor(private cornerStoneInitService: CornerstoneInitService) {}

  ngOnInit(): void {
    this.cornerStoneInitService.ready$
      .pipe(
        filter((ready) => ready),
        first(),
      )
      .subscribe((value) => {
        this.init();
      });
  }

  init(): void {
    this.renderingEngine = new RenderingEngine(this.renderingEngineId);
    this.viewportType = ViewportType.ORTHOGRAPHIC;
  }
}
