import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { NcIconService } from './icon.service';

@NgModule({
  declarations: [IconComponent],
  imports: [CommonModule],
  exports: [IconComponent],
})
export class IconModule {
  static forRoot(iconfontUrl: string): ModuleWithProviders<IconModule> {
    return {
      ngModule: IconModule,
      providers: [{ provide: 'ICON_URL', useValue: iconfontUrl }, NcIconService],
    };
  }
}
