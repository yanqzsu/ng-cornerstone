import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  Directive,
  NgZone,
  OnInit,
} from '@angular/core';
import { Types, Enums } from '@cornerstonejs/core';
import { CornerstoneService, ImageInfo, imageInfoToUniqueId } from '../core';

@Directive()
export class BaseViewportComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  viewportInput?: Partial<Types.PublicViewportInput>;

  @Input()
  imageInfo?: ImageInfo;

  @Input()
  segmentInfo?: ImageInfo;

  @ViewChild('imageBox', { read: ElementRef, static: true })
  viewportElementRef!: ElementRef<HTMLElement>;

  @Input()
  @HostBinding('class.active')
  active: boolean = false;

  @Output() viewportUpdated = new EventEmitter<string>();
  @Output() viewportDestroy = new EventEmitter<string>();

  viewport!: Types.IViewport;

  constructor(protected csService: CornerstoneService, protected zone: NgZone) {}

  ngOnInit(): void {
    this.updateViewport();
    if (this.imageInfo) {
      this.zone.runOutsideAngular(() => {
        this.renderImage(this.imageInfo!);
      });
    }
    if (this.imageInfo && this.segmentInfo) {
      this.zone.runOutsideAngular(() => {
        this.renderSegment(this.imageInfo as ImageInfo, this.segmentInfo!);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { imageInfo, segmentInfo } = changes;

    if (imageInfo && !imageInfo.isFirstChange() && this.imageInfo) {
      this.zone.runOutsideAngular(() => {
        this.renderImage(this.imageInfo!);
      });
    }

    if (segmentInfo && !segmentInfo.isFirstChange() && this.segmentInfo) {
      this.zone.runOutsideAngular(() => {
        this.renderSegment(this.imageInfo as ImageInfo, this.segmentInfo!);
      });
    }
  }

  get renderingEngineId() {
    return this.csService.getRenderingEngineId();
  }

  get renderingEngine() {
    return this.csService.getRenderingEngine();
  }

  get toolGroup() {
    return this.csService.getToolGroup();
  }

  protected updateViewport() {
    console.log('update viewport: ', this.viewportInput?.viewportId);

    if (!this.viewportInput || !this.viewportInput.viewportId) {
      console.warn('No viewport input provided');
      return;
    }

    try {
      this.viewportInput.element = this.viewportElementRef.nativeElement as HTMLDivElement;
      this.renderingEngine.enableElement(this.viewportInput as Types.PublicViewportInput);
      this.viewport = this.renderingEngine.getViewport(this.viewportInput.viewportId);
      this.viewportUpdated.emit(this.viewportInput?.viewportId);
    } catch (error) {
      console.error('Failed to update viewport:', error);
    }
  }

  protected renderImage(image: ImageInfo): void {
    console.warn('Render method not implemented in base viewport component');
  }

  protected renderSegment(image: ImageInfo, segment: ImageInfo): void {
    console.warn('Render method not implemented in base viewport component');
  }

  ngOnDestroy(): void {
    if (this.viewportInput?.viewportId) {
      this.renderingEngine.disableElement(this.viewportInput.viewportId);
      this.viewportDestroy.emit(this.viewportInput.viewportId);
    }
  }
}
