import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ViewerModule } from 'ng-cornerstone';
import { DialogComponent } from './dialog.component';
import { DEFAULT_DIALOG_CONFIG, DialogModule } from '@angular/cdk/dialog';
@NgModule({
  declarations: [AppComponent, DialogComponent],
  imports: [BrowserModule, DialogModule, ViewerModule.forRoot()],
  providers: [{ provide: DEFAULT_DIALOG_CONFIG, useValue: { hasBackdrop: true } }],
  bootstrap: [AppComponent],
})
export class AppModule {}
