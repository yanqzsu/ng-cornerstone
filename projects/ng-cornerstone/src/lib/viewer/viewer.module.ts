import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { ViewerComponent } from './viewer.component';
import { CornerstoneService } from '../core';
import { ToolModule } from '../tool';
import { ViewportModule } from '../viewport/viewport.module';
import { CommonModule } from '@angular/common';

export function initializeLib(libService: CornerstoneService) {
  return () => libService.init();
}
@NgModule({
  declarations: [ViewerComponent],
  imports: [CommonModule, ToolModule, ViewportModule],
  exports: [ViewerComponent],
})
export class ViewerModule {
  static forRoot(): ModuleWithProviders<ViewerModule> {
    return {
      ngModule: ViewerModule,
      providers: [
        CornerstoneService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializeLib,
          deps: [CornerstoneService],
          multi: true,
        },
      ],
    };
  }
}
