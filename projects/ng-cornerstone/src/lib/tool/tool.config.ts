import {
  AngleTool,
  ArrowAnnotateTool,
  EllipticalROITool,
  LengthTool,
  PanTool,
  RectangleROITool,
  StackScrollTool,
  TrackballRotateTool,
  WindowLevelTool,
  ZoomTool,
} from '@cornerstonejs/tools';
import { getRenderingEngine, Types } from '@cornerstonejs/core';
import { OrientationAxis, ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { IVolumeViewport } from '@cornerstonejs/core/dist/esm/types';
import { ToolConfig, ToolEnum } from './tool.types';

function reset(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the volume viewport
  const viewport = <Types.IVolumeViewport>renderingEngine?.getViewport(viewportId);
  // Resets the viewport's camera
  viewport.resetCamera();
  viewport.render();
}

function flipV(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>renderingEngine?.getViewport(viewportId);
  const { flipVertical } = viewport.getCamera();
  viewport.setCamera({ flipVertical: !flipVertical });
  viewport.render();
}

function flipH(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>renderingEngine?.getViewport(viewportId);
  const { flipHorizontal } = viewport.getCamera();
  viewport.setCamera({ flipHorizontal: !flipHorizontal });
  viewport.render();
}

function rotate(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>renderingEngine?.getViewport(viewportId);
  const rotation = viewport.getProperties()?.rotation || 0;
  viewport.setProperties({ rotation: rotation + 15 });
  viewport.render();
}

function next(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>renderingEngine?.getViewport(viewportId);
  // Get the current index of the image displayed
  const currentImageIdIndex = viewport.getCurrentImageIdIndex();
  // Increment the index, clamping to the last image if necessary
  const numImages = viewport.getImageIds().length;
  let newImageIdIndex = currentImageIdIndex + 1;
  newImageIdIndex = Math.min(newImageIdIndex, numImages - 1);
  // Set the new image index, the viewport itself does a re-render
  viewport.setImageIdIndex(newImageIdIndex);
}

function previous(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>renderingEngine?.getViewport(viewportId);
  // Get the current index of the image displayed
  const currentImageIdIndex = viewport.getCurrentImageIdIndex();
  // Increment the index, clamping to the first image if necessary
  let newImageIdIndex = currentImageIdIndex - 1;
  newImageIdIndex = Math.max(newImageIdIndex, 0);
  // Set the new image index, the viewport itself does a re-render
  viewport.setImageIdIndex(newImageIdIndex);
}

function changeOrientation(renderingEngineId: string, viewportId: string, options: any) {
  const renderingEngine = getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine!.getViewport(viewportId) as IVolumeViewport;
  const { orientation } = options;
  // Set the new orientation
  viewport.setOrientation(orientation);
  // Reset the camera after the normal changes
  viewport.resetCamera();
  viewport.render();
}

export const TOOL_CONFIG_MAP: { [key in ToolEnum]?: ToolConfig } = {
  [ToolEnum.Reset]: {
    icon: 'dmv-recover',
    label: 'Reset',
    name: 'reset',
    callback: reset,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.FlipV]: {
    icon: 'dmv-fliph',
    label: 'Flip-H',
    name: 'fliph',
    callback: flipH,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.FlipH]: {
    icon: 'dmv-flipv',
    label: 'Flip-V',
    name: 'flipV',
    callback: flipV,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.Rotate]: {
    icon: 'dmv-rotate',
    label: 'Rotate',
    name: 'rotate',
    callback: rotate,
    types: [ViewportType.STACK],
  },
  [ToolEnum.Sagittal]: {
    icon: 'dmv-sagittal',
    label: 'Sagittal',
    name: 'sagittal',
    callback: changeOrientation,
    options: { orientation: OrientationAxis.SAGITTAL },
    types: [ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.Coronal]: {
    icon: 'dmv-coronal',
    label: 'Coronal',
    name: 'coronal',
    callback: changeOrientation,
    options: { orientation: OrientationAxis.CORONAL },
    types: [ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.Axial]: {
    icon: 'dmv-axial',
    label: 'Axial',
    name: 'axial',
    callback: changeOrientation,
    options: { orientation: OrientationAxis.AXIAL },
    types: [ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.Next]: {
    icon: 'dmv-right',
    label: 'Next',
    name: 'next',
    callback: next,
    types: [ViewportType.STACK],
  },
  [ToolEnum.Previous]: {
    icon: 'dmv-left',
    label: 'Previous',
    name: 'previous',
    callback: previous,
    types: [ViewportType.STACK],
  },
  [ToolEnum.ArrowAnnotateTool]: {
    icon: 'dmv-annotation',
    label: 'Arrow',
    tool: ArrowAnnotateTool,
    name: ArrowAnnotateTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.AngleTool]: {
    icon: 'dmv-angle',
    label: 'Angle',
    tool: AngleTool,
    name: AngleTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.LengthTool]: {
    icon: 'dmv-ruler',
    label: 'Ruler',
    tool: LengthTool,
    name: LengthTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.RectangleROITool]: {
    icon: 'dmv-rectangle',
    label: 'Rectangle',
    tool: RectangleROITool,
    name: RectangleROITool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.EllipticalROITool]: {
    icon: 'dmv-ellipse',
    label: 'Ellipse',
    tool: EllipticalROITool,
    name: EllipticalROITool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.TrackballRotateTool]: {
    icon: 'dmv-rotate',
    label: 'Trackball',
    tool: TrackballRotateTool,
    name: TrackballRotateTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.ZoomTool]: {
    icon: 'dmv-zoom',
    label: 'Zoom',
    tool: ZoomTool,
    name: ZoomTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.PanTool]: {
    icon: 'dmv-pan',
    label: 'Pan',
    tool: PanTool,
    name: PanTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.WindowLevelTool]: {
    icon: 'dmv-window-level',
    label: 'WL',
    tool: WindowLevelTool,
    name: WindowLevelTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.StackScrollTool]: {
    icon: 'dmv-layer',
    label: 'Scroll',
    tool: StackScrollTool,
    name: StackScrollTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
};
