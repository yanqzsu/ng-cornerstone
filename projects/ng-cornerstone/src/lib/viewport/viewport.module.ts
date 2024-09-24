import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ViewportComponent } from './viewport.component';
import { CornerstoneInitService } from '../core';
import { ToolModule } from '../tool';
import { ImageBoxModule } from '../image-box/image-box.module';

export function initializeLib(libService: CornerstoneInitService) {
  return () => libService.init();
}
@NgModule({
  declarations: [ViewportComponent],
  imports: [ToolModule, ImageBoxModule],
  exports: [ViewportComponent],
})
export class ViewportModule {
  static forRoot(): ModuleWithProviders<ViewportModule> {
    return {
      ngModule: ViewportModule,
      providers: [
        CornerstoneInitService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializeLib,
          deps: [CornerstoneInitService],
          multi: true,
        },
      ],
    };
  }
}
