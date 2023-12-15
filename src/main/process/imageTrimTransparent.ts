import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  // do denoise by sharp
  const { buffer } = param;
  const image = sharp(buffer);

  // trim transparent
  image.trim({
    // threshold: 10,
    // lineArt: false,
  });

  return image.png().toBuffer();
};
export default filter;
