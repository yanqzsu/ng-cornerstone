import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NcIconService {
  constructor(@Inject(DOCUMENT) private doc: any, private rendererFactory2: RendererFactory2) {}

  init(iconfontUrl?: string) {
    if (iconfontUrl) {
      console.log('Icon init');
      this.fetchIconfont(iconfontUrl);
    }
  }

  fetchIconfont(url: string): void {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    const script = renderer.createElement('script');
    renderer.setAttribute(script, 'src', url);
    renderer.setAttribute(script, 'data-namespace', url);
    renderer.appendChild(this.doc.body, script);
  }
}
