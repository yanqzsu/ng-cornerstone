import { cornerstoneNiftiImageLoader } from '@cornerstonejs/nifti-volume-loader';
import { VolumeLoaderSchema } from '../config/types';
import {
  imageLoader,
  volumeLoader,
  cornerstoneStreamingImageVolumeLoader,
  cornerstoneStreamingDynamicImageVolumeLoader,
} from '@cornerstonejs/core';

export default function initVolumeLoader() {
  volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);
  volumeLoader.registerVolumeLoader(VolumeLoaderSchema.stream, cornerstoneStreamingImageVolumeLoader);
  volumeLoader.registerVolumeLoader(VolumeLoaderSchema.dynamicStream, cornerstoneStreamingDynamicImageVolumeLoader);
  imageLoader.registerImageLoader(VolumeLoaderSchema.nifti, cornerstoneNiftiImageLoader);
}
