import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NcIconService {
  private initialized = false;

  constructor(
    private rendererFactory2: RendererFactory2,
    @Inject(DOCUMENT) private doc: any,
    @Optional() @Inject('ICON_URL') iconfontUrl: string,
  ) {
    console.debug('NcIconService init');
    this.init(iconfontUrl);
  }

  init(iconfontUrl?: string) {
    if (iconfontUrl && !this.initialized) {
      const renderer = this.rendererFactory2.createRenderer(null, null);
      const script = renderer.createElement('script');
      renderer.setAttribute(script, 'src', iconfontUrl);
      renderer.setAttribute(script, 'data-namespace', iconfontUrl);
      renderer.appendChild(this.doc.body, script);
      this.initialized = true;
    }
  }
}
