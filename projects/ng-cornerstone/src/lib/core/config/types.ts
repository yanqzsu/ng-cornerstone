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
  studyInstanceUID?: string;
  seriesInstanceUID?: string;
  sopInstanceUIDs?: string[];
  urlRoot: string;
  schema: RequestSchema;
  viewportType: csCoreEnum.ViewportType;
  volumeLoaderScheme?: VolumeLoaderSchema; // Loader id which defines which volume loader to use
  segmentType?: csToolEnum.SegmentationRepresentations;
}

export function imageInfoToVolumeId(imageInfo: ImageInfo | undefined): string {
  if (
    imageInfo &&
    (imageInfo.viewportType === csCoreEnum.ViewportType.VOLUME_3D ||
      imageInfo.viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC)
  ) {
    if (imageInfo.schema === RequestSchema.wadoRs) {
      return RequestSchema.wadoRs + imageInfo?.studyInstanceUID ?? '' + imageInfo?.seriesInstanceUID ?? '';
    } else if (imageInfo.schema === RequestSchema.nifti) {
      return RequestSchema.nifti + imageInfo.urlRoot;
    }
  }
  return '';
}
