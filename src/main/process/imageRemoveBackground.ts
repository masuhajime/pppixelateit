// import { removeBackground } from '@masuhajime/background-removal-node';
// import imglyRemoveBackground from '@imgly/background-removal';
// import { AutoModel, AutoProcessor, env, RawImage } from '@xenova/transformers';
import { Buffer } from 'buffer';
// import sharp from 'sharp';
import sharp from 'sharp';
import path from 'path';
import { ImageRemoveBackgroundParameter } from './dto';

const runTransformers = async (buffer: Buffer) => {
  // https://github.com/xenova/transformers.js/issues/80#issuecomment-1638771291

  // console.log(
  //   `return import("${path.resolve(__dirname)}/../../../release/app/node_modules/@xenova/transformers/src/transformers.js")`,
  // );

  // const TransformersApi = Function(
  //   `return import("@xenova/transformers")`,
  //   // `return import("${path.resolve(__dirname)}/../../../release/app/node_modules/@xenova/transformers/src/transformers.js")`,
  // )();
  // const { AutoModel, AutoProcessor, env, RawImage, pipeline } =
  //   await TransformersApi;

  env.allowLocalModels = false;
  console.log('runTransformers 1');

  const blob = new Blob([buffer], { type: 'image/png' });

  // Add remove-background demo
  // https://github.com/xenova/transformers.js/pull/576
  console.log('runTransformers 2');
  const image = await RawImage.fromBlob(blob);

  console.log('runTransformers 3');
  const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
    // Do not require config.json to be present in the repository
    config: { model_type: 'custom' },
  });

  console.log('runTransformers4');
  const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
    // Do not require config.json to be present in the repository
    config: {
      do_normalize: true,
      do_pad: false,
      do_rescale: true,
      do_resize: true,
      image_mean: [0.5, 0.5, 0.5],
      feature_extractor_type: 'ImageFeatureExtractor',
      image_std: [1, 1, 1],
      resample: 2,
      rescale_factor: 0.00392156862745098,
      size: { width: 1024, height: 1024 },
    },
  });
  console.log('runTransformers 5');

  // Preprocess image
  const { pixel_values } = await processor(image);
  console.log('runTransformers 6');

  // Predict alpha matte
  const { output } = await model({ input: pixel_values });
  console.log('runTransformers 7');

  // Resize mask back to original size
  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
    image.width,
    image.height,
  );
  console.log('runTransformers 8', mask);

  const imageSharp = sharp(buffer);
  const imageBufferObject = await imageSharp
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = imageBufferObject.info;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offsetWidthHeight = imageBufferObject.info.width * y + x;
      const offsetImage = 4 * offsetWidthHeight;
      imageBufferObject.data[offsetImage + 3] = mask.data[offsetWidthHeight];
    }
  }

  // return buffer;

  return sharp(imageBufferObject.data, {
    raw: {
      width: imageBufferObject.info.width,
      height: imageBufferObject.info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
};

const imageRemoveBackground = async (
  param: ImageRemoveBackgroundParameter,
): Promise<Buffer> => {
  const { buffer } = param;

  return runTransformers(buffer);
  // const { pipeline, env } = await import('@xenova/transformers');

  // return buffer;

  // const blob = new Blob([buffer], { type: 'image/png' });

  // env.allowLocalModels = false;
  // console.log('imageRemoveBackground 0');

  // const image = await RawImage.fromBlob(blob);

  // console.log('imageRemoveBackground 1');

  // // Proxy the WASM backend to prevent the UI from freezing
  // env.backends.onnx.wasm.proxy = true;

  // const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
  //   // Do not require config.json to be present in the repository
  //   config: { model_type: 'custom' },
  // });
  // console.log('imageRemoveBackground 2');

  // const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
  //   // Do not require config.json to be present in the repository
  //   config: {
  //     do_normalize: true,
  //     do_pad: false,
  //     do_rescale: true,
  //     do_resize: true,
  //     image_mean: [0.5, 0.5, 0.5],
  //     feature_extractor_type: 'ImageFeatureExtractor',
  //     image_std: [1, 1, 1],
  //     resample: 2,
  //     rescale_factor: 0.00392156862745098,
  //     size: { width: 1024, height: 1024 },
  //   },
  // });
  // console.log('imageRemoveBackground 3');

  // const { pixel_values } = await processor(image);
  // console.log('imageRemoveBackground 4');
  // const { output } = await model({ input: pixel_values });
  // console.log('imageRemoveBackground 5');

  // const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
  //   image.width,
  //   image.height,
  // );
  // console.log('imageRemoveBackground 6');

  // return buffer;
};
export default imageRemoveBackground;
