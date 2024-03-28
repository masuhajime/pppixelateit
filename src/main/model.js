// This file (model.js) contains all the logic for loading the model and running predictions.

class MyClassificationPipeline {
  // NOTE: Replace this with your own task and model
  static task = 'text-classification';

  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';

  static instance = null;

  static async getInstance(progressCallback = null) {
    if (this.instance === null) {
      // Dynamically import the Transformers.js library
      // const { pipeline } = await import('@xenova/transformers');
      const TransformersApi = Function(
        'return import("@xenova/transformers")',
      )();
      const { pipeline } = await TransformersApi;

      // NOTE: Uncomment this to change the cache directory
      // env.cacheDir = './.cache';

      this.instance = pipeline(this.task, this.model, { progressCallback });
    }

    return this.instance;
  }
}

// The run function is used by the `transformers:run` event handler.
async function run(event, text) {
  const classifier = await MyClassificationPipeline.getInstance();
  return classifier(text);
}

module.exports = {
  run,
};
