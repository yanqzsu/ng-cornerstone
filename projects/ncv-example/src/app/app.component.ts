import { Component, OnInit } from '@angular/core';

import { ToolEnum, ImageInfo, RequestSchema, VolumeLoaderSchema } from 'ng-cornerstone';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  volumeId = `${this.volumeLoaderScheme}:VOLUME_ID`; // VolumeId with loader id + volume id
  renderingEngineId = 'myRenderingEngine';
  showImageViewer = false;
  ngOnInit(): void {
    setTimeout(() => {
      this.showImageViewer = true;
    }, 2000);
  }
  onClick(): void {
    this.showImageViewer = !this.showImageViewer;
  }
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
    ToolEnum.Axial,
    ToolEnum.Sagittal,
    ToolEnum.Coronal,
  ];

  imageInfos: ImageInfo[] = [
    // {
    //   studyInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.826',
    //   seriesInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.828',
    //   urlRoot: 'http://10.81.20.156:8080/dicom-web',
    //   viewportType: ViewportType.STACK,
    //   schema: RequestSchema.WadoRs,
    // },
    // {
    //   studyInstanceUID: '1.2.840.113711.7041813.2.3212.182276852.26.2116281012.16720',
    //   seriesInstanceUID: '1.3.12.2.1107.5.2.6.14114.30000006101211003631200000970',
    //   urlRoot: 'http://10.81.20.156:8080/dicom-web',
    //   viewportType: ViewportType.ORTHOGRAPHIC,
    //   schema: RequestSchema.WadoRs,
    //   volumeLoaderScheme: VolumeLoaderSchema.stream,
    // },
    // {
    //   studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
    //   seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
    //   urlRoot: 'http://10.81.20.156:8080/dicom-web',
    //   viewportType: ViewportType.ORTHOGRAPHIC,
    //   schema: RequestSchema.WadoRs,
    //   volumeLoaderScheme: VolumeLoaderSchema.stream,
    // },
    {
      studyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
      seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
      urlRoot: 'https://d1qmxk7r72ysft.cloudfront.net/dicomweb',
      viewportType: ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.WadoRs,
      volumeLoaderScheme: VolumeLoaderSchema.stream,
    },
  ];

  imageIndex: number = 0;

  changeImage(event: any) {
    this.imageIndex = event?.target?.value || 0;
  }
}
