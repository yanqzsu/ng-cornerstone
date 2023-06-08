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
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';

export enum ToolEnum {
  Reset,
  BaseToo,
  PanTool,
  TrackballRotateTool,
  DragProbeTool,
  WindowLevelTool,
  ZoomTool,
  StackScrollTool,
  StackScrollMouseWheelTool,
  VolumeRotateMouseWheelTool,
  MIPJumpToClickTool,
  LengthTool,
  CrosshairsTool,
  ProbeTool,
  RectangleROITool,
  EllipticalROITool,
  BidirectionalTool,
  PlanarFreehandROITool,
  ArrowAnnotateTool,
  AngleTool,
  MagnifyTool,
  SegmentationDisplayTool,
  RectangleScissorsTool,
  CircleScissorsTool,
  SphereScissorsTool,
  RectangleROIThresholdTool,
  RectangleROIStartEndThresholdTool,
  BrushTool,
  FlipV,
  FlipH,
  Rotate,
  Next,
  Previous,
}

type Class<T> = new (...args: any[]) => T;
export interface ToolConfig {
  label: string;
  icon: string;
  name: string;
  tool?: any;
  callback?: (renderingEngineId: string, viewportId: string) => void;
  types: ViewportType[];
}

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
  const rotation = Math.random() * 360;
  viewport.setProperties({ rotation });
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

export const TOOL_CONFIG_MAP: { [key in ToolEnum]?: ToolConfig } = {
  [ToolEnum.Reset]: {
    icon: 'dmv-recover',
    label: '复位',
    name: 'Reset',
    callback: reset,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.FlipV]: {
    icon: 'dmv-fliph',
    label: '水平翻转',
    name: 'fliph',
    callback: flipH,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.FlipH]: {
    icon: 'dmv-flipv',
    label: '垂直翻转',
    name: 'flipV',
    callback: flipV,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.Rotate]: {
    icon: 'dmv-rotate',
    label: '旋转',
    name: 'rotate',
    callback: rotate,
    types: [ViewportType.STACK],
  },
  [ToolEnum.Next]: {
    icon: 'dmv-right',
    label: '下一张',
    name: 'next',
    callback: next,
    types: [ViewportType.STACK],
  },
  [ToolEnum.Previous]: {
    icon: 'dmv-left',
    label: '上一张',
    name: 'previous',
    callback: previous,
    types: [ViewportType.STACK],
  },
  [ToolEnum.ArrowAnnotateTool]: {
    icon: 'dmv-annotation',
    label: '标注',
    tool: ArrowAnnotateTool,
    name: ArrowAnnotateTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.AngleTool]: {
    icon: 'dmv-angle',
    label: '角度',
    tool: AngleTool,
    name: AngleTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.LengthTool]: {
    icon: 'dmv-ruler',
    label: '长度',
    tool: LengthTool,
    name: LengthTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.RectangleROITool]: {
    icon: 'dmv-rectangle',
    label: '矩形',
    tool: RectangleROITool,
    name: RectangleROITool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.EllipticalROITool]: {
    icon: 'dmv-ellipse',
    label: '椭圆',
    tool: EllipticalROITool,
    name: EllipticalROITool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.TrackballRotateTool]: {
    icon: 'dmv-rotate',
    label: '3D旋转',
    tool: TrackballRotateTool,
    name: TrackballRotateTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.ZoomTool]: {
    icon: 'dmv-zoom',
    label: '缩放',
    tool: ZoomTool,
    name: ZoomTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.PanTool]: {
    icon: 'dmv-pan',
    label: '移动',
    tool: PanTool,
    name: PanTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.WindowLevelTool]: {
    icon: 'dmv-window-level',
    label: '窗位',
    tool: WindowLevelTool,
    name: WindowLevelTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
  [ToolEnum.StackScrollTool]: {
    icon: 'dmv-layer',
    label: '浏览',
    tool: StackScrollTool,
    name: StackScrollTool.toolName,
    types: [ViewportType.STACK, ViewportType.ORTHOGRAPHIC],
  },
};
