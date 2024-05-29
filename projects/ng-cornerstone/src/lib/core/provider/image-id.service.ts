import { Injectable } from '@angular/core';
import { metaData, utilities } from '@cornerstonejs/core';
import { api } from 'dicomweb-client';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dcmjs from 'dcmjs';
import getPixelSpacingInformation from './getPixelSpacingInformation';
import { calculateSUVScalingFactors, InstanceMetadata } from '@cornerstonejs/calculate-suv';
import { ImageInfo, RequestSchema } from '../config/types';

import { getPTImageIdInstanceMetadata } from './getPTImageIdInstanceMetadata';
import ptScalingMetaDataProvider from './ptScalingMetaDataProvider';

const { DicomMetaDictionary } = dcmjs.data;
@Injectable({
  providedIn: 'root',
})
export class ImageIdService {
  constructor() {}

  async wadoRsCreateImageIdsAndCacheMetaData(imageInfo: ImageInfo): Promise<string[]> {
    const MODALITY = '00080060';
    const SOP_INSTANCE_UID = '00080018';
    const { urlRoot, studyInstanceUID, seriesInstanceUID } = imageInfo;
    const client = new api.DICOMwebClient({ url: urlRoot });
    const instances = await client.retrieveSeriesMetadata({
      studyInstanceUID,
      seriesInstanceUID,
    });
    const modality = instances[0][MODALITY].Value[0];
    let sopInstanceUIDSet;
    if (imageInfo?.sopInstanceUIDs && imageInfo?.sopInstanceUIDs.length >= 0) {
      sopInstanceUIDSet = new Set<string>(imageInfo?.sopInstanceUIDs);
    } else {
      const instanceUIDs = instances.map((instanceMetaData) => {
        return instanceMetaData[SOP_INSTANCE_UID].Value[0];
      });
      sopInstanceUIDSet = new Set<string>(instanceUIDs);
      imageInfo.sopInstanceUIDs = instanceUIDs;
    }
    let imageIds: string[] = [];
    instances.forEach((instanceMetaData) => {
      const sopInstanceUID = instanceMetaData[SOP_INSTANCE_UID].Value[0];
      if (sopInstanceUIDSet.has(sopInstanceUID)) {
        const imageId = ImageIdService.wadoRsCreateImageIds({
          ...imageInfo,
          sopInstanceUIDs: [sopInstanceUID],
        });
        imageIds.push(...imageId); // only one image id
        cornerstoneDICOMImageLoader.wadors.metaDataManager.add(imageId[0], instanceMetaData);
      }
    });
    imageIds = this.convertMultiframeImageIds(imageIds);

    this.pixelSpacingProvider(imageIds);

    if (modality === 'PT') {
      this.ptProvider(imageIds);
    }
    return imageIds;
  }

  static createImageIds(imageInfo: ImageInfo) {
    if (imageInfo?.schema === RequestSchema.wadoRs) {
      return ImageIdService.wadoRsCreateImageIds(imageInfo);
    } else if (imageInfo?.schema === RequestSchema.wadoUri) {
      return ImageIdService.wadoURICreateImageIds(imageInfo);
    }
    return [];
  }

  static wadoURICreateImageIds(imageInfo: ImageInfo): string[] {
    if (!imageInfo.sopInstanceUIDs || imageInfo.sopInstanceUIDs.length === 0) {
      console.error('Invalid image info', imageInfo);
      return [];
    }
    const { urlRoot, studyInstanceUID, seriesInstanceUID, sopInstanceUIDs } = imageInfo;
    const wadoURIRoot = `${RequestSchema.wadoUri}${urlRoot}?requestType=WADO&studyUID=${studyInstanceUID}&seriesUID=${seriesInstanceUID}&contentType=application%2Fdicom`;
    return sopInstanceUIDs!.map((uid) => {
      return `${wadoURIRoot}&objectUID=${uid}`;
    });
  }

  static wadoRsCreateImageIds(imageInfo: ImageInfo): string[] {
    if (!imageInfo.sopInstanceUIDs || imageInfo.sopInstanceUIDs.length === 0) {
      console.error('Invalid image info', imageInfo);
      return [];
    }
    const { urlRoot, studyInstanceUID, seriesInstanceUID, sopInstanceUIDs } = imageInfo;
    const wadoURIRoot = `${RequestSchema.wadoRs}${urlRoot}/studies/${studyInstanceUID}/series/${seriesInstanceUID}`;
    return sopInstanceUIDs!.map((uid) => {
      return `${wadoURIRoot}/instances/${uid}/frames/1`;
    });
  }

  convertMultiframeImageIds(imageIds: string[]): string[] {
    const newImageIds: string[] = [];
    imageIds.forEach((imageId) => {
      const { imageIdFrameless } = this.getFrameInformation(imageId);
      const instanceMetaData = metaData.get('multiframeModule', imageId);
      if (instanceMetaData && instanceMetaData.NumberOfFrames && instanceMetaData.NumberOfFrames > 1) {
        const NumberOfFrames = instanceMetaData.NumberOfFrames;
        for (let i = 0; i < NumberOfFrames; i++) {
          const newImageId = imageIdFrameless + (i + 1);
          newImageIds.push(newImageId);
        }
      } else newImageIds.push(imageId);
    });
    return newImageIds;
  }

  getFrameInformation(imageId): {
    frameIndex: number;
    imageIdFrameless: string;
  } {
    if (imageId.includes('wadors:')) {
      const frameIndex = imageId.indexOf('/frames/');
      const imageIdFrameless = frameIndex > 0 ? imageId.slice(0, frameIndex + 8) : imageId;
      return {
        frameIndex,
        imageIdFrameless,
      };
    } else {
      const frameIndex = imageId.indexOf('&frame=');
      let imageIdFrameless = frameIndex > 0 ? imageId.slice(0, frameIndex + 7) : imageId;
      if (!imageIdFrameless.includes('&frame=')) {
        imageIdFrameless = imageIdFrameless + '&frame=';
      }
      return {
        frameIndex,
        imageIdFrameless,
      };
    }
  }

  pixelSpacingProvider(imageIds: string[]): void {
    imageIds.forEach((imageId) => {
      let instanceMetaData = cornerstoneDICOMImageLoader.wadors.metaDataManager.get(imageId);

      // It was using JSON.parse(JSON.stringify(...)) before but it is 8x slower
      instanceMetaData = this.removeInvalidTags(instanceMetaData);

      if (instanceMetaData) {
        // Add calibrated pixel spacing
        const metadata = DicomMetaDictionary.naturalizeDataset(instanceMetaData);
        const pixelSpacing = getPixelSpacingInformation(metadata);

        if (pixelSpacing) {
          utilities.calibratedPixelSpacingMetadataProvider.add(
            imageId,
            pixelSpacing.map((s) => parseFloat(s)),
          );
        }
      }
    });
  }
  ptProvider(imageIds: string[]): void {
    const instanceMetadataArray: InstanceMetadata[] = [];
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
        instanceMetadataArray.push(instanceMetadata);
      }
    });
    if (instanceMetadataArray.length) {
      const suvScalingFactors = calculateSUVScalingFactors(instanceMetadataArray);
      instanceMetadataArray.forEach((instanceMetadata, index) => {
        ptScalingMetaDataProvider.addInstance(imageIds[index], suvScalingFactors[index]);
      });
    }
  }

  removeInvalidTags(srcMetadata) {
    // Object.create(null) make it ~9% faster
    const dstMetadata = Object.create(null);
    const tagIds = Object.keys(srcMetadata);
    let tagValue;

    tagIds.forEach((tagId) => {
      tagValue = srcMetadata[tagId];

      if (tagValue !== undefined && tagValue !== null) {
        dstMetadata[tagId] = tagValue;
      }
    });

    return dstMetadata;
  }
}
