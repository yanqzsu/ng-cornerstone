import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'i[nc-icon]',
  template: `
    <svg class="icon" aria-hidden="true">
      <use attr.xlink:href="#{{ iconfont }}"></use>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }

      .icon {
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
  @Input() iconfont: string | null = '';
}
