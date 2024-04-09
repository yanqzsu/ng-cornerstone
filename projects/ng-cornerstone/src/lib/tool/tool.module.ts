import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ToolBarComponent } from './tool-bar.component';
import { NcIconService } from '../components/icon';
import { ButtonModule } from '../components/button/button.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ToolBarComponent],
  imports: [CommonModule, ButtonModule],
  exports: [ToolBarComponent],
})
export class ToolModule {
  constructor(iconService: NcIconService, @SkipSelf() @Optional() parent?: ToolModule) {
    if (parent) {
      throw new Error('ToolBarModule should be imported only once!');
    }
    iconService.init('./assets/font/iconfont.js');
  }
}
