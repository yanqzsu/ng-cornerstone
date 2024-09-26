import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ViewerModule } from 'ng-cornerstone';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ViewerModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
