import sharp from 'sharp';
import { ImageResizeParameter } from './dto';

const imageResize = async (param: ImageResizeParameter): Promise<Buffer> => {
  const { buffer, method, resizeBase, size } = param;
  const image = sharp(buffer);

  // const kernels = keyof sharp.KernelEnum;
  let kernel;
  switch (method) {
    case 'nearest':
      kernel = sharp.kernel.nearest;
      break;
    case 'cubic':
      kernel = sharp.kernel.cubic;
      break;
    case 'mitchell':
      kernel = sharp.kernel.mitchell;
      break;
    case 'lanczos2':
      kernel = sharp.kernel.lanczos2;
      break;
    case 'lanczos3':
      kernel = sharp.kernel.lanczos3;
      break;
    default:
      kernel = sharp.kernel.nearest;
      break;
  }
  if (resizeBase === 'width') {
    image.resize(size, null, {
      kernel,
    });
  } else {
    image.resize(null, size, {
      kernel,
    });
  }

  console.log('imageResize aaaa');

  return image.toBuffer();
};
export default imageResize;
