import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { TextPortalComponent } from './text.component';
import { CollapseItemComponent } from './collapse-item.component';
import { CollapseDirective } from './collapse.directive';

@NgModule({
  declarations: [CollapseItemComponent, CollapseDirective, TextPortalComponent],
  imports: [CommonModule, CdkAccordionModule, PortalModule],
  exports: [CollapseItemComponent, CollapseDirective, TextPortalComponent],
})
export class CollapseModule {}
