import { Component } from '@angular/core';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types/IViewport';
import { ToolEnum } from 'ng-cornerstone';
export type ViewportConfig = Omit<PublicViewportInput, 'element'>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:VOLUME_ID`; // VolumeId with loader id + volume id
  renderingEngineId = 'myRenderingEngine';

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

  viewportIds: string[] = [];
  focusedViewportId: string = '';
}
