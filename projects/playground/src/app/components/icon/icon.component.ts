import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IconService } from './icon.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'i[app-icon]',
  template: `
    <svg class="app-icon" aria-hidden="true">
      <use attr.xlink:href="#{{ iconfont }}"></use>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }

      .app-icon {
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
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('app-icon') iconfont: string | null = '';

  constructor(service: IconService) {}
}
