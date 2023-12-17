import { Buffer } from 'buffer';
import { kmeans } from 'ml-kmeans';
import sharp from 'sharp';
import { ImageKmeansParameter } from './dto';

const filter = async (param: ImageKmeansParameter): Promise<Buffer> => {
  const { buffer, number } = param;

  console.log('imageKmeans', param);
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
    mat.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
  }

  const r = kmeans(mat, number, {});
  console.log('imageKmeans 2', r);
  const map = [];
  for (let i = 0; i < r.clusters.length; i += 1) {
    const cluster = r.clusters[i];
    map.push([
      Math.round(r.centroids[cluster][0]),
      Math.round(r.centroids[cluster][1]),
      Math.round(r.centroids[cluster][2]),
      Math.round(r.centroids[cluster][3]),
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
