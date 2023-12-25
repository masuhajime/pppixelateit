import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);

  const { info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  image.clahe({
    width: 3,
    height: 3,
    maxSlope: 3,
  });
  return image.png().toBuffer();
};
export default filter;
