import { Buffer } from 'buffer';
import sharp from 'sharp';
import {
  palette1BitMonitorGLOW,
  paletteAPOLLO,
  paletteBlessing,
  paletteCC29,
  paletteEndesga32,
  paletteEndesga64,
  paletteFANTASY24,
  paletteIceCreamGB,
  paletteKirokazeGameboy,
  paletteLOSPEC500,
  paletteLostCentury,
  paletteMidnightAblaze,
  paletteOil6,
  palettePEAR36,
  palettePico8,
  paletteRESURRECT64,
  paletteSLSO8,
  paletteSWEETIE16,
  paletteTwilight5,
  paletteVINIK24,
} from '../../flows/nodes/data/PaletteColors';
import { ImageColorPaletteParameter } from './dto';

const filter = async (param: ImageColorPaletteParameter): Promise<Buffer> => {
  const { buffer, paletteName } = param;

  let palette: string[] = [];
  switch (paletteName) {
    case 'pico8':
      palette = palettePico8;
      break;
    case 'Endesga32':
      palette = paletteEndesga32;
      break;
    case 'Endesga64':
      palette = paletteEndesga64;
      break;
    case 'oil6':
      palette = paletteOil6;
      break;
    case 'RESURRECT64':
      palette = paletteRESURRECT64;
      break;
    case 'APOLLO':
      palette = paletteAPOLLO;
      break;
    case 'LOSPEC500':
      palette = paletteLOSPEC500;
      break;
    case 'CC29':
      palette = paletteCC29;
      break;
    case 'PEAR36':
      palette = palettePEAR36;
      break;
    case 'SLSO8':
      palette = paletteSLSO8;
      break;
    case 'VINIK24':
      palette = paletteVINIK24;
      break;
    case 'SWEETIE16':
      palette = paletteSWEETIE16;
      break;
    case 'FANTASY24':
      palette = paletteFANTASY24;
      break;
    case '1BitMonitorGLOW':
      palette = palette1BitMonitorGLOW;
      break;
    case 'KIROKAZE_GAMEBOY':
      palette = paletteKirokazeGameboy;
      break;
    case 'IceCreamGB':
      palette = paletteIceCreamGB;
      break;
    case 'BLESSING':
      palette = paletteBlessing;
      break;
    case 'LostCentury':
      palette = paletteLostCentury;
      break;
    case 'MidnightAblaze':
      palette = paletteMidnightAblaze;
      break;
    case 'Twilight5':
      palette = paletteTwilight5;
      break;

    default:
      palette = palettePico8;
      break;
  }
  // convert all color to rgb
  const rgbPalette = palette.map((color) => {
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    return [r, g, b];
  });
  // get with and height
  const image = sharp(buffer);
  const { info, data } = await image
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  // get width and height
  const { width, height } = info;
  // get pixel color
  const bufferUpdating = Buffer.from(data);
  // loop through all pixel
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // get offset
      const offset = 4 * (width * y + x);
      // get current color
      const colorCurrent = [
        data[offset + 0],
        data[offset + 1],
        data[offset + 2],
        data[offset + 3],
      ];
      // calculate distance
      const distance = rgbPalette.map((color) => {
        const r = colorCurrent[0] - color[0];
        const g = colorCurrent[1] - color[1];
        const b = colorCurrent[2] - color[2];
        return Math.sqrt(r * r + g * g + b * b);
      });
      // get min distance
      const minDistance = Math.min(...distance);
      // get min distance index
      const minDistanceIndex = distance.indexOf(minDistance);
      // get min distance color
      const minDistanceColor = rgbPalette[minDistanceIndex];
      // update color
      bufferUpdating[offset + 0] = minDistanceColor[0];
      bufferUpdating[offset + 1] = minDistanceColor[1];
      bufferUpdating[offset + 2] = minDistanceColor[2];
      bufferUpdating[offset + 3] = colorCurrent[3];
    }
  }

  return sharp(bufferUpdating, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
};
export default filter;
