import { ModuleWithProviders, NgModule } from '@angular/core';
import { ViewportComponent } from './viewport.component';

@NgModule({
  declarations: [ViewportComponent],
  imports: [],
  exports: [ViewportComponent],
})
export class ViewportModule {
  static forRoot(): ModuleWithProviders<ViewportModule> {
    return {
      ngModule: ViewportModule,
      providers: [],
    };
  }
  static forChild(): ModuleWithProviders<ViewportModule> {
    return {
      ngModule: ViewportModule,
    };
  }
}
