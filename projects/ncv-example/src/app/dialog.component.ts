import { Component, Inject, OnInit } from '@angular/core';
import { ImageInfo, RequestSchema, ToolEnum, LayoutEnum } from 'ng-cornerstone';
import { Enums as csCoreEnum } from '@cornerstonejs/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { imageConfigs, segmentConfigs } from './configs/image-config';

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
  segmentInfo?: ImageInfo;

  layout = LayoutEnum.VOLUME;

  constructor(@Inject(DIALOG_DATA) public data: any, public dialogRef: DialogRef<string>) {
    console.log(data);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.imageInfo = imageConfigs[4].data;
      this.segmentInfo = segmentConfigs[0].data;
    }, 500);
  }
}
