import sharp from 'sharp';
import { ImageResizeParameter } from './dto';

const imageResize = async (param: ImageResizeParameter): Promise<Buffer> => {
  const { buffer, method, resizeBase, size } = param;
  const image = sharp(buffer);
  // get image size
  const metadata = await image.metadata();
  const { width, height } = metadata;
  if (width === undefined || height === undefined) {
    throw new Error('Image size is undefined');
  }

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
  switch (resizeBase) {
    case 'width':
      image.resize(size, null, {
        kernel,
      });
      break;
    case 'height':
      image.resize(null, size, {
        kernel,
      });
      break;
    case 'longer':
      if (width > height) {
        image.resize(size, null, {
          kernel,
        });
      } else {
        image.resize(null, size, {
          kernel,
        });
      }
      break;
    case 'shorter':
      if (width < height) {
        image.resize(null, size, {
          kernel,
        });
      } else {
        image.resize(size, null, {
          kernel,
        });
      }

      break;
    default:
      image.resize(size, null, {
        kernel,
      });
      break;
  }
  // if (resizeBase === 'width') {
  //   image.resize(size, null, {
  //     kernel,
  //   });
  // } elseif (resizeBase === 'width') {
  //   image.resize(null, size, {
  //     kernel,
  //   });
  // }

  return image.toBuffer();
};
export default imageResize;
