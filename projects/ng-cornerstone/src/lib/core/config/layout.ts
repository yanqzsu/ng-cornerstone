import { Enums as csCoreEnum, Types } from '@cornerstonejs/core';
import { ImageInfo } from './types';

export enum LayoutEnum {
  LAYOUT_1x1, // 单视口布局
  LAYOUT_1x2, // 1行2列布局
  LAYOUT_1x3, // 1行3列布局
  LAYOUT_2x2, // 2行2列布局
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

// 不同方向的预设
export const ORIENTATION_PRESETS = [
  csCoreEnum.OrientationAxis.AXIAL,
  csCoreEnum.OrientationAxis.CORONAL,
  csCoreEnum.OrientationAxis.SAGITTAL,
];

export function generateViewportInputs(
  layout: LayoutEnum,
  suffix: string,
  imageInfo?: ImageInfo,
): Partial<Types.PublicViewportInput>[] {
  const viewportType = imageInfo?.viewportType || csCoreEnum.ViewportType.STACK;
  const isOrthographic = viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC;
  const result: Partial<Types.PublicViewportInput>[] = [];

  let count = 1;
  switch (layout) {
    case LayoutEnum.LAYOUT_1x1:
      count = 1;
      break;
    case LayoutEnum.LAYOUT_1x2:
      count = 2;
      break;
    case LayoutEnum.LAYOUT_1x3:
      count = 3;
      break;
    case LayoutEnum.LAYOUT_2x2:
      count = 4;
      break;
  }

  for (let i = 0; i < count; i++) {
    const viewport: Partial<Types.PublicViewportInput> = {
      viewportId: `viewport-${i + 1}${suffix}`,
      type: viewportType,
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
      },
    };

    // 对于ORTHOGRAPHIC类型且多视口布局，自动设置不同的orientation
    if (isOrthographic && count > 1) {
      // 使用数组中的索引，确保不会超出范围
      const orientationIndex = i % ORIENTATION_PRESETS.length;
      const orientation = ORIENTATION_PRESETS[orientationIndex];

      if (!viewport.defaultOptions) {
        viewport.defaultOptions = {};
      }
      viewport.defaultOptions.orientation = orientation;
    }

    // 如果是3D体积渲染视图并且是最后一个视口，设置为VOLUME_3D类型
    if (
      viewportType === csCoreEnum.ViewportType.ORTHOGRAPHIC &&
      count > 1 &&
      i === count - 1 &&
      layout === LayoutEnum.LAYOUT_2x2
    ) {
      viewport.type = csCoreEnum.ViewportType.VOLUME_3D;
      if (!viewport.defaultOptions) {
        viewport.defaultOptions = {};
      }
      viewport.defaultOptions.background = <Types.Point3>[0.2, 0, 0.2];
    }

    result.push(viewport);
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
