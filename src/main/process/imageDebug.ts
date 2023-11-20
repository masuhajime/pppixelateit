/* eslint-disable no-continue */
import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';
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

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);
  // get with and height
  const { info, data } = await image
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const bufferUpdating = Buffer.from(data);
  const { width } = info;
  const { height } = info;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = 4 * (width * y + x);
      const colorCurrent = getPixelColorAt(data, width, x, y);
      if (!colorCurrent) {
        continue;
      }
      bufferUpdating[offset + 0] = colorCurrent.a;
      bufferUpdating[offset + 1] = 0;
      bufferUpdating[offset + 2] = 0;
      bufferUpdating[offset + 3] = 255;
    }
  }

  return sharp(bufferUpdating, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
};
export default filter;
