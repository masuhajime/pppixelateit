import { RGBA } from '../../dto/generals';

export type ImageResizeParameter = {
  buffer: Buffer;
  resizeBase: string;
  size: number;
  method: string;
};

export type ImageKmeansParameter = {
  buffer: Buffer;
  number: number;
  ditheringMatrix?: 'none' | 'matrix2' | 'matrix4';
  ditheringStrength?: number;
  seed?: number;
};

export type ImageColorPaletteParameter = {
  buffer: Buffer;
  paletteName: string;
};

export type ImageRemoveBackgroundParameter = {
  buffer: Buffer;
  algorithm: string;
  threshold?: number;
};

export type ImageBufferOnlyParameter = {
  buffer: Buffer;
};

export type ImageDenoiseParameter = {
  buffer: Buffer;
  pattern: string;
};

export type ImageOutlineParameter = {
  buffer: Buffer;
  pixelCountAround: string;
  lineSide: string;
  outlineColor: RGBA;
};

export type ImageRemoveEdgeParameter = {
  buffer: Buffer;
  pixelCount: number;
};

export type ImageFlattenParameter = {
  buffer: Buffer;
  color: RGBA;
};

export type ImageMaskParameter = {
  buffer: Buffer;
  mask: Buffer;
};

export type ImageAlphaThresholdFlattenParameter = {
  buffer: Buffer;
  threshold: number;
};

export type ImageTrimTransparentParameter = {
  buffer: Buffer;
};

export type ImageExtendParameter = {
  buffer: Buffer;
  unit: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type ImageExtendToAspectRatioParameter = {
  buffer: Buffer;
  width: number;
  height: number;
};
