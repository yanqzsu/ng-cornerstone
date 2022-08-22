import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NiIconService } from './icon.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'i[ni-icon]',
  template: `
    <svg class="ni-icon" aria-hidden="true">
      <use attr.xlink:href="#{{ iconfont }}"></use>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }

      .ni-icon {
        fill: currentColor;
        height: 1em;
        overflow: hidden;
        vertical-align: -0.15em;
        width: 1em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('ni-icon') iconfont = '';

  constructor(service: NiIconService) {}
}
