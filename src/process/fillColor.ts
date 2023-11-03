import { Buffer } from 'buffer';
// import Jimp from "jimp"
import { RGBA, Vector2 } from '../dto/generals';

const rgbaDiff = (rgba1: RGBA, rgba2: RGBA) => {
  // if (rgba1.a === 255 && rgba2.a === 255) {
  //     return 0;
  // }
  return (
    Math.abs(rgba1.r - rgba2.r) +
    Math.abs(rgba1.g - rgba2.g) +
    Math.abs(rgba1.b - rgba2.b) +
    Math.abs(rgba1.a - rgba2.a)
  );
};

export const fillWithColorFromPoint = async (
  imageBuffer: Buffer,
  vec: Vector2,
  rgbaFill: RGBA,
  tolerance: number,
) => {
  return imageBuffer;
  // const img = await Jimp.read(imageBuffer);
  // // get pixel color of 0,0
  // const colorTarget = img.getPixelColor(vec.x, vec.y);
  // console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget));

  // return fillWithColorA(
  //   imageBuffer,
  //   Jimp.intToRGBA(colorTarget),
  //   rgbaFill,
  //   tolerance,
  // );
};

export const fillWithColorA = async (
  imageBuffer: Buffer,
  rgbaTarget: RGBA,
  rgbaFill: RGBA,
  tolerance: number,
) => {
  return imageBuffer;
};
