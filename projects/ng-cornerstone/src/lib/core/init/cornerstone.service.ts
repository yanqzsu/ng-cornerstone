import initProviders from './initProviders';
import initVolumeLoader from './initVolumeLoader';
import {
  cache,
  eventTarget,
  imageLoader,
  init as csRenderInit,
  metaData,
  RenderingEngine,
  Types as csCoreTypes,
} from '@cornerstonejs/core';
import * as polySeg from '@cornerstonejs/polymorphic-segmentation';
import { Injectable, OnDestroy } from '@angular/core';
import { init as csToolInit, Types as csToolTypes, destroy } from '@cornerstonejs/tools';
import { Subject } from 'rxjs';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

@Injectable({
  providedIn: 'root',
})
export class CornerstoneService implements OnDestroy {
  private renderingEngineId = 'RENDERING_ENGINE_ID';
  private renderingEngine!: RenderingEngine;
  private toolGroup!: csToolTypes.IToolGroup;
  private initialized = false;

  constructor() {}

  async init() {
    try {
      if (this.initialized) {
        return;
      }

      initProviders();
      cornerstoneDICOMImageLoader.init();
      initVolumeLoader();
      await Promise.all([
        csRenderInit(),
        csToolInit({
          addons: {
            polySeg: polySeg as any,
          },
        }),
      ]);

      this.renderingEngine = new RenderingEngine(this.renderingEngineId);

      this.initialized = true;
      console.debug('CornerstoneService initialized');
    } catch (error) {
      console.error('Failed to initialize CornerstoneService:', error);
      throw error;
    }
  }

  private checkInitialized() {
    if (!this.initialized) {
      throw new Error('CornerstoneService not initialized');
    }
  }

  setToolGroup(toolGroup: csToolTypes.IToolGroup) {
    this.toolGroup = toolGroup;
  }

  getRenderingEngine() {
    this.checkInitialized();
    return this.renderingEngine;
  }

  getRenderingEngineId() {
    return this.renderingEngineId;
  }

  getToolGroup() {
    return this.toolGroup;
  }

  ngOnDestroy(): void {
    this.renderingEngine.destroy();
    eventTarget.reset();
    cache.purgeCache();
    destroy();
    metaData.removeAllProviders();
    imageLoader.unregisterAllImageLoaders();
    console.debug('cs service destroyed');
  }
}
