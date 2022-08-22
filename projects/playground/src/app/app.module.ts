import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageBoxComponent } from './image-box/image-box.component';
import { CoreModule } from './core/core.module';
import { NiIconModule } from './icon/icon.module';

@NgModule({
  declarations: [AppComponent, ImageBoxComponent],
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
