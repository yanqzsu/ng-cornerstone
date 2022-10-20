import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapsePanelComponent } from './collapse-panel/collapse-panel.component';

@NgModule({
  declarations: [CollapsePanelComponent],
  exports: [CollapsePanelComponent],
  imports: [CommonModule],
  providers: [],
})
export class ComponentsModule {}
