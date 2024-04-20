import { Buffer } from 'buffer';

export const base64ToBuffer = (base64: string): Buffer => {
  const base64result = base64.split(',')[1];
  return Buffer.from(base64result, 'base64');
};
