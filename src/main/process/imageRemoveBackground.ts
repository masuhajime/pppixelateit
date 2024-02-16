import { removeBackground } from '@masuhajime/background-removal-node';
// import imglyRemoveBackground from '@imgly/background-removal';
import { Buffer } from 'buffer';
// import { Rembg } from '@xixiyahaha/rembg-node';
import sharp from 'sharp';
import path from 'node:path';
import { ImageRemoveBackgroundParameter } from './dto';

const imageRemoveBackground = async (
  param: ImageRemoveBackgroundParameter,
): Promise<Buffer> => {
  const { buffer } = param;
  // return buffer;
  const blob = new Blob([buffer], { type: 'image/png' });

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .png()
    .toBuffer({ resolveWithObject: true });
  let output: sharp.Sharp | undefined;
  console.info('imageRemoveBackground', {
    algo: param.algorithm,
    threshold: param.threshold,
  });
  console.error('imageRemoveBackground', {
    a: __dirname,
    b: path.resolve(__dirname),
  });

  if (param.algorithm === 'background-removal') {
    // const removed = await imglyRemoveBackground(blob, {
    //   model: 'medium',
    //   debug: true,
    //   output: {
    //     format: 'image/png',
    //   },
    // });
    // output = sharp(await removed.arrayBuffer());
    /**
     *       err: [Error: ENOENT: no such file or directory, open '/node_modules/@imgly/background-removal-node/dist/resources.json'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '/node_modules/@imgly/background-removal-node/dist/resources.json'
  }
  /Users/masuhajime/electron-app/pppixalateit/release/app/node_modules/@imgly/background-removal-node/dist
  /Users/masuhajime/electron-app/pppixalateit/release/app/node_modules/@imgly/background-removal-node
    __dirname: '/Users/masuhajime/electron-app/pppixalateit/release/build/mac/ElectronReact.app/Contents/Resources/app.asar/dist/main',
    https://zenn.dev/nowa0402/articles/fc75145236df9a
     */
    // console.log({
    //   __dirname,
    //   filesd: await fs.promises.readdir(__dirname),
    // });
    console.log({
      '1': `file://${path.join(path.resolve(), 'assets/imgly/')}`,
    });

    const removed = await removeBackground(blob, {
      publicPath: `file://${path.resolve(__dirname)}/../../node_modules/@masuhajime/background-removal-node/dist/`,
      // publicPath: `file://${path.join(path.resolve(), 'assets/imgly/')}`,
      // path.resolve() や__dirname でdev startとbulidのパスが違う, 実際に表示して試す方が良い
      // publicPath: `file://${path.join(path.resolve(), 'node_modules/@masuhajime/background-removal-node/dist/')}`,
      // publicPath: `file://${path.resolve(__dirname)}/../../../assets/imgly/`,
      // .default(`file://${path.resolve(`node_modules/${pkg.name}/dist/`)}/`)
      // publicPath: `file://${path.resolve(
      //   __dirname,
      // )}/../../node_modules/@masuhajime/background-removal-node/dist/`,
      // )}/node_modules/@masuhajime/background-removal-node/dist/`,
      // `file://${path.resolve(`resource/background-redmoval-node`)}/`,
      // 'file://resource/background-removal-node/',
      model: 'medium',
      debug: true,
      output: {
        format: 'image/png',
      },
    });
    output = sharp(await removed.arrayBuffer());
  } else {
    // const image = sharp(buffer);
    // const rembg = new Rembg({
    //   logging: true,
    // });
    // console.log('imageRemoveBackground start');
    // output = await rembg.remove(image);
    // console.log('imageRemoveBackground end');
  }
  // return Buffer.from(await removed.arrayBuffer());

  // make alpha below 254 to 0 and above 255 to 255
  const objOutput = await output
    .png()
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log('imageRemoveBackground', objOutput.info);

  return sharp(objOutput.data, {
    raw: {
      width: objOutput.info.width,
      height: objOutput.info.height,
      channels: objOutput.info.channels,
    },
  })
    .png()
    .toBuffer();
};
export default imageRemoveBackground;
