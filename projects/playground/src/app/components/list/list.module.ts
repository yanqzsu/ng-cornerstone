import { NgModule } from '@angular/core';
import { ListComponent, ListItemComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';

const components = [ListComponent, ListItemComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [IconModule, CommonModule],
})
export class ListModule {}
