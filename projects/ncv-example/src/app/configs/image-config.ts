import { ImageInfo, RequestSchema } from 'ng-cornerstone';
import { Enums as csCoreEnum } from '@cornerstonejs/core';
import { Enums as csToolEnum } from '@cornerstonejs/tools';

// 扩展的配置接口，包含原始ImageInfo和别名
export interface ImageConfig {
  data: ImageInfo;
  alias: string;
}

// 分段信息配置
export const segmentConfigs: ImageConfig[] = [
  {
    data: {
      studyInstanceUID: '1.2.826.0.1.3680043.2.1125.1.91528005486758864638865058613078383',
      seriesInstanceUID: '1.2.826.0.1.3680043.2.1125.1.60463690517428352499744744731254945',
      urlRoot: '/dicom-web',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
      schema: RequestSchema.wadoRs,
    },
    alias: 'DICOM_TCGA-EJ-5495',
  },
  {
    data: {
      urlRoot: 'http://127.0.0.1:8080/nifti/TCGA-EJ-5359/label1.nii',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
    },
    alias: 'NIFTI_TCGA-EJ-5495',
  },
  {
    data: {
      urlRoot:
        'http://127.0.0.1:8080/nifti/MED_LYMPH_089/ec0976c5-4926-4434-87bc-7b591f8f4b63/Labels/20231211-035627/MED_LYMPH_089.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
    },
    alias: 'NIFTI_MED_LYMPH_089',
  },
  {
    data: {
      urlRoot:
        'http://127.0.0.1:8080/nifti/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Labels/20231211-035637/ABD_LYMPH_006.nii.gz',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.nifti,
      segmentType: csToolEnum.SegmentationRepresentations.Labelmap,
    },
    alias: 'NIFTI_ABD_LYMPH_006',
  },
];

// 图像信息配置
export const imageConfigs: ImageConfig[] = [
  {
    data: {
      studyInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.826',
      seriesInstanceUID: '1.2.840.113619.2.207.3596.11798570.20933.1191218624.828',
      urlRoot: '/dicom-web',
      viewportType: csCoreEnum.ViewportType.STACK,
      schema: RequestSchema.wadoRs,
    },
    alias: 'DICOM_STACK_FANTOM_1',
  },
  {
    data: {
      studyInstanceUID: '1.2.840.113711.7041813.2.3212.182276852.26.2116281012.16720',
      seriesInstanceUID: '1.3.12.2.1107.5.2.6.14114.30000006101211003631200000970',
      urlRoot: '/dicom-web',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.wadoRs,
    },
    alias: 'DICOM_ORTHO_IMR BREAST W/O & W/BILATERAL',
  },
  {
    data: {
      studyInstanceUID: '1.2.392.200055.5.4.80861305518.20150928153455671288',
      seriesInstanceUID: '1.2.392.200036.9142.10002202.1020869001.2.20150928174647.30151',
      urlRoot: '/dicom-web',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
    },
    alias: 'DICOM_ORTHO_Breast CE+',
  },
  {
    data: {
      studyInstanceUID: '1.2.392.200036.9116.4.2.105211.1467.20150907022356254.3.5',
      seriesInstanceUID: '1.2.392.200036.9116.4.2.105211.246.4001',
      urlRoot: '/dicom-web',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.wadoRs,
    },
    alias: 'DICOM_VOLUME_tmvs data1_MPRAGE',
  },
  {
    data: {
      studyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.6450.4006.104060160686700297294019173360',
      seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.6450.4006.692201102881185055002252472378',
      urlRoot: '/dicom-web',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.wadoRs,
    },
    alias: 'DICOM_TCGA-EJ-5495',
  },
  {
    data: {
      urlRoot: 'http://127.0.0.1:8080/nifti/TCGA-EJ-5359/image.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
    },
    alias: 'NIFTI_TCGA-EJ-5495',
  },
  {
    data: {
      urlRoot:
        'http://127.0.0.1:8080/nifti/MED_LYMPH_089/ec0976c5-4926-4434-87bc-7b591f8f4b63/Images/MED_LYMPH_089.nii.gz',
      viewportType: csCoreEnum.ViewportType.ORTHOGRAPHIC,
      schema: RequestSchema.nifti,
    },
    alias: 'NIFTI_MED_LYMPH_089',
  },
  {
    data: {
      urlRoot:
        'http://127.0.0.1:8080/nifti/ABD_LYMPH_006/fe0ace7a-b70a-43bc-9eb0-52359b4d2241/Images/ABD_LYMPH_006.nii.gz',
      viewportType: csCoreEnum.ViewportType.VOLUME_3D,
      schema: RequestSchema.nifti,
    },
    alias: 'NIFTI_ABD_LYMPH_006',
  },
];
