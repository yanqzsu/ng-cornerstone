import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CornerstoneService, ImageIdService, ImageInfo } from '../core';
import { BaseViewportComponent } from './base-viewport.component';
import { NgZone } from '@angular/core';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  template: ` <div #imageBox class="dicom-viewer-viewport-container"></div>`,
  styleUrls: ['./viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewportComponent extends BaseViewportComponent implements OnDestroy, AfterViewInit {
  constructor(protected override csService: CornerstoneService, zone: NgZone) {
    super(csService, zone);
  }

  /**
   * 基础渲染方法 - 默认实现只是显示一个警告
   * 子类会重写这个方法提供特定的渲染逻辑
   */
  override renderImage(image: ImageInfo): void {
    console.warn('Render method not implemented in base viewport component');
    // 虽然默认组件没有特定的渲染逻辑，但我们可以记录一些调试信息
    if (image) {
      console.debug('Image info provided:', image.viewportType);
    }
  }

  override renderSegment(image: ImageInfo, segment: ImageInfo): void {
    console.warn('Render method not implemented in base viewport component');
    // 虽然默认组件没有特定的渲染逻辑，但我们可以记录一些调试信息
    if (image) {
      console.debug('Image info provided:', image.viewportType);
    }
    if (segment) {
      console.debug('Segment info provided:', segment.segmentType);
    }
  }
}
