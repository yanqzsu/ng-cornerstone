import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ICONFONT_URL } from './icon.service';
import { IconComponent } from './icon.component';

@NgModule({
  declarations: [IconComponent],
  imports: [CommonModule],
  exports: [IconComponent],
})
export class IconModule {
  static forRoot(iconJsPath: string[]): ModuleWithProviders<IconModule> {
    const providers = iconJsPath.map((path) => {
      return {
        provide: ICONFONT_URL,
        useValue: path,
        multi: true,
      };
    });
    return {
      ngModule: IconModule,
      providers,
    };
  }
}
