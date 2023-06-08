import { CdkAccordion } from '@angular/cdk/accordion';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, InjectionToken, Input, OnInit } from '@angular/core';

export const DX_ACCORDION = new InjectionToken<CollapseDirective>('DX_ACCORDION');

@Directive({
  selector: '[appCollapse]',
  exportAs: 'collapse',
  providers: [
    {
      provide: DX_ACCORDION,
      useExisting: CollapseDirective,
    },
  ],
})
export class CollapseDirective extends CdkAccordion {
  static ngAcceptInputType_hideToggle: BooleanInput;
  private _hideIndicator = false;

  @Input()
  get hideIndicator(): boolean {
    return this._hideIndicator;
  }
  set hideIndicator(show: boolean) {
    this._hideIndicator = coerceBooleanProperty(show);
  }
}
