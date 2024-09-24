import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon';
import { ButtonComponent } from './button.component';
import { ButtonGroupComponent } from './button-group.component';

@NgModule({
  declarations: [ButtonComponent, ButtonGroupComponent],
  imports: [CommonModule, IconModule],
  exports: [ButtonComponent, ButtonGroupComponent],
})
export class ButtonModule {}
