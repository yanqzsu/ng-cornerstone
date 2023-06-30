import initProviders from './initProviders';
import initCornerstoneDICOMImageLoader from './initCornerstoneDICOMImageLoader';
import initVolumeLoader from './initVolumeLoader';
import { imageLoader, init as csRenderInit, metaData } from '@cornerstonejs/core';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CornerstoneInitService implements OnDestroy {
  private readySubject = new BehaviorSubject<boolean>(false);
  ready$: Observable<boolean>;

  get ready(): boolean {
    return this.readySubject.value;
  }
  constructor() {
    this.ready$ = this.readySubject.asObservable();
  }

  init() {
    initProviders();
    initCornerstoneDICOMImageLoader();
    initVolumeLoader();
    csRenderInit().then((value) => {
      this.readySubject.next(true);
    });
  }

  ngOnDestroy(): void {
    metaData.removeAllProviders();
    imageLoader.unregisterAllImageLoaders();
  }
}
