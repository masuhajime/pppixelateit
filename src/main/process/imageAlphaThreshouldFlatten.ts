/* eslint-disable no-continue */
import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageAlphaThresholdFlattenParameter, ImageMaskParameter } from './dto';
import { RGBA } from '../../dto/generals';

const getPixelColorAt = (
  buffer: Buffer,
  width: number,
  x: number,
  y: number,
): RGBA | undefined => {
  const offset = 4 * (width * y + x);
  if (buffer.at(offset) === undefined) {
    return undefined;
  }
  return {
    a: buffer[offset + 3],
    b: buffer[offset + 2],
    g: buffer[offset + 1],
    r: buffer[offset + 0],
  };
};

const filter = async (
  param: ImageAlphaThresholdFlattenParameter,
): Promise<Buffer> => {
  const image = sharp(param.buffer);

  // get with and height
  const imageBufferObject = await image
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = imageBufferObject.info;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offsetImage = 4 * (imageBufferObject.info.width * y + x);

      const colorImage = getPixelColorAt(
        imageBufferObject.data,
        imageBufferObject.info.width,
        x,
        y,
      );
      if (colorImage === undefined) {
        continue;
      }

      if (colorImage?.a > (param.threshold / 100.0) * 255) {
        imageBufferObject.data[offsetImage + 3] = 255;
      } else {
        imageBufferObject.data[offsetImage + 3] = 0;
      }
    }
  }

  return sharp(imageBufferObject.data, {
    raw: {
      width: imageBufferObject.info.width,
      height: imageBufferObject.info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
};
export default filter;
