import { Buffer } from 'buffer';
import sharp from 'sharp';
import { kmeans } from 'ml-kmeans';
import { ImageBufferOnlyParameter } from './dto';
import waitUntilOpenCVReady from './waitUntilOpenCvReady';

const filter = async (param: ImageBufferOnlyParameter): Promise<Buffer> => {
  const { buffer } = param;

  // 画像のピクセルデータを取得

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  console.log('imageKmeans 3');
  // push rgb data to mat
  const mat = [];
  for (let i = 0; i < data.length; i += 4) {
    mat.push([data[i], data[i + 1], data[i + 2]]);
  }

  const r = kmeans(mat, 16, {});
  console.log('imageKmeans 2', r);
  const map = [];
  for (let i = 0; i < r.clusters.length; i += 1) {
    const cluster = r.clusters[i];
    map.push([
      Math.round(r.centroids[cluster][0]),
      Math.round(r.centroids[cluster][1]),
      Math.round(r.centroids[cluster][2]),
      255,
    ]);
  }

  const buf = Buffer.from(map.flat());
  return sharp(buf, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
};
export default filter;
