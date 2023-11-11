import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  const { buffer } = param;
  // https://docs.opencv.org/3.4/d1/d5c/tutorial_py_kmeans_opencv.html
  const image = sharp(buffer);
  return image.png().toBuffer();
};
export default filter;
