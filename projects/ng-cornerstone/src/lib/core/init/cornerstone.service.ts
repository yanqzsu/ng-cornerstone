import initProviders from './initProviders';
import initCornerstoneDICOMImageLoader from './initCornerstoneDICOMImageLoader';
import initVolumeLoader from './initVolumeLoader';
import {
  cache,
  eventTarget,
  imageLoader,
  init as csRenderInit,
  metaData,
  RenderingEngine,
  Types as coCoreTypes,
} from '@cornerstonejs/core';
import { Injectable, OnDestroy } from '@angular/core';
import { destroy, init as csToolInit, ToolGroupManager, Types as csToolTypes } from '@cornerstonejs/tools';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CornerstoneService implements OnDestroy {
  private renderingEngineId = 'RENDERING_ENGINE_ID';
  private renderingEngine!: RenderingEngine;
  private toolGroupId = 'TOOL_GROUP_ID';
  private toolGroup!: csToolTypes.IToolGroup;

  private viewportManagerSubject = new Subject<string>();
  viewportReady$ = this.viewportManagerSubject.asObservable();

  constructor() {}

  async init() {
    initProviders();
    initCornerstoneDICOMImageLoader();
    initVolumeLoader();
    await Promise.all([csRenderInit(), csToolInit()]);
    console.debug('CornerstoneInitService');
    this.renderingEngine = new RenderingEngine(this.renderingEngineId);
    this.toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId)!;
  }

  getRenderingEngine() {
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

  registerViewport(viewportInput: coCoreTypes.PublicViewportInput) {
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
    ToolGroupManager.destroyToolGroup(this.toolGroupId);
    destroy();
    eventTarget.reset();
    cache.purgeCache();
    metaData.removeAllProviders();
    imageLoader.unregisterAllImageLoaders();
    console.debug('cs service destroyed');
  }
}
