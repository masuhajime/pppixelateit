import cv from '@techstark/opencv-js';

let cvReady = false;

const waitUntilOpenCVReady = async () => {
  cv.onRuntimeInitialized = () => {
    cvReady = true;
  };
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      if (cvReady) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
  });
};
export default waitUntilOpenCVReady;
