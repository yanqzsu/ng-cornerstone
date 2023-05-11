import { volumeLoader } from '@cornerstonejs/core';
import {
  cornerstoneStreamingDynamicImageVolumeLoader,
  cornerstoneStreamingImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';

export default function initVolumeLoader() {
  volumeLoader.registerUnknownVolumeLoader(
    cornerstoneStreamingImageVolumeLoader,
  );
  volumeLoader.registerVolumeLoader(
    'cornerstoneStreamingImageVolume',
    cornerstoneStreamingImageVolumeLoader,
  );
  volumeLoader.registerVolumeLoader(
    'cornerstoneStreamingDynamicImageVolume',
    cornerstoneStreamingDynamicImageVolumeLoader,
  );
}
