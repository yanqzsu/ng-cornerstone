import { Enums as csCoreEnum, Types } from '@cornerstonejs/core';
import { ImageInfo } from './types';

export enum LayoutEnum {
  LAYOUT_1x1, // Single viewport layout
  LAYOUT_1x2, // 1 row 2 columns layout
  LAYOUT_1x3, // 1 row 3 columns layout
  LAYOUT_2x2, // 2 rows 2 columns layout
}

export const STACK_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-stack',
    type: csCoreEnum.ViewportType.STACK,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
    },
  },
];

export const SAGITTAL_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-mpr-sagittal',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.SAGITTAL,
    },
  },
];

export const CORONAL_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-mpr-coronal',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.CORONAL,
    },
  },
];

export const AXIAL_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-mpr-axial',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.AXIAL,
    },
  },
];

export const VOLUME_3D_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-volume',
    type: csCoreEnum.ViewportType.VOLUME_3D,
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2],
    },
  },
];

export function generateViewportInputs(
  layout: LayoutEnum,
  suffix: string,
  imageInfo?: ImageInfo,
): Partial<Types.PublicViewportInput>[] {
  const viewportType = imageInfo?.viewportType || csCoreEnum.ViewportType.STACK;
  const isStack = viewportType === csCoreEnum.ViewportType.STACK;
  const result: Partial<Types.PublicViewportInput>[] = [];

  switch (layout) {
    case LayoutEnum.LAYOUT_1x1:
      // 1x1 layout: set viewportType according to imageType
      if (viewportType === csCoreEnum.ViewportType.STACK) {
        const viewportInput = structuredClone(STACK_VIEWPORT_INPUTS[0]);
        viewportInput.viewportId = `viewport-stack-${suffix}`;
        result.push(viewportInput);
      } else if (viewportType === csCoreEnum.ViewportType.VOLUME_3D) {
        const viewportInput = structuredClone(VOLUME_3D_VIEWPORT_INPUTS[0]);
        viewportInput.viewportId = `viewport-volume-${suffix}`;
        result.push(viewportInput);
      } else {
        const viewportInput = structuredClone(SAGITTAL_VIEWPORT_INPUTS[0]);
        viewportInput.viewportId = `viewport-sagittal-${suffix}`;
        result.push(viewportInput);
      }
      break;

    case LayoutEnum.LAYOUT_1x2:
      // 1x2 layout: all stack when imageType is stack, otherwise one volume3D one sagittal
      if (isStack) {
        for (let i = 0; i < 2; i++) {
          const viewportInput = structuredClone(STACK_VIEWPORT_INPUTS[0]);
          viewportInput.viewportId = `viewport-stack-${i + 1}${suffix}`;
          result.push(viewportInput);
        }
      } else {
        const sagittalViewport = structuredClone(SAGITTAL_VIEWPORT_INPUTS[0]);
        sagittalViewport.viewportId = `viewport-sagittal-${suffix}`;
        result.push(sagittalViewport);

        const volumeViewport = structuredClone(VOLUME_3D_VIEWPORT_INPUTS[0]);
        volumeViewport.viewportId = `viewport-volume-${suffix}`;
        result.push(volumeViewport);
      }
      break;

    case LayoutEnum.LAYOUT_1x3:
      // 1x3 layout: all stack when imageType is stack, otherwise one volume3D one sagittal one axial
      if (isStack) {
        for (let i = 0; i < 3; i++) {
          const viewportInput = structuredClone(STACK_VIEWPORT_INPUTS[0]);
          viewportInput.viewportId = `viewport-stack-${i + 1}${suffix}`;
          result.push(viewportInput);
        }
      } else {
        const sagittalViewport = structuredClone(SAGITTAL_VIEWPORT_INPUTS[0]);
        sagittalViewport.viewportId = `viewport-sagittal-${suffix}`;
        result.push(sagittalViewport);

        const axialViewport = structuredClone(AXIAL_VIEWPORT_INPUTS[0]);
        axialViewport.viewportId = `viewport-axial-${suffix}`;
        result.push(axialViewport);

        const volumeViewport = structuredClone(VOLUME_3D_VIEWPORT_INPUTS[0]);
        volumeViewport.viewportId = `viewport-volume-${suffix}`;
        result.push(volumeViewport);
      }
      break;

    case LayoutEnum.LAYOUT_2x2:
      // 2x2 layout: all stack when imageType is stack, otherwise one volume3D one sagittal one axial one coronal
      if (isStack) {
        for (let i = 0; i < 4; i++) {
          const viewportInput = structuredClone(STACK_VIEWPORT_INPUTS[0]);
          viewportInput.viewportId = `viewport-stack-${i + 1}${suffix}`;
          result.push(viewportInput);
        }
      } else {
        const sagittalViewport = structuredClone(SAGITTAL_VIEWPORT_INPUTS[0]);
        sagittalViewport.viewportId = `viewport-sagittal-${suffix}`;
        result.push(sagittalViewport);

        const axialViewport = structuredClone(AXIAL_VIEWPORT_INPUTS[0]);
        axialViewport.viewportId = `viewport-axial-${suffix}`;
        result.push(axialViewport);

        const coronalViewport = structuredClone(CORONAL_VIEWPORT_INPUTS[0]);
        coronalViewport.viewportId = `viewport-coronal-${suffix}`;
        result.push(coronalViewport);

        const volumeViewport = structuredClone(VOLUME_3D_VIEWPORT_INPUTS[0]);
        volumeViewport.viewportId = `viewport-volume-${suffix}`;
        result.push(volumeViewport);
      }
      break;
  }

  return result;
}

export function generateRandomString(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return '-' + result;
}
