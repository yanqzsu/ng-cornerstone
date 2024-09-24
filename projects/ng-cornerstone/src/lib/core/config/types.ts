import { Enums } from '@cornerstonejs/core';
import { Enums as ToolEnum } from '@cornerstonejs/tools';

export type SafeAny = any;
export type FunctionProp<T> = (...args: SafeAny[]) => T;

export enum RequestSchema {
  wadoRs = 'wadors:',
  wadoUri = 'wadouri:',
  nifti = 'nifti:',
}

export enum VolumeLoaderSchema {
  stream = 'cornerstoneStreamingImageVolume',
  dynamicStream = 'cornerstoneStreamingDynamicImageVolume',
  nifti = 'nifti',
}

export interface ImageInfo {
  studyInstanceUID?: string;
  seriesInstanceUID?: string;
  sopInstanceUIDs?: string[];
  urlRoot: string;
  schema: RequestSchema;
  viewportType: Enums.ViewportType;
  volumeLoaderScheme?: VolumeLoaderSchema; // Loader id which defines which volume loader to use
  segmentType?: ToolEnum.SegmentationRepresentations;
}
