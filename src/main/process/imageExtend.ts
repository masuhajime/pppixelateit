import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageExtendParameter } from './dto';

const filter = async (param: ImageExtendParameter): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);
  // get image size
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // get extend size
  const { unit } = param;
  let { top, bottom, left, right } = param;
  if (unit === 'pixel') {
    top *= 1;
    bottom *= 1;
    left *= 1;
    right *= 1;
  } else {
    top = Math.round(height * (top / 100));
    bottom = Math.round(height * (bottom / 100));
    left = Math.round(width * (left / 100));
    right = Math.round(width * (right / 100));
  }

  // trim transparent
  image.extend({
    top,
    bottom,
    left,
    right,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  return image.png().toBuffer();
};
export default filter;
