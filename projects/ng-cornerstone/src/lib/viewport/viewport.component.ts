import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Types } from '@cornerstonejs/core';
import { CornerstoneService } from '../core';

@Component({
  selector: 'nc-viewport',
  exportAs: 'ncViewport',
  template: ` <div #imageBox class="container"></div>`,
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

  private updateViewport() {
    if (!this.viewportInput) {
      return;
    }
    const viewportInput = {
      viewportId: this.viewportInput.viewportId!,
      type: this.viewportInput.type!,
      element: this.viewportElementRef.nativeElement as HTMLDivElement,
      defaultOptions: this.viewportInput.defaultOptions,
    };
    this.csService.registerViewport(viewportInput);
  }

  ngOnDestroy(): void {
    if (this.viewportInput?.viewportId) {
      this.csService.unregisterViewport(this.viewportInput?.viewportId!);
    }
  }
}
