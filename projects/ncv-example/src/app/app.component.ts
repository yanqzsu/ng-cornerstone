import { Component, OnInit } from '@angular/core';
import { ImageInfo, RequestSchema, ToolEnum, LayoutEnum } from 'ng-cornerstone';
import { Enums as csCoreEnum } from '@cornerstonejs/core';
import { Enums as csToolEnum } from '@cornerstonejs/tools';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showImageViewer = true;
  imageInfo?: ImageInfo;
  segmentInfo?: ImageInfo;
  layout = LayoutEnum.STACK;

  constructor(public dialog: Dialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      minWidth: '300px',
      data: {
        animal: 'panda',
      },
      id: '123456',
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  ngOnInit(): void {
    // this.imageInfo = {
    //   studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
    //   seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
    //   // urlRoot: 'http://10.81.20.156:8080/dicom-web',
    //   urlRoot: 'http://localhost:5000/api/image?path=0000008839/image.nii.gz',
    //   // urlRoot:
    //   //   'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
    //   // urlRoot:
    //   //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
    //   // urlRoot: 'http://10.81.20.156:8080/referenceT1.nii',
    //   // urlRoot:
    //   //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii',
    //   // urlRoot:
    //   //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii',
    //   viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    //   schema: RequestSchema.nifti,
    // };
    setTimeout(() => {
      this.imageInfo = {
        studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
        seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
        // urlRoot: 'http://10.81.20.156:8080/dicom-web',
        // urlRoot: 'http://localhost:5000/api/image?path=0000008839/image.nii.gz',
        urlRoot:
          'http://10.81.20.156:8081/segment/ABD_LYMPH_078/b1d8ef93-22c5-41cc-b3c8-a8a14ec37af8/Images/ABD_LYMPH_078.nii.gz',
        // urlRoot:
        //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
        // urlRoot: 'http://10.81.20.156:8080/referenceT1.nii',
        // urlRoot:
        //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii',
        // urlRoot:
        //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii',
        viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
        schema: RequestSchema.nifti,
      };
      // this.segmentInfo = {
      //   studyInstanceUID: '1.2.392.200055.5.4.80861305518.22222',
      //   seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
      //   // urlRoot: 'http://10.81.20.156:8080/dicom-web',
      //   urlRoot:
      //     'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii.gz',
      //   // urlRoot:
      //   //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
      //   // urlRoot: 'http://10.81.20.156:8080/referenceT1.nii',
      //   // urlRoot:
      //   //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii',
      //   // urlRoot:
      //   //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii',
      //   viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      //   schema: RequestSchema.nifti,
      //   segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
      // };
    }, 500);
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

  segmentInfos: ImageInfo[] = [
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/MED_LYMPH_089/ec0976c5-4926-4434-87bc-7b591f8f4b63/Labels/20231211-035627/MED_LYMPH_089.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/nifti/minivna_data/spleen_2_1/c797483d-0aa0-40ca-a41b-84f6333687b6/e87971ff-0fa5-4189-8208-8dee2b3b6c9e/Labels/20230928-133709/spleen_2.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
    },
  ];

  imageInfos: ImageInfo[] = [
    {
      studyInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.826',
      seriesInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.828',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: csCoreEnum.ViewportType.STACK,
      schema: RequestSchema.wadoRs,
    },
    {
      studyInstanceUID: '1.2.840.113711.7041813.2.3212.182276852.26.2116281012.16720',
      seriesInstanceUID: '1.3.12.2.1107.5.2.6.14114.30000006101211003631200000970',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.wadoRs,
    },
    {
      studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
      seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
    },
    {
      studyInstanceUID: '1.2.392.200036.9116.2.238.1.2016.4.19.11.44.35',
      seriesInstanceUID: '1.2.392.200036.9116.2.238.1.2016.4.19.11.44.35.5314',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
    },
    {
      studyInstanceUID: '1.2.276.0.7230010.3.1.2.2005493247.19620.1725863961.819',
      seriesInstanceUID: '1.2.826.0.1.3680043.8.498.25032035562164221188813309124629610301',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.wadoRs,
    },
    {
      studyInstanceUID: '1.2.276.0.7230010.3.1.2.2005493247.19620.1725863961.819',
      seriesInstanceUID: '1.2.826.0.1.3680043.8.498.25032035562164221188813309124629610301',
      urlRoot: 'http://10.81.20.156:8080/dicom-web',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/MED_LYMPH_089/ec0976c5-4926-4434-87bc-7b591f8f4b63/Images/MED_LYMPH_089.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.nifti,
    },
    {
      urlRoot:
        'http://10.81.20.156:8081/nifti/minivna_data/spleen_2_1/c797483d-0aa0-40ca-a41b-84f6333687b6/e87971ff-0fa5-4189-8208-8dee2b3b6c9e/Images/spleen_2_1.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
    },
  ];

  imageIndex: number = 8;
  segmentIndex: number = 2;

  changeImage(event: any) {
    this.imageIndex = event?.target?.value || 0;
  }
  changeSegment(event: any) {
    this.segmentIndex = event?.target?.value || 0;
  }
}
