export type ImageResizeParameter = {
  buffer: Buffer;
  resizeBase: string;
  size: number;
  method: string;
};

export type ImageRemoveBackgroundParameter = {
  buffer: Buffer;
  algorithm: string;
  threshold: number;
};

export type ImageBufferOnlyParameter = {
  buffer: Buffer;
};
