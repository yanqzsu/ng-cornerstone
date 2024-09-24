import { Component, OnInit } from '@angular/core';
import { ImageInfo, RequestSchema, ToolEnum, VolumeLoaderSchema } from 'ng-cornerstone';
import { Enums } from '@cornerstonejs/core';
import { Enums as csToolEnums } from '@cornerstonejs/tools';

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

  segmentInfo: ImageInfo[] = [
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/MED_LYMPH_089/ec0976c5-4926-4434-87bc-7b591f8f4b63/Labels/20231211-035627/MED_LYMPH_089.nii.gz',
      viewportType: Enums.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      volumeLoaderScheme: VolumeLoaderSchema.nifti,
      segmentType: csToolEnums.SegmentationRepresentations.Labelmap,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii.gz',
      viewportType: Enums.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      volumeLoaderScheme: VolumeLoaderSchema.nifti,
      segmentType: csToolEnums.SegmentationRepresentations.Labelmap,
    },
  ];

  imageInfos: ImageInfo[] = [
    {
      studyInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.826',
      seriesInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.828',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: Enums.ViewportType.STACK,
      schema: RequestSchema.wadoRs,
    },
    {
      studyInstanceUID: '1.2.840.113711.7041813.2.3212.182276852.26.2116281012.16720',
      seriesInstanceUID: '1.3.12.2.1107.5.2.6.14114.30000006101211003631200000970',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: Enums.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.wadoRs,
      volumeLoaderScheme: VolumeLoaderSchema.stream,
    },
    {
      studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
      seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: Enums.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
      volumeLoaderScheme: VolumeLoaderSchema.stream,
    },
    {
      studyInstanceUID: '1.2.392.200036.9116.2.238.1.2016.4.19.11.44.35',
      seriesInstanceUID: '1.2.392.200036.9116.2.238.1.2016.4.19.11.44.35.5314',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: Enums.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
      volumeLoaderScheme: VolumeLoaderSchema.stream,
    },
    {
      studyInstanceUID: '1.2.276.0.7230010.3.1.2.2005493247.19620.1725863961.819',
      seriesInstanceUID: '1.2.826.0.1.3680043.8.498.25032035562164221188813309124629610301',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: Enums.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.wadoRs,
      volumeLoaderScheme: VolumeLoaderSchema.stream,
    },
    {
      studyInstanceUID: '1.2.276.0.7230010.3.1.2.2005493247.19620.1725863961.819',
      seriesInstanceUID: '1.2.826.0.1.3680043.8.498.25032035562164221188813309124629610301',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: Enums.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
      volumeLoaderScheme: VolumeLoaderSchema.stream,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/MED_LYMPH_089/ec0976c5-4926-4434-87bc-7b591f8f4b63/Images/MED_LYMPH_089.nii.gz',
      viewportType: Enums.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      volumeLoaderScheme: VolumeLoaderSchema.nifti,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
      viewportType: Enums.ViewportType.VOLUME_3D,
      schema: RequestSchema.nifti,
      volumeLoaderScheme: VolumeLoaderSchema.nifti,
    },
  ];

  imageIndex: number = 6;
  segmentIndex: number = 0;

  changeImage(event: any) {
    this.imageIndex = event?.target?.value || 0;
  }
  changeSegment(event: any) {
    this.segmentIndex = event?.target?.value || 0;
  }
}
