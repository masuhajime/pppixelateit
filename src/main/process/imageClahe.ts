import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const filter = async ({
  buffer,
  width,
  height,
  maxSlope,
}: {
  buffer: Buffer;
  width: number; height: number; maxSlope: number}): Promise<Buffer> => {
  const image = sharp(buffer);

  // const { info } = await sharp(buffer)
  //   .ensureAlpha()
  //   .raw()
  //   .toBuffer({ resolveWithObject: true });
  image.clahe({
    width,
    height,
    maxSlope,
  });
  return image.png().toBuffer();
};
export default filter;
