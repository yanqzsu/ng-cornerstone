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

export enum ToolEnum {
  BaseToo,
  AnnotationTool,
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
}

type Class<T> = new (...args: any[]) => T;
export interface ToolConfig {
  label: string;
  icon: string;
  name: string;
  tool: any;
}

export const TOOL_CONFIG_MAP: { [key in ToolEnum]?: ToolConfig } = {
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
    label: '旋转',
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
