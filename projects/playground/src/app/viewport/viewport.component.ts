import { Component, ElementRef, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent {
  @Input()
  viewportId = 'viewport';

  @Input()
  renderingEngineId: string = '';

  @Input()
  @HostBinding('class.focus')
  focus: boolean = false;

  constructor(public element: ElementRef) {}
}
