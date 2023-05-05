import { CdkAccordionItem } from '@angular/cdk/accordion';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { ComponentPortal, Portal, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  Optional,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
  Injector,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

import { collapseAnimations } from './animation';
import { CollapseDirective, DX_ACCORDION } from './collapse.directive';
import { TextPortalComponent, PORTAL_TEXT } from './text.component';

@Component({
  selector: 'app-collapse-item',
  exportAs: 'appCollapseItem',
  templateUrl: './collapse-item.component.html',
  styleUrls: ['./collapse-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    collapseAnimations.bodyExpansion,
    collapseAnimations.indicatorRotate,
  ],
  host: {
    '[attr.aria-disabled]': 'disabled',
    '[class._animation-noopable]': '_animationMode === "NoopAnimations"',
  },
})
export class CollapseItemComponent extends CdkAccordionItem {
  static ngAcceptInputType_hideIndicator: BooleanInput;
  _hideIndicator = false;

  /** Whether the toggle indicator should be hidden. */
  @Input()
  get hideIndicator(): boolean {
    return (
      this._hideIndicator || (this.accordion && this.accordion.hideIndicator)
    );
  }
  set hideIndicator(value: boolean) {
    this._hideIndicator = coerceBooleanProperty(value);
  }

  @Input()
  iconTemplate?: TemplateRef<any>;

  @Input()
  title?: string;

  @Input()
  set description(desc: TemplateRef<any> | string) {
    if (desc instanceof TemplateRef) {
      this._portal = new TemplatePortal(desc, this._viewContainerRef);
    } else if (desc) {
      const injector = Injector.create({
        providers: [{ provide: PORTAL_TEXT, useValue: desc }],
      });
      this._portal = new ComponentPortal(TextPortalComponent, null, injector);
    } else {
      this._portal = null;
    }
  }

  _portal?: Portal<any> | null;

  override accordion: CollapseDirective;

  constructor(
    @Optional()
    @SkipSelf()
    @Inject(DX_ACCORDION)
    accordion: CollapseDirective,
    _changeDetectorRef: ChangeDetectorRef,
    _uniqueSelectionDispatcher: UniqueSelectionDispatcher,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string,
  ) {
    super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
    this.accordion = accordion;
  }

  clickHeader(): void {
    this.toggle();
  }
}
