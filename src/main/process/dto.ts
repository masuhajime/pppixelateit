import { type } from 'os';
import { RGBA } from '../../dto/generals';

export type ImageResizeParameter = {
  buffer: Buffer;
  resizeBase: string;
  size: number;
  method: string;
};

export type ImageRemoveBackgroundParameter = {
  buffer: Buffer;
  algorithm: string;
  threshold?: number;
};

export type ImageBufferOnlyParameter = {
  buffer: Buffer;
};

export type ImageOutlineParameter = {
  buffer: Buffer;
  pixelCountAround: number;
  lineSide: string;
  outlineColor: RGBA;
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
