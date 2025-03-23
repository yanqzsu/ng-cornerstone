import { Component, OnInit } from '@angular/core';
import { ImageInfo, ToolEnum, LayoutEnum } from 'ng-cornerstone';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from './dialog.component';
import { imageConfigs, segmentConfigs } from './configs/image-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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
  showImageViewer = true;
  imageInfo?: ImageInfo;
  segmentInfo?: ImageInfo;
  layout = LayoutEnum.LAYOUT_2x2;
  imageConfigList = imageConfigs;
  segmentConfigList = segmentConfigs;
  imageInfos: ImageInfo[] = this.imageConfigList.map((config) => config.data);
  segmentInfos: ImageInfo[] = this.segmentConfigList.map((config) => config.data);

  imageIndex: number = -1;
  segmentIndex: number = -1;

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
    setTimeout(() => {
      this.imageInfo = this.imageInfos[this.imageIndex];
      this.segmentInfo = this.segmentInfos[this.segmentIndex];
    }, 500);
  }

  onClick(): void {
    this.showImageViewer = !this.showImageViewer;
  }

  // 获取图像显示名称
  getImageDisplayName(index: number): string {
    return this.imageConfigList[index].alias;
  }

  // 获取分段显示名称
  getSegmentDisplayName(index: number): string {
    return this.segmentConfigList[index].alias;
  }

  changeImage(event: any) {
    this.imageIndex = event?.target?.value;
    this.imageInfo = this.imageIndex === -1 ? undefined : this.imageInfos[this.imageIndex];
  }
  changeSegment(event: any) {
    this.segmentIndex = event?.target?.value;
    this.segmentInfo = this.segmentIndex === -1 ? undefined : this.segmentInfos[this.segmentIndex];
  }
}
