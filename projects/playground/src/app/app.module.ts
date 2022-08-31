import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageBoxComponent } from './image-box/image-box.component';
import { CollapsePanelComponent } from './collapse-panel/collapse-panel.component';

import { CoreModule } from './core/core.module';
import { NiIconModule } from './icon/icon.module';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageBoxComponent,
    CollapsePanelComponent,
    ButtonComponent,
    ButtonGroupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    NiIconModule.forRoot(['./assets/font/iconfont.js']),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
