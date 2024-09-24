import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ViewportModule } from 'ng-cornerstone';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ViewportModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
