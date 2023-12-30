/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageDenoiseParameter } from './dto';
import { RGBA } from '../../dto/generals';

const filter = async (param: ImageDenoiseParameter): Promise<Buffer> => {
  // do denoise by sharp
  const { buffer, pattern } = param;
  const image = sharp(buffer);
  if (pattern === 'median_3') {
    image.median(3);
    return image.png().toBuffer();
  }
  if (pattern === 'median_5') {
    image.median(5);
    console.log('median_5');
    return image.png().toBuffer();
  }
  if (pattern === 'nearest_color_around') {
    // get width and height

    console.log('nearest_color_around');

    const { data, info } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const bufferUpdating = Buffer.from(data);
    const { width } = info;
    const { height } = info;
    console.log('nearest_color_around 1');

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const color = getPixelColorAt(bufferUpdating, width, x, y);
        if (color === undefined) {
          continue;
        }
        if (color.a === 0) {
          continue;
        }
        const around = getPixelColorAround(bufferUpdating, width, x, y);
        const sameColors = around.filter((a) => {
          return a.r === color.r && a.g === color.g && a.b === color.b;
        }) as RGBA[];
        if (sameColors.length > 0) {
          continue;
        }

        // get average color
        const average = around.reduce(
          (acc, cur) => {
            acc.r += cur.r;
            acc.g += cur.g;
            acc.b += cur.b;
            acc.a += cur.a;
            return acc;
          },
          { r: 0, g: 0, b: 0, a: 0 },
        );
        average.r /= around.length;
        average.g /= around.length;
        average.b /= around.length;
        average.a /= around.length;
        // get closest distance color in around
        let closestDistance = 100000;
        let closestColor: RGBA | undefined;
        around.forEach((a) => {
          const distance =
            Math.abs(a.r - average.r) +
            Math.abs(a.g - average.g) +
            Math.abs(a.b - average.b) +
            Math.abs(a.a - average.a);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestColor = a;
          }
        });
        if (closestColor === undefined) {
          continue;
        }
        bufferUpdating[4 * (width * y + x) + 0] = closestColor.r;
        bufferUpdating[4 * (width * y + x) + 1] = closestColor.g;
        bufferUpdating[4 * (width * y + x) + 2] = closestColor.b;
        bufferUpdating[4 * (width * y + x) + 3] = closestColor.a;
      }
    }

    return sharp(bufferUpdating, { raw: { width, height, channels: 4 } })
      .png()
      .toBuffer();
  }
  return image.png().toBuffer();
};
export default filter;

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
