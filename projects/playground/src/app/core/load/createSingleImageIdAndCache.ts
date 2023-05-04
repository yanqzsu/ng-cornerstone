import { data } from 'dcmjs';
import { getPTImageIdInstanceMetadata } from './getPTImageIdInstanceMetadata';
import { utilities } from '@cornerstonejs/core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { getPixelSpacingInformation } from './getPixelSpacingInformation';
const { calibratedPixelSpacingMetadataProvider } = utilities;
import { DICOM_SERVER } from '../config/server';
const { DicomMetaDictionary } = data;

export function createSingleImageIdsAndCacheMetaData(
  instance: any,
  isWadoRs: boolean = true,
) {
  const instanceMetaData = DicomMetaDictionary.naturalizeDataset(instance);
  const studyInstanceUID = instanceMetaData.StudyInstanceUID;
  const seriesInstanceUID = instanceMetaData.SeriesInstanceUID;
  const sopInstanceUID = instanceMetaData.SOPInstanceUID;
  const numberOfFrames = instanceMetaData.NumberOfFrames;
  const prefix = isWadoRs ? 'wadors:' : 'wadouri:';
  let imageId;
  if (numberOfFrames > 0) {
    imageId =
      prefix +
      DICOM_SERVER +
      '/studies/' +
      studyInstanceUID +
      '/series/' +
      seriesInstanceUID +
      '/instances/' +
      sopInstanceUID +
      '/frames/' +
      1;
    // Math.round(numberOfFrames / 2);
  } else {
    imageId =
      prefix +
      DICOM_SERVER +
      '/studies/' +
      studyInstanceUID +
      '/series/' +
      seriesInstanceUID +
      '/instances/' +
      sopInstanceUID +
      // '/pixeldata';
      '/frames/' +
      1;
  }
  console.log(seriesInstanceUID + ' ' + sopInstanceUID);
  cornerstoneWADOImageLoader.wadors.metaDataManager.add(imageId, instance);

  // Add calibrated pixel spacing
  const spaceInfo = getPixelSpacingInformation(instanceMetaData);
  if (spaceInfo && Array.isArray(spaceInfo.pixelSpacing)) {
    calibratedPixelSpacingMetadataProvider.add(
      imageId,
      spaceInfo.pixelSpacing.map((s) => parseFloat(String(s))) as [
        number,
        number,
      ],
    );
  }
  return imageId;
}

export function getImageFrameURI(metadataURI, metadata) {
  // Use the BulkDataURI if present int the metadata
  if (metadata['7FE00010'] && metadata['7FE00010'].BulkDataURI) {
    return metadata['7FE00010'].BulkDataURI;
  }

  // fall back to using frame #1
  return metadataURI + '/frames/1';
}
