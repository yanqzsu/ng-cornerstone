import { Enums as csCoreEnum, Types } from '@cornerstonejs/core';

export enum LayoutEnum {
  STACK,
  SAGITTAL,
  ORTHOGRAPHIC,
  VOLUME,
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

export const ORTHOGRAPHIC_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-mpr-1',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.CORONAL,
    },
  },
  {
    viewportId: 'viewport-mpr-2',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.AXIAL,
    },
  },
  {
    viewportId: 'viewport-mpr-3',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.SAGITTAL,
    },
  },
];

export const VOLUME_VIEWPORT_INPUTS: Partial<Types.PublicViewportInput>[] = [
  {
    viewportId: 'viewport-volume-1',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.CORONAL,
    },
  },
  {
    viewportId: 'viewport-volume-2',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.AXIAL,
    },
  },
  {
    viewportId: 'viewport-volume-3',
    type: csCoreEnum.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      background: <Types.Point3>[0, 0, 0],
      orientation: csCoreEnum.OrientationAxis.SAGITTAL,
    },
  },
  {
    viewportId: 'viewport-volume-3d',
    type: csCoreEnum.ViewportType.VOLUME_3D,
    defaultOptions: {
      // background: CONSTANTS.BACKGROUND_COLORS.slicer3D as Types.RGB,
      background: <Types.Point3>[0.2, 0, 0.2],
    },
  },
];

export function generateViewportInputs(layout: LayoutEnum, suffix: string): Partial<Types.PublicViewportInput>[] {
  if (layout === LayoutEnum.STACK) {
    return STACK_VIEWPORT_INPUTS.map((input) => {
      const value = { ...input };
      value.viewportId = value.viewportId + suffix;
      return value;
    });
  } else if (layout === LayoutEnum.ORTHOGRAPHIC) {
    return ORTHOGRAPHIC_VIEWPORT_INPUTS.map((input) => {
      const value = { ...input };
      value.viewportId = value.viewportId + suffix;
      return value;
    });
  } else if (layout === LayoutEnum.VOLUME) {
    return VOLUME_VIEWPORT_INPUTS.map((input) => {
      const value = { ...input };
      value.viewportId = value.viewportId + suffix;
      return value;
    });
  } else if (layout === LayoutEnum.SAGITTAL) {
    return SAGITTAL_VIEWPORT_INPUTS.map((input) => {
      const value = { ...input };
      value.viewportId = value.viewportId + suffix;
      return value;
    });
  }
  return [];
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
