import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  RendererFactory2,
} from '@angular/core';

export const ICONFONT_URL = new InjectionToken<string>('IconfontUrl');

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    @Inject(DOCUMENT) private doc: any,
    private rendererFactory2: RendererFactory2,
    @Inject(ICONFONT_URL) @Optional() private iconfontUrls?: string[],
  ) {}

  init() {
    if (this.iconfontUrls) {
      console.log('Icon init');
      for (const url of this.iconfontUrls) {
        this.fetchIconfont(url);
      }
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
