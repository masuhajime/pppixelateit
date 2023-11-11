import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);
  console.warn(`not implemented:${__filename}`);
  return image.png().toBuffer();
};
export default filter;
