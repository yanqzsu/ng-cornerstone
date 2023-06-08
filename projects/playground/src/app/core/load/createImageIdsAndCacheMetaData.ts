import { api } from 'dicomweb-client';
import dcmjs from 'dcmjs';
import { calculateSUVScalingFactors, InstanceMetadata } from '@cornerstonejs/calculate-suv';
import { getPTImageIdInstanceMetadata } from './getPTImageIdInstanceMetadata';
import { utilities } from '@cornerstonejs/core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import ptScalingMetaDataProvider from '../provider/ptScalingMetaDataProvider';
import getPixelSpacingInformation from './getPixelSpacingInformation';

const { DicomMetaDictionary } = dcmjs.data;
const { calibratedPixelSpacingMetadataProvider } = utilities;
/**
 * Uses dicomweb-client to fetch metadata of a study, cache it in cornerstone,
 * and return a list of imageIds for the frames.
 *
 * Uses the app config to choose which study to fetch, and which
 * dicom-web server to fetch it from.
 *
 * @returns {string[]} An array of imageIds for instances in the study.
 */

export default async function createImageIdsAndCacheMetaData(value) {
  const { studyInstanceUID, seriesInstanceUID, wadoRsRoot, viewportType } = value;
  const SOP_INSTANCE_UID = '00080018';
  const SERIES_INSTANCE_UID = '0020000E';
  const MODALITY = '00080060';

  const studySearchOptions = {
    studyInstanceUID: studyInstanceUID,
    seriesInstanceUID: seriesInstanceUID,
  };

  const client = new api.DICOMwebClient({ url: wadoRsRoot });
  const instances = await client.retrieveSeriesMetadata(studySearchOptions);
  const modality = instances[0][MODALITY].Value[0];

  const imageIds = instances.map((instanceMetaData) => {
    const seriesInstanceUID = instanceMetaData[SERIES_INSTANCE_UID].Value[0];
    const sopInstanceUID = instanceMetaData[SOP_INSTANCE_UID].Value[0];

    // const prefix =
    //   type === ViewportType.ORTHOGRAPHIC ? 'streaming-wadors:' : 'wadors:';
    const prefix = 'wadors:';

    const imageId =
      prefix +
      wadoRsRoot +
      '/studies/' +
      studyInstanceUID +
      '/series/' +
      seriesInstanceUID +
      '/instances/' +
      sopInstanceUID +
      '/frames/1';
    console.log(imageId);
    cornerstoneWADOImageLoader.wadors.metaDataManager.add(imageId, instanceMetaData);

    // Add calibrated pixel spacing
    const m = JSON.parse(JSON.stringify(instanceMetaData));
    const instance = DicomMetaDictionary.naturalizeDataset(m);
    const spacingInfo = getPixelSpacingInformation(instance);
    if (spacingInfo && Array.isArray(spacingInfo.pixelSpacing)) {
      calibratedPixelSpacingMetadataProvider.add(
        imageId,
        spacingInfo.pixelSpacing.map((s) => parseFloat(String(s))) as [number, number],
      );
    }

    return imageId;
  });

  // we don't want to add non-pet
  // Note: for 99% of scanners SUV calculation is consistent bw slices
  if (modality === 'PT') {
    const InstanceMetadataArray: InstanceMetadata[] = [];
    imageIds.forEach((imageId) => {
      const instanceMetadata = getPTImageIdInstanceMetadata(imageId);

      // TODO: Temporary fix because static-wado is producing a string, not an array of values
      // (or maybe dcmjs isn't parsing it correctly?)
      // It's showing up like 'DECY\\ATTN\\SCAT\\DTIM\\RAN\\RADL\\DCAL\\SLSENS\\NORM'
      // but calculate-suv expects ['DECY', 'ATTN', ...]
      if (typeof instanceMetadata.CorrectedImage === 'string') {
        instanceMetadata.CorrectedImage = (instanceMetadata.CorrectedImage as string).split('\\');
      }

      if (instanceMetadata) {
        InstanceMetadataArray.push(instanceMetadata);
      }
    });
    if (InstanceMetadataArray.length) {
      const suvScalingFactors = calculateSUVScalingFactors(InstanceMetadataArray);
      InstanceMetadataArray.forEach((instanceMetadata, index) => {
        ptScalingMetaDataProvider.addInstance(imageIds[index], suvScalingFactors[index]);
      });
    }
  }

  return imageIds;
}
