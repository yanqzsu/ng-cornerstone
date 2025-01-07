import { Component, Inject, OnInit } from '@angular/core';
import { ImageInfo, RequestSchema, ToolEnum, LayoutEnum } from 'ng-cornerstone';
import { Enums as csCoreEnum } from '@cornerstonejs/core';
import { Enums as csToolEnum } from '@cornerstonejs/tools';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  imageInfo?: ImageInfo;
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
  ];
  // imageInfo: ImageInfo = {
  //   studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
  //   seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
  //   // urlRoot: 'http://10.81.20.156:8080/dicom-web',
  //   // urlRoot: 'http://localhost:5000/api/image?path=0000008839/image.nii.gz',
  //   urlRoot:
  //     'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
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
  segmentInfo: ImageInfo = {
    studyInstanceUID: '1.2.392.200055.5.4.80861305518.22222',
    seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
    // urlRoot: 'http://10.81.20.156:8080/dicom-web',
    urlRoot:
      'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii.gz',
    // urlRoot:
    //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
    // urlRoot: 'http://10.81.20.156:8080/referenceT1.nii',
    // urlRoot:
    //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii',
    // urlRoot:
    //   'http://10.81.20.156:8080/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii',
    viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    schema: RequestSchema.nifti,
    segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
  };

  layout = LayoutEnum.VOLUME;

  constructor(@Inject(DIALOG_DATA) public data: any, public dialogRef: DialogRef<string>) {
    console.log(data);
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
        urlRoot:
          'http://10.81.20.156:8081/segment/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
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
    }, 500);
  }
}
