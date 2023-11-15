import { Buffer } from 'buffer';
import sharp from 'sharp';
import cv from '@techstark/opencv-js';
import { ImageBufferOnlyParameter } from './dto';
import waitUntilOpenCVReady from './waitUntilOpenCvReady';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  await waitUntilOpenCVReady();
  // do denoise by sharp
  const { buffer } = param;
  const image = sharp(buffer);
  image.median(3);
  return image.png().toBuffer();
};
export default filter;
