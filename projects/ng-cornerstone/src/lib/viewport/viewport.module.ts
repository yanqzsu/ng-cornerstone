import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewportComponent } from './viewport.component';
import { StackViewportComponent } from './stack-viewport.component';
import { Volume3DViewportComponent } from './volume3d-viewport.component';
import { OrthographicViewportComponent } from './orthographic-viewport.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ViewportComponent, StackViewportComponent, Volume3DViewportComponent, OrthographicViewportComponent],
  exports: [ViewportComponent, StackViewportComponent, Volume3DViewportComponent, OrthographicViewportComponent],
})
export class ViewportModule {}
