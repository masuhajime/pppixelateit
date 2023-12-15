import { Buffer } from 'buffer';
import sharp from 'sharp';
import { ImageExtendToAspectRatioParameter } from './dto';

const filter = async (
  param: ImageExtendToAspectRatioParameter,
): Promise<Buffer> => {
  const { buffer } = param;
  const image = sharp(buffer);
  // get image size
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // get extend size
  const { width: targetWidthRatio, height: targetHeightRatio } = param;
  const currentRatio = width / height;
  const targetRatio = targetWidthRatio / targetHeightRatio;
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;
  if (currentRatio > targetRatio) {
    const targetHeight = Math.round(width / targetRatio);
    const diff = targetHeight - height;
    top = Math.floor(diff / 2);
    bottom = Math.ceil(diff / 2);
  } else {
    const targetWidth = Math.round(height * targetRatio);
    const diff = targetWidth - width;
    left = Math.floor(diff / 2);
    right = Math.ceil(diff / 2);
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
