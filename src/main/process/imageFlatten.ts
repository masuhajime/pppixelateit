import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageFlattenParameter } from './dto';

const filter = async (param: ImageFlattenParameter): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);
  return image
    .flatten({
      background: {
        r: param.color.r,
        g: param.color.g,
        b: param.color.b,
        alpha: 255,
      },
    })
    .ensureAlpha()
    .png()
    .toBuffer();
};
export default filter;
