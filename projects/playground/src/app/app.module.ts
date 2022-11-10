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
import { CollapseModule } from './components/collapse/collapse.module';
import { SeriesComponent } from './series/series.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolGroupComponent,
    StudyComponent,
    SeriesComponent,
    ImageBoxComponent,
    ViewportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DragDropModule,
    CoreModule.forRoot(),
    IconModule.forRoot(['./assets/font/iconfont.js']),
    ComponentsModule,
    ButtonModule,
    ListModule,
    CollapseModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
