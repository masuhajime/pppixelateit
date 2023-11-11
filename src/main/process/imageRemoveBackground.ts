import { removeBackground } from '@imgly/background-removal-node';
import { Buffer } from 'buffer';
import { Rembg } from '@xixiyahaha/rembg-node';
import sharp from 'sharp';
import { ImageBufferOnlyParameter } from './dto';

const imageRemoveBackground = async (
  param: ImageBufferOnlyParameter,
): Promise<Buffer> => {
  const { buffer } = param;
  // const removed = await removeBackground(buffer, {
  //   model: 'medium',
  // });
  // return Buffer.from(await removed.arrayBuffer());

  const image = sharp(buffer);
  const rembg = new Rembg({
    logging: false,
  });
  const output = await rembg.remove(image);

  return output.png().toBuffer();
};
export default imageRemoveBackground;
