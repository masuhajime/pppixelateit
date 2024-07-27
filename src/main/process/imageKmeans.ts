import { Buffer } from 'buffer';
import { kmeans } from 'ml-kmeans';
import sharp from 'sharp';
import { ImageKmeansParameter } from './dto';
import { RGBA } from '../../dto/generals';
import { DitheringMatrix2_2, DitheringMatrix4_4 } from './imageKmeansMatrix';

type ColorDithering = {
  c: RGBA;
  c0?: RGBA;
  c1?: RGBA;
};

const filter = async (props: ImageKmeansParameter): Promise<Buffer> => {
  // 画像のピクセルデータを取得
  const {
    ditheringMatrix
  } = props;

  if (ditheringMatrix === 'matrix2' || ditheringMatrix === 'matrix4') {
    return filterDithering(props);
  }
  return filterKmeans(props);
};

const filterKmeans = async (props: ImageKmeansParameter): Promise<Buffer> => {
    const {
      buffer, number, seed
    } = props;

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const mat = [];
  for (let i = 0; i < data.length; i += 4) {
    mat.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
  }

  const r = kmeans(mat, number, {
    seed: seed === 0 ? undefined : seed,
  });
  const map = [];
  for (let i = 0; i < r.clusters.length; i += 1) {
    // normal colorings
    const cluster = r.clusters[i];
    map.push([
      r.centroids[cluster][0],
      r.centroids[cluster][1],
      r.centroids[cluster][2],
      r.centroids[cluster][3],
    ]);
  }
  // console.log("r.centroids", r.centroids);

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
}
const filterDithering = async (props: ImageKmeansParameter): Promise<Buffer> => {
  const {
    buffer, number,
    ditheringMatrix,
    ditheringStrength,
    seed
  } = props;

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  // push rgb data to mat
  const mat = [];
  for (let i = 0; i < data.length; i += 4) {
    mat.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
  }
  const r = kmeans(mat, number, {
    seed: seed === 0 ? undefined : seed,
  });
  // round centroids
  r.centroids = r.centroids.map((centroid) => [
    Math.round(centroid[0]),
    Math.round(centroid[1]),
    Math.round(centroid[2]),
    Math.round(centroid[3]),
  ]);


  const ditheringStrengthMax = ditheringMatrix === 'matrix2' ? 4 : 16;
  const selectMatrix = ditheringMatrix === 'matrix2' ? DitheringMatrix2_2 : DitheringMatrix4_4;
  const matrixDivision = ditheringMatrix === 'matrix2' ? 4 : 16;
  const matrixValueInterval = 256 / matrixDivision;
  const matrix = [] as number[];
  const matrixYLength = selectMatrix.length;
  const matrixXLength = selectMatrix[0].length;
  for (let j = 0; j < selectMatrix.length; j += 1) {
    for (let k = 0; k < selectMatrix[j].length; k += 1) {
      matrix.push(selectMatrix[j % matrixYLength][k % matrixXLength] * matrixValueInterval + matrixValueInterval/2);
    }
  }


  // calculate dithering colors
  const colorsCentroids = r.centroids;
  let colorDitherings: ColorDithering[] = [];
  for (let i = 0; i < colorsCentroids.length; i += 1) {
    if (colorsCentroids[i][3] <= 250) {
      continue;
    }
    colorDitherings.push({
      c: {
        r: colorsCentroids[i][0],
        g: colorsCentroids[i][1],
        b: colorsCentroids[i][2],
        a: colorsCentroids[i][3],
      },
    });
    for (let j = 0; j < colorsCentroids.length; j += 1) {
      if (i === j) {
        // skip same color on ditheirng
        continue;
      }
      if (colorsCentroids[j][3] <= 250) {
        continue;
      }
      const colorI = {
        r: colorsCentroids[i][0],
        g: colorsCentroids[i][1],
        b: colorsCentroids[i][2],
        a: colorsCentroids[i][3],
      };
      const colorIRGB = (colorI.r + colorI.g + colorI.b) / 3;
      const colorJ = {
        r: colorsCentroids[j][0],
        g: colorsCentroids[j][1],
        b: colorsCentroids[j][2],
        a: colorsCentroids[j][3],
      };
      const colorJRGB = (colorJ.r + colorJ.g + colorJ.b) / 3;

      // ditheringStrength;
      const ditheringStrengthCalc = ditheringStrength || ditheringStrengthMax;
      const increment = Math.ceil(matrixDivision / ditheringStrengthCalc);
      for (let c = 0; c < matrixDivision; c += increment) {
        if (c === 0) {
          continue
        }
        const c1 = matrixDivision - c;
        colorDitherings.push({
          c: {
            r: Math.floor((colorsCentroids[i][0] * c1 + colorsCentroids[j][0] * c) / matrixDivision),
            g: Math.floor((colorsCentroids[i][1] * c1 + colorsCentroids[j][1] * c) / matrixDivision),
            b: Math.floor((colorsCentroids[i][2] * c1 + colorsCentroids[j][2] * c) / matrixDivision),
            a: 255,
          },
          c0: colorIRGB > colorJRGB ? colorI : colorJ,
          c1: colorIRGB > colorJRGB ? colorJ : colorI,
        });
      }
    }
  }

  // console.log("ditheringStrength", {
  //   matrixDivision, ditheringStrength,
  //   "colorDitherings.length": colorDitherings.length
  // });

  // Fill the map with the centroids
  const map = [];

  for (let i = 0; i < mat.length; i += 1) {
    const rgba = {
      r: mat[i][0],
      g: mat[i][1],
      b: mat[i][2],
      a: mat[i][3],
    } as RGBA;
    if (rgba.a === 0) {
      map.push([
        0,
        0,
        0,
        0,
      ]);
      continue
    }
    let distance = 999999;
    let currentColorDithering: ColorDithering = {
      c: {
        r: 0,
        g: 0,
        b: 128,
        a: 255,
      },
    };
    for (let j = 0; j < colorDitherings.length; j += 1) {
      const c = colorDitherings[j];
      const d = Math.cbrt(
        // TODO: ここの処理が重いので同じ色はスキップしたい
        (rgba.r - c.c.r) ** 2 +
        (rgba.g - c.c.g) ** 2 +
        (rgba.b - c.c.b) ** 2
      );
      if (d < distance) {
        distance = d;
        currentColorDithering = c;
      }
    }
    let closestColor = currentColorDithering;

    if (!Number.isInteger(closestColor.c0?.r) || !Number.isInteger(closestColor.c1?.r)) {
      map.push([
        closestColor.c.r,
        closestColor.c.g,
        closestColor.c.b,
        closestColor.c.a,
      ]);
      continue;
    }
    const x = i % width;
    const y = Math.floor(i / width);
    const matrixIndex = (x % matrixXLength) + (y % matrixYLength) * matrixYLength;

    const rgbaAverageC = (closestColor.c.r + closestColor.c.g + closestColor.c.b) / 3;

    // check if c0, c1 is not undefined
    if (!closestColor.c0 || !closestColor.c1) {
      map.push([
        closestColor.c.r,
        closestColor.c.g,
        closestColor.c.b,
        closestColor.c.a,
      ]);
      continue;
    }


    const rgbaAverageC0 = Math.round((closestColor.c0.r + closestColor.c0.g + closestColor.c0.b) / 3);
    const rgbaAverageC1 = Math.round((closestColor.c1.r + closestColor.c1.g + closestColor.c1.b) / 3);
    const min = Math.min(rgbaAverageC0, rgbaAverageC1);
    const max = Math.max(rgbaAverageC0, rgbaAverageC1);
    const diff = max - min;
    const matrixCustom = [] as number[];
    for (let j = 0; j < selectMatrix.length; j += 1) {
      for (let k = 0; k < selectMatrix[j].length; k += 1) {
        const diffPerDivision = Math.round(diff / matrixDivision);
        matrixCustom.push(Math.round(selectMatrix[j % matrixYLength][k % matrixXLength] * diffPerDivision + min + diffPerDivision / 2));
      }
    }
    const matrixCustomValue = matrixCustom[matrixIndex];

    if (rgbaAverageC > matrixCustomValue) {
      map.push([
        closestColor.c0.r,
        closestColor.c0.g,
        closestColor.c0.b,
        closestColor.c0.a,
      ]);
    } else {
      map.push([
        closestColor.c1.r,
        closestColor.c1.g,
        closestColor.c1.b,
        closestColor.c1.a,
      ]);
    }

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
}

export default filter;
