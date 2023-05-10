import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types';

export enum RequestSchema {
  WadoRs = 'wadors:',
  WadoUri = 'wadouri:',
}

export interface ImageInfo {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  sopInstanceUIDs?: string[];
  urlRoot: string;
  schema: RequestSchema;
  viewportType: ViewportType;
}

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

export enum OrientationEnum {
  AXIAL = 'AXIAL',
  SAGITTAL = 'SAGITTAL',
  CORONAL = 'CORONAL',
  OBLIQUE = 'OBLIQUE',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;

export type FunctionProp<T> = (...args: SafeAny[]) => T;

export type ViewportConfig = Omit<PublicViewportInput, 'element'>;
