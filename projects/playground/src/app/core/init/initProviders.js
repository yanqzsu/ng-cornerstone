import * as cornerstone from '@cornerstonejs/core';
import ptScalingMetaDataProvider from '../provider/ptScalingMetaDataProvider';
import WADORSHeaderProvider from '../provider/WADORSHeaderProvider';

const { calibratedPixelSpacingMetadataProvider } = cornerstone.utilities;

export default function initProviders() {
  cornerstone.metaData.addProvider(
    WADORSHeaderProvider.get.bind(WADORSHeaderProvider),
    9999,
  );
  cornerstone.metaData.addProvider(
    ptScalingMetaDataProvider.get.bind(ptScalingMetaDataProvider),
    10000,
  );
  cornerstone.metaData.addProvider(
    calibratedPixelSpacingMetadataProvider.get.bind(
      calibratedPixelSpacingMetadataProvider,
    ),
    11000,
  );
}
