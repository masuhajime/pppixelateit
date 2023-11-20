/* eslint-disable no-continue */
import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageMaskParameter } from './dto';
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

const filter = async (param: ImageMaskParameter): Promise<Buffer> => {
  const image = sharp(param.buffer);
  const mask = sharp(param.mask);

  // get with and height
  const imageBufferObject = await image
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });
  const maskBufferObject = await mask
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const width = Math.min(
    imageBufferObject.info.width,
    maskBufferObject.info.width,
  );
  const height = Math.min(
    imageBufferObject.info.height,
    maskBufferObject.info.height,
  );
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offsetImage = 4 * (imageBufferObject.info.width * y + x);
      const offsetMask = 4 * (maskBufferObject.info.width * y + x);

      const colorImage = getPixelColorAt(
        imageBufferObject.data,
        imageBufferObject.info.width,
        x,
        y,
      );
      const colorMask = getPixelColorAt(
        maskBufferObject.data,
        maskBufferObject.info.width,
        x,
        y,
      );
      if (!colorMask || !colorImage) {
        continue;
      }
      if (colorMask.a === 255 || colorMask.a === 255) {
        continue;
      }
      let color = {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      };
      color = {
        r: colorImage.r,
        g: colorImage.g,
        b: colorImage.b,
        a: colorMask?.a,
      };
      imageBufferObject.data[offsetImage + 0] = color.r;
      imageBufferObject.data[offsetImage + 1] = color.g;
      imageBufferObject.data[offsetImage + 2] = color.b;
      imageBufferObject.data[offsetImage + 3] = color.a;
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
