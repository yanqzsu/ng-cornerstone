import {
  AnnotationTool,
  AngleTool,
  ArrowAnnotateTool,
  BaseTool,
  BidirectionalTool,
  BrushTool,
  CircleScissorsTool,
  CrosshairsTool,
  DragProbeTool,
  EllipticalROITool,
  LengthTool,
  MagnifyTool,
  MIPJumpToClickTool,
  PanTool,
  PlanarFreehandROITool,
  ProbeTool,
  RectangleROIStartEndThresholdTool,
  RectangleROIThresholdTool,
  RectangleROITool,
  RectangleScissorsTool,
  SegmentationDisplayTool,
  SphereScissorsTool,
  StackScrollMouseWheelTool,
  StackScrollTool,
  TrackballRotateTool,
  VolumeRotateMouseWheelTool,
  WindowLevelTool,
  ZoomTool,
} from '@cornerstonejs/tools';
import { getRenderingEngine, Types } from '@cornerstonejs/core';

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
}

type Class<T> = new (...args: any[]) => T;
export interface ToolConfig {
  label: string;
  icon: string;
  name: string;
  tool?: any;
  callback?: (renderingEngineId: string, viewportId: string) => void;
}

function reset(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);

  // Get the volume viewport
  const viewport = <Types.IVolumeViewport>(
    renderingEngine?.getViewport(viewportId)
  );
  // Resets the viewport's camera
  viewport.resetCamera();
  viewport.render();
}

function flipV(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>(
    renderingEngine?.getViewport(viewportId)
  );
  const { flipVertical } = viewport.getCamera();
  viewport.setCamera({ flipVertical: !flipVertical });
  viewport.render();
}

function flipH(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>(
    renderingEngine?.getViewport(viewportId)
  );
  const { flipHorizontal } = viewport.getCamera();
  viewport.setCamera({ flipHorizontal: !flipHorizontal });
  viewport.render();
}

function rotate(renderingEngineId: string, viewportId: string): void {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  // Get the stack viewport
  const viewport = <Types.IStackViewport>(
    renderingEngine?.getViewport(viewportId)
  );
  const rotation = Math.random() * 360;
  viewport.setProperties({ rotation });
  viewport.render();
}

export const TOOL_CONFIG_MAP: { [key in ToolEnum]?: ToolConfig } = {
  [ToolEnum.Reset]: {
    icon: 'dmv-recover',
    label: '复位',
    name: 'Reset',
    callback: reset,
  },
  [ToolEnum.FlipV]: {
    icon: 'dmv-fliph',
    label: '水平翻转',
    name: 'fliph',
    callback: flipH,
  },
  [ToolEnum.FlipH]: {
    icon: 'dmv-flipv',
    label: '垂直翻转',
    name: 'flipV',
    callback: flipV,
  },
  [ToolEnum.Rotate]: {
    icon: 'dmv-rotate',
    label: '旋转',
    name: 'rotate',
    callback: rotate,
  },
  [ToolEnum.ArrowAnnotateTool]: {
    icon: 'dmv-annotation',
    label: '标注',
    tool: ArrowAnnotateTool,
    name: ArrowAnnotateTool.toolName,
  },
  [ToolEnum.AngleTool]: {
    icon: 'dmv-angle',
    label: '角度',
    tool: AngleTool,
    name: AngleTool.toolName,
  },
  [ToolEnum.LengthTool]: {
    icon: 'dmv-ruler',
    label: '长度',
    tool: LengthTool,
    name: LengthTool.toolName,
  },
  [ToolEnum.RectangleROITool]: {
    icon: 'dmv-rectangle',
    label: '矩形',
    tool: RectangleROITool,
    name: RectangleROITool.toolName,
  },
  [ToolEnum.EllipticalROITool]: {
    icon: 'dmv-ellipse',
    label: '椭圆',
    tool: EllipticalROITool,
    name: EllipticalROITool.toolName,
  },
  [ToolEnum.TrackballRotateTool]: {
    icon: 'dmv-rotate',
    label: '3D旋转',
    tool: TrackballRotateTool,
    name: TrackballRotateTool.toolName,
  },
  [ToolEnum.ZoomTool]: {
    icon: 'dmv-zoom',
    label: '缩放',
    tool: ZoomTool,
    name: ZoomTool.toolName,
  },
  [ToolEnum.PanTool]: {
    icon: 'dmv-pan',
    label: '移动',
    tool: PanTool,
    name: PanTool.toolName,
  },
  [ToolEnum.WindowLevelTool]: {
    icon: 'dmv-window-level',
    label: '窗位',
    tool: WindowLevelTool,
    name: WindowLevelTool.toolName,
  },
  [ToolEnum.StackScrollTool]: {
    icon: 'dmv-layer',
    label: '浏览',
    tool: StackScrollTool,
    name: StackScrollTool.toolName,
  },
};
