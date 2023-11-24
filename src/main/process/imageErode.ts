import { Buffer } from 'buffer';
import sharp from 'sharp';
import cv from '@techstark/opencv-js';
import { ImageBufferOnlyParameter } from './dto';
import waitUntilOpenCVReady from './waitUntilOpenCvReady';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  await waitUntilOpenCVReady();
  console.log('imageErode a');
  const { buffer } = param;

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  console.log('imageErode');

  console.log('imageErode 2', {
    data,
    width,
    height,
  });

  // const array = new Uint8ClampedArray(buffer);

  // const image = new ImageData(array, width, height);
  // const src = cv.matFromArray(height, width, cv.CV_8UC4, array);
  const src = cv.matFromImageData({ data, width, height });
  console.log('imageErode 3');

  const n4 = new cv.Mat(3, 3, cv.CV_8U);
  const n4Data = new Uint8Array([0, 1, 0, 1, 1, 1, 0, 1, 0]);
  n4.data.set(n4Data);
  const eroded = new cv.Mat();
  const anchor = new cv.Point(-1, -1);
  cv.Scalar.all(0);
  console.log('imageErode 4');
  cv.erode(
    src,
    eroded,
    n4,
    anchor,
    1,
    cv.BORDER_DEFAULT,
    new cv.Scalar(1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0),
  );
  console.log('imageErode 5');
  const bufferDst = Buffer.from(eroded.data);
  const imageDst = sharp(bufferDst, {
    raw: {
      width: eroded.cols,
      height: eroded.rows,
      channels: 4,
    },
  });
  console.log('imageErode 6');
  console.log('imageErode 7');

  const buf = imageDst.png().toBuffer();
  return buf;
};
export default filter;
