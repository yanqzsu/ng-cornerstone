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
} from '@angular/core';
import { Types } from '@cornerstonejs/core';
import { CornerstoneService } from '../core';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  template: ` <div #imageBox class="dicom-viewer-viewport-container"></div>`,
  styleUrls: ['./viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewportComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input()
  viewportInput?: Partial<Types.PublicViewportInput>;

  @ViewChild('imageBox', { read: ElementRef, static: true })
  viewportElementRef!: ElementRef<HTMLElement>;

  @Input()
  @HostBinding('class.active')
  active: boolean = false;

  @Output() viewportInit = new EventEmitter<string>();
  @Output() viewportDestroy = new EventEmitter<string>();

  constructor(private csService: CornerstoneService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { viewportInput } = changes;
    if (viewportInput && !viewportInput.isFirstChange() && this.viewportInput) {
      this.updateViewport();
    }
  }

  ngAfterViewInit(): void {
    this.updateViewport();
  }

  get renderingEngineId() {
    return this.csService.getRenderingEngineId();
  }

  get renderingEngine() {
    return this.csService.getRenderingEngine();
  }

  private updateViewport() {
    if (!this.viewportInput) {
      console.warn('No viewport input provided');
      return;
    }

    try {
      const viewportInput = {
        viewportId: this.viewportInput.viewportId!,
        type: this.viewportInput.type!,
        element: this.viewportElementRef.nativeElement as HTMLDivElement,
        defaultOptions: this.viewportInput.defaultOptions,
      };
      this.renderingEngine.enableElement(viewportInput);
      this.viewportInit.emit(this.viewportInput?.viewportId);
    } catch (error) {
      console.error('Failed to update viewport:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.viewportInput?.viewportId) {
      this.renderingEngine.disableElement(this.viewportInput.viewportId);
    }
    this.viewportDestroy.emit(this.viewportInput?.viewportId);
  }
}
