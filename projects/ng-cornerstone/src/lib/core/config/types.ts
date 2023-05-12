import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;
type Class<T> = new (...args: any[]) => T;
export type FunctionProp<T> = (...args: SafeAny[]) => T;

export enum RequestSchema {
  WadoRs = 'wadors:',
  WadoUri = 'wadouri:',
}

export enum VolumeLoaderSchema {
  stream = 'cornerstoneStreamingImageVolume',
  dynamicStream = 'cornerstoneStreamingDynamicImageVolume',
}

export interface ImageInfo {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  sopInstanceUIDs?: string[];
  urlRoot: string;
  schema: RequestSchema;
  viewportType: ViewportType;
  volumeLoaderScheme?: VolumeLoaderSchema; // Loader id which defines which volume loader to use
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
  Coronal,
  Axial,
  Sagittal,
}

export interface ToolConfig {
  label: string;
  icon: string;
  name: string;
  tool?: any;
  callback?: (
    renderingEngineId: string,
    viewportId: string,
    options?: any,
  ) => void;
  options?: any;
  types: ViewportType[];
}
