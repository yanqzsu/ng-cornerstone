import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';
import { ButtonComponent } from './button.component';
import { ButtonGroupComponent } from './button-group.component';

@NgModule({
  declarations: [ButtonComponent, ButtonGroupComponent],
  imports: [CommonModule, IconModule],
  providers: [],
  exports: [ButtonComponent, ButtonGroupComponent],
})
export class ButtonModule {}
