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

  console.log('rembg-node 1');
  const image = sharp(buffer);
  console.log('rembg-node 2');
  const rembg = new Rembg({
    logging: true,
  });
  console.log('rembg-node 3');
  const output = await rembg.remove(image);
  // console.log('rembg-node 4', output);

  return output.png().toBuffer();
};
export default imageRemoveBackground;
