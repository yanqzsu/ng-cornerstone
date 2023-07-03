import { ENVIRONMENT_INITIALIZER, inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { ToolBarComponent } from './tool-bar.component';
import { ICONFONT_URL, IconService } from '../components/icon/icon.service';
import { ButtonModule } from '../components/button/button.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ToolBarComponent],
  imports: [
    CommonModule,
    {
      ngModule: ButtonModule,
      providers: [
        {
          provide: ICONFONT_URL,
          multi: true,
          useValue: ['./assets/font/iconfont.js'],
        },
        {
          provide: ENVIRONMENT_INITIALIZER,
          multi: true,
          useValue: () => inject(IconService).init(),
        },
      ],
    },
  ],
  exports: [ToolBarComponent],
})
export class ToolModule {
  constructor(@SkipSelf() @Optional() parent?: ToolModule) {
    if (parent) {
      throw new Error('ToolBarModule should be imported only once!');
    }
  }
}
