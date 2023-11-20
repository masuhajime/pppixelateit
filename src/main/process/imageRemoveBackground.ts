import { removeBackground } from '@imgly/background-removal-node';
import { Buffer } from 'buffer';
import { Rembg } from '@xixiyahaha/rembg-node';
import sharp from 'sharp';
import { ImageRemoveBackgroundParameter } from './dto';

const imageRemoveBackground = async (
  param: ImageRemoveBackgroundParameter,
): Promise<Buffer> => {
  const { buffer } = param;

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let output: sharp.Sharp | undefined;
  console.log('imageRemoveBackground', {
    algo: param.algorithm,
    threshold: param.threshold,
  });

  if (param.algorithm === 'rembg') {
    const removed = await removeBackground(buffer, {
      model: 'medium',
    });
    output = sharp(await removed.arrayBuffer());
  } else {
    const image = sharp(buffer);
    const rembg = new Rembg({
      logging: false,
    });
    output = await rembg.remove(image);
  }
  // return Buffer.from(await removed.arrayBuffer());

  // make alpha below 254 to 0 and above 255 to 255
  const objOutput = await output
    .png()
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log('imageRemoveBackground', objOutput.info);

  return sharp(objOutput.data, {
    raw: {
      width: objOutput.info.width,
      height: objOutput.info.height,
      channels: objOutput.info.channels,
    },
  })
    .png()
    .toBuffer();
};
export default imageRemoveBackground;
