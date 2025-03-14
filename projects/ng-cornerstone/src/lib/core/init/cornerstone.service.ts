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
import { Injectable, OnDestroy } from '@angular/core';
import { init as csToolInit, Types as csToolTypes, destroy } from '@cornerstonejs/tools';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CornerstoneService implements OnDestroy {
  private renderingEngineId = 'RENDERING_ENGINE_ID';
  private renderingEngine!: RenderingEngine;
  private toolGroupId = 'TOOL_GROUP_ID';
  private toolGroup!: csToolTypes.IToolGroup;
  private initialized = false;

  private viewportManagerSubject = new Subject<string>();
  viewportReady$ = this.viewportManagerSubject.asObservable();

  constructor() {}

  async init() {
    try {
      if (this.initialized) {
        return;
      }

      initProviders();
      // cornerstoneDICOMImageLoader.init();
      initVolumeLoader();
      await Promise.all([csRenderInit(), csToolInit()]);

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

  getToolGroupId() {
    return this.toolGroupId;
  }

  registerViewport(viewportInput: csCoreTypes.PublicViewportInput) {
    this.renderingEngine.enableElement(viewportInput);
    this.toolGroup.addViewport(viewportInput.viewportId, this.renderingEngineId);
    this.viewportManagerSubject.next(viewportInput.viewportId);
    console.debug('Viewport register:', viewportInput.viewportId);
  }

  unregisterViewport(viewportId: string) {
    this.renderingEngine.disableElement(viewportId);
    this.toolGroup.removeViewports(this.renderingEngineId, viewportId);
    console.debug('Viewport unregister:', viewportId);
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
