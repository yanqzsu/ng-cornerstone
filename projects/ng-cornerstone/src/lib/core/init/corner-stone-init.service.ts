import initProviders from './initProviders';
import initCornerstoneDICOMImageLoader from './initCornerstoneDICOMImageLoader';
import initVolumeLoader from './initVolumeLoader';
import { imageLoader, init as csRenderInit, metaData } from '@cornerstonejs/core';
import { Injectable, OnDestroy } from '@angular/core';
import { init as csToolInit } from '@cornerstonejs/tools';
@Injectable({
  providedIn: 'root',
})
export class CornerstoneInitService implements OnDestroy {
  constructor() {}

  async init() {
    initProviders();
    initCornerstoneDICOMImageLoader();
    initVolumeLoader();
    await Promise.all([csRenderInit(), csToolInit()]);
    console.debug('CornerstoneInitService');
  }

  ngOnDestroy(): void {
    metaData.removeAllProviders();
    imageLoader.unregisterAllImageLoaders();
  }
}
