/* eslint-disable no-continue */
import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageOutlineParameter } from './dto';
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

const getPixelColorAround = (
  buffer: Buffer,
  width: number,
  x: number,
  y: number,
) => {
  const around = [
    getPixelColorAt(buffer, width, x - 1, y - 1),
    getPixelColorAt(buffer, width, x, y - 1),
    getPixelColorAt(buffer, width, x + 1, y - 1),
    getPixelColorAt(buffer, width, x - 1, y),
    getPixelColorAt(buffer, width, x + 1, y),
    getPixelColorAt(buffer, width, x - 1, y + 1),
    getPixelColorAt(buffer, width, x, y + 1),
    getPixelColorAt(buffer, width, x + 1, y + 1),
  ];
  return around.filter((a) => a !== undefined) as RGBA[];
};

const filter = async (param: ImageOutlineParameter): Promise<Buffer> => {
  const { buffer, lineSide, pixelCountAround, outlineColor } = param;
  const image = sharp(buffer);
  // get with and height
  const { info, data } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bufferUpdating = Buffer.from(data);
  const { width } = info;
  const { height } = info;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = 4 * (width * y + x);
      const colorAround = getPixelColorAround(data, width, x, y);
      const colorCurrent = getPixelColorAt(data, width, x, y);

      if (colorAround.length !== 8) {
        continue;
      }

      if (lineSide === 'outer') {
        const countColorNotTransparent = colorAround.filter(
          (color) => color?.a > 0,
        ).length;
        if (
          colorCurrent?.a === 0 &&
          pixelCountAround <= countColorNotTransparent
        ) {
          bufferUpdating[offset + 0] = outlineColor.r;
          bufferUpdating[offset + 1] = outlineColor.g;
          bufferUpdating[offset + 2] = outlineColor.b;
          bufferUpdating[offset + 3] = outlineColor.a;
        }
      }
      // draw outline in inner side
      if (lineSide === 'inner') {
        const countColorTransparent = colorAround.filter(
          (color) => color?.a === 255,
        ).length;
        if (
          colorCurrent?.a !== 0 &&
          pixelCountAround >= countColorTransparent
        ) {
          bufferUpdating[offset + 0] = outlineColor.r;
          bufferUpdating[offset + 1] = outlineColor.g;
          bufferUpdating[offset + 2] = outlineColor.b;
          bufferUpdating[offset + 3] = outlineColor.a;
        }
      }
    }
  }

  return sharp(bufferUpdating, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
};
export default filter;
