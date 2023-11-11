import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);
  image.clahe({
    height: 512,
    width: 512,
  });
  return image.png().toBuffer();
};
export default filter;
