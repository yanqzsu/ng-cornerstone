import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;
export type FunctionProp<T> = (...args: SafeAny[]) => T;

export enum RequestSchema {
  WadoRs = 'wadors:',
  WadoUri = 'wadouri:',
}

export enum VolumeLoaderSchema {
  stream = 'cornerstoneStreamingImageVolume',
  dynamicStream = 'cornerstoneStreamingDynamicImageVolume',
}

export interface ImageInfo {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  sopInstanceUIDs?: string[];
  urlRoot: string;
  schema: RequestSchema;
  viewportType: ViewportType;
  volumeLoaderScheme?: VolumeLoaderSchema; // Loader id which defines which volume loader to use
}
