import { ModuleWithProviders, NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import initDemo from './init/initDemo';

export function startupServiceFactory(): () => Promise<void> {
  return initDemo;
}
const SERVICES = [
  {
    provide: APP_INITIALIZER,
    useFactory: startupServiceFactory,
    multi: true,
  },
];

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      // https://angular.io/guide/styleguide#style-04-12
      throw new Error(`${parentModule} has already been loaded. Import Core modules in the AppModule only.`);
    }
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...SERVICES],
    } as ModuleWithProviders<CoreModule>;
  }
}
