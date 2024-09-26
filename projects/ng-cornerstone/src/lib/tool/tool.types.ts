import { Enums } from '@cornerstonejs/core';

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
  Coronal,
  Axial,
  Sagittal,
}

export interface ToolConfig {
  label: string;
  icon: string;
  name: string;
  tool?: any;
  callback?: (renderingEngineId: string, viewportId: string, options?: any) => void;
  options?: any;
  types: Enums.ViewportType[];
  disabled?: boolean;
}
