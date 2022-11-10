export enum OrientationEnum {
  AXIAL = 'AXIAL',
  SAGITTAL = 'SAGITTAL',
  CORONAL = 'CORONAL',
  OBLIQUE = 'OBLIQUE',
}

export const OrientationStringList = Object.values(OrientationEnum).filter(
  (value) => typeof value === 'string',
);
