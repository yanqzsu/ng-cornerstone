import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageBoxComponent } from './image-box/image-box.component';
import { CoreModule } from './core/core.module';
import { IconModule } from './components/icon/icon.module';
import { ToolGroupComponent } from './tool-group/tool-group.component';
import { ViewportComponent } from './viewport/viewport.component';
import { HomeComponent } from './home/home.component';
import { StudyComponent } from './study/study.component';
import { ComponentsModule } from './components/components.module';
import { ButtonModule } from './components/button/button.module';
import { ListModule } from './components/list/list.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudyComponent,
    ImageBoxComponent,
    ToolGroupComponent,
    ViewportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule.forRoot(),
    IconModule.forRoot(['./assets/font/iconfont.js']),
    ComponentsModule,
    ButtonModule,
    ListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
