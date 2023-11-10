// import cv from "@u4/opencv4nodejs";
// import cv from "@techstark/opencv-js"
import { Buffer } from 'buffer';
// import Jimp from 'jimp';
// import imglyRemoveBackground from '@imgly/background-removal';
// import { removeBackground } from '@imgly/background-removal-node';
import { RGBA, Vector2 } from '../dto/generals';
// import { removeBackground } from "@imgly/background-removal-node"
// const { removeBackground } = require('@imgly/background-removal-node');

export const greyscale = async (imageBuffer: Buffer) => {
  // const img = await Jimp.read(imageBuffer);
  // img.greyscale();
  // return img.getBufferAsync(Jimp.MIME_PNG);
  return imageBuffer;
};

type ResizeMethod =
  | 'nearestNeighbor'
  | 'bilinearInterpolation'
  | 'bicubicInterpolation'
  | 'hermiteInterpolation'
  | 'bezierInterpolation';
export const resizeBaseOn = async (
  imageBuffer: Buffer,
  side: string | 'width' | 'height',
  size: number,
  method: string | ResizeMethod,
) => {
  // create shape object from buffer
  return imageBuffer;

  return img.toBuffer();

  // const img = await Jimp.read(imageBuffer);
  // if (side === 'width') {
  //   img.resize(size, Jimp.AUTO, method);
  // } else {
  //   img.resize(Jimp.AUTO, size, method);
  // }
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

export const posterize = async (imageBuffer: Buffer, number: number) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);
  // img.posterize(number);
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

export const pixelate = async (imageBuffer: Buffer, number: number) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);
  // img.pixelate(number);
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

// export const drawOutline = async (base64: string, number: number) => {

//     let url = base64.replace(/^data:image\/\w+;base64,/, "");
//     let buffer = Buffer.from(url, 'base64');

//     let img = await Jimp.read(buffer);
//     // paint image outline to white
//     img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
//         if (x === 0 || y === 10 || x === img.bitmap.width - 1 || y === img.bitmap.height - 1) {
//             this.bitmap.data[idx] = 255;
//             this.bitmap.data[idx + 1] = 255;
//             this.bitmap.data[idx + 2] = 255;
//             this.bitmap.data[idx + 3] = 255;
//         }
//     });
//     return await img.getBase64Async(Jimp.MIME_PNG);
// }

export const getBufferFromBase64 = (imageBase64: string) => {
  const strImage = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
  return Buffer.from(strImage, 'base64');
};

export const getBuffer = (base64: string) => {
  return Buffer.from(base64, 'base64');
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const fill00ColorToTransparent = async (imageBuffer: Buffer) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);
  // // get pixel color of 0,0
  // const colorTarget = img.getPixelColor(0, 0);
  // console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget));

  // // paint colorTarget to transparent
  // img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  //   if (img.getPixelColor(x, y) === colorTarget) {
  //     this.bitmap.data[idx + 0] = 0;
  //     this.bitmap.data[idx + 1] = 0;
  //     this.bitmap.data[idx + 2] = 0;
  //     this.bitmap.data[idx + 3] = 0;
  //   }
  // });
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

const rgbaDiff = (rgba1: RGBA, rgba2: RGBA) => {
  return (
    Math.abs(rgba1.r - rgba2.r) +
    Math.abs(rgba1.g - rgba2.g) +
    Math.abs(rgba1.b - rgba2.b) +
    Math.abs(rgba1.a - rgba2.a)
  );
};

export const fillWithColor = async (
  imageBuffer: Buffer,
  vec: Vector2,
  rgba: RGBA,
  tolerance: number,
) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);
  // // get pixel color of 0,0
  // const colorTarget = img.getPixelColor(vec.x, vec.y);
  // const colorTargetRgba = Jimp.intToRGBA(colorTarget);
  // console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget));

  // // paint colorTarget to transparent
  // img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  //   const pixelColor = img.getPixelColor(x, y);
  //   const pixelRgba = Jimp.intToRGBA(pixelColor);

  //   if (rgbaDiff(pixelRgba, colorTargetRgba) < tolerance) {
  //     this.bitmap.data[idx + 0] = rgba.r;
  //     this.bitmap.data[idx + 1] = rgba.g;
  //     this.bitmap.data[idx + 2] = rgba.b;
  //     this.bitmap.data[idx + 3] = rgba.a;
  //   }
  // });
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

export const quantize = async () => {
  // https://docs.opencv.org/3.4/d1/d5c/tutorial_py_kmeans_opencv.html
};

export const removeEdge = async (imageBuffer: Buffer, threshold: number) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);
  // const baseColor = {
  //   r: 0,
  //   g: 0,
  //   b: 0,
  //   a: 0,
  // } as RGBA;
  // const cloneImage = img.clone();
  // img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  //   const colorAround = getPixelColorAround(cloneImage, x, y);
  //   const colorCurrent = cloneImage.getPixelColor(x, y);
  //   const pixelRgba = Jimp.intToRGBA(colorCurrent);
  //   const countDifferentColorAround = colorAround.filter((color) => {
  //     const rgba = Jimp.intToRGBA(color);
  //     return rgba.a !== baseColor.a;
  //   }).length;
  //   if (pixelRgba.a !== baseColor.a && countDifferentColorAround < threshold) {
  //     this.bitmap.data[idx + 0] = 255;
  //     this.bitmap.data[idx + 1] = 0;
  //     this.bitmap.data[idx + 2] = 0;
  //     this.bitmap.data[idx + 3] = 255;
  //   }
  // });
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

export const outlinePaint = async (imageBuffer: Buffer) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);

  // const baseColor = img.getPixelColor(0, 0);

  // const cloneImage = img.clone();

  // // paint colorTarget to transparent
  // img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  //   // get pixel color around 8 direction by array
  //   const colorAround = getPixelColorAround(cloneImage, x, y);
  //   // get current pixel color
  //   const colorCurrent = cloneImage.getPixelColor(x, y);
  //   // if current color is base color and around pixel color include non base color
  //   // colorCurrent === baseColor &&
  //   const countDifferentColorAround = colorAround.filter(
  //     (color) => color !== baseColor,
  //   ).length;
  //   // if (colorCurrent === baseColor && countDifferentColorAround > 1) {
  //   //     this.bitmap.data[idx + 0] = 255;
  //   //     this.bitmap.data[idx + 1] = 0;
  //   //     this.bitmap.data[idx + 2] = 0;
  //   //     this.bitmap.data[idx + 3] = 255;
  //   // }

  //   // 鋭角のpixelを省くことができる
  //   // if (colorCurrent !== baseColor && countDifferentColorAround < 4) {
  //   //     this.bitmap.data[idx + 0] = 255;
  //   //     this.bitmap.data[idx + 1] = 0;
  //   //     this.bitmap.data[idx + 2] = 0;
  //   //     this.bitmap.data[idx + 3] = 255;
  //   // }

  //   // draw outline in inner side
  //   if (colorCurrent !== baseColor && countDifferentColorAround < 7) {
  //     this.bitmap.data[idx + 0] = 0;
  //     this.bitmap.data[idx + 1] = 0;
  //     this.bitmap.data[idx + 2] = 0;
  //     this.bitmap.data[idx + 3] = 255;
  //   }
  // });
  // return img.getBufferAsync(Jimp.MIME_PNG);
};

export const opencv2 = async (imageBuffer: Buffer) => {
  return imageBuffer;
};

// const getPixelColor = (img: Jimp, x: number, y: number) => {
//     return img.getPixelColor(x, y);
// }

const getPixelColorAround = (img: any, x: number, y: number) => {
  return [];
  // return [
  //   img.getPixelColor(x - 1, y - 1),
  //   img.getPixelColor(x, y - 1),
  //   img.getPixelColor(x + 1, y - 1),
  //   img.getPixelColor(x - 1, y),
  //   img.getPixelColor(x + 1, y),
  //   img.getPixelColor(x - 1, y + 1),
  //   img.getPixelColor(x, y + 1),
  //   img.getPixelColor(x + 1, y + 1),
  // ];
};

export const imglyRemoveBackgroundBuffer = async (imageBuffer: Buffer) => {
  return imageBuffer;
  // const removed = await removeBackground(imageBuffer, {});
  // return removed.arrayBuffer();
  // const imageBufferA = Buffer.from(removed);
  // return imageBufferA;
  // console.log('imglyRemoveBackgroundBuffer start');

  // const removed = await imglyRemoveBackground(imageBuffer, {});
  // console.log('imglyRemoveBackgroundBuffer complete');
  // // const removed = await removeBackground(imageBuffer)
  // // convert removed to buffer
  // // const buffer = Buffer.from(removed)
  // return await removed.arrayBuffer();
};
