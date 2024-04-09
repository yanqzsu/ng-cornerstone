import { Enums } from '@cornerstonejs/core';

export interface ImageInfo {
  studyInstanceUID?: string;
  seriesInstanceUID?: string;
  sopInstanceUID?: string;
  wadoRsRoot: string;
  viewportType: Enums.ViewportType;
  volumeId?: string;
}

export interface PatientInfo {
  patientName?: string;
  patientId?: string;
  patientSex?: string;
  patientBirthDate?: Date;
}

export interface StudyInfo extends PatientInfo {
  patientName?: string;
  studyDate?: string;
  studyID?: string;
  patientId?: string;
  modality?: string;
  patientSex?: string;
  patientBirthDate?: Date;
  studyInstanceUID?: string;
}

export interface SeriesInfo extends StudyInfo {
  accessionNumber?: string;
  seriesNumber?: string;
  seriesDesc?: string;
  seriesInstanceUID?: string;
  numberOfSeriesRelatedInstances?: number;
}

export interface InstanceInfo extends SeriesInfo {
  instanceNumber?: number;
  bitsAllocated?: number;
  columns?: number;
  rows?: number;
  sopInstanceUID?: string;
  numberOfFrames?: number; // Number of frames in a Multi-frame Image. See Section C.7.6.6.1.1 for further explanation.
}
