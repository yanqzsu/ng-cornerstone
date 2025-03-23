import { Enums as csCoreEnum } from '@cornerstonejs/core';
import { Enums as csToolEnum } from '@cornerstonejs/tools';

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
  imageIds?: string[]; // Auto-filled property, used for stack viewport
  volumeId?: string; // Auto-filled property, used for volume3d viewport
  studyInstanceUID?: string;
  seriesInstanceUID?: string;
  sopInstanceUIDs?: string[];
  urlRoot: string;
  schema: RequestSchema;
  viewportType: csCoreEnum.ViewportType;
  segmentType?: csToolEnum.SegmentationRepresentations;
}

export function imageInfoToUniqueId(imageInfo: ImageInfo): string {
  if (imageInfo) {
    if (imageInfo.schema === RequestSchema.wadoRs) {
      return RequestSchema.wadoRs + imageInfo?.studyInstanceUID + imageInfo?.seriesInstanceUID;
    } else if (imageInfo.schema === RequestSchema.nifti) {
      return RequestSchema.nifti + imageInfo.urlRoot;
    } else {
      console.error('Unsupported request schema');
      return '';
    }
  }
  return '';
}
