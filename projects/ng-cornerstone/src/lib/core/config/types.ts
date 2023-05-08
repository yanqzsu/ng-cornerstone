import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';

export interface ImageInfo {
  studyInstanceUID?: string;
  seriesInstanceUID?: string;
  sopInstanceUID?: string;
  wadoRsRoot: string;
  viewportType: ViewportType;
  volumeId?: string;
}

export interface PatientInfo {
  patientName?: string;
  patientId?: string;
  patientSex?: string;
  patientBirthDate?: Date;
}

export interface StudyInfo extends PatientInfo {
  patientName?: string;
  studyDate?: string;
  studyID?: string;
  patientId?: string;
  modality?: string;
  patientSex?: string;
  patientBirthDate?: Date;
  studyInstanceUID?: string;
}

export interface SeriesInfo extends StudyInfo {
  accessionNumber?: string;
  seriesNumber?: string;
  seriesDesc?: string;
  seriesInstanceUID?: string;
  numberOfSeriesRelatedInstances?: number;
}

export interface InstanceInfo extends SeriesInfo {
  instanceNumber?: number;
  bitsAllocated?: number;
  columns?: number;
  rows?: number;
  sopInstanceUID?: string;
  numberOfFrames?: number; // Number of frames in a Multi-frame Image. See Section C.7.6.6.1.1 for further explanation.
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
