import { volumeLoader } from '@cornerstonejs/core';
import {
  cornerstoneStreamingDynamicImageVolumeLoader,
  cornerstoneStreamingImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
import { VolumeLoaderSchema } from '../config/types';

export default function initVolumeLoader() {
  volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);
  volumeLoader.registerVolumeLoader(VolumeLoaderSchema.stream, cornerstoneStreamingImageVolumeLoader);
  volumeLoader.registerVolumeLoader(VolumeLoaderSchema.dynamicStream, cornerstoneStreamingDynamicImageVolumeLoader);
  volumeLoader.registerVolumeLoader(VolumeLoaderSchema.nifti, cornerstoneNiftiImageVolumeLoader);
}
