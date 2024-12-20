import crypto from 'node:crypto';

export function getRandomAlphanumericString(length: number = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.randomBytes(length))
    .map((byte) => charset[byte % charset.length])
    .join('');
}

export function getRandomHexString(length: number = 32) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export function getRandomNumericString(length: number = 8) {
  const digits = '0123456789';
  return Array.from(crypto.randomBytes(length))
    .map((byte) => digits[byte % digits.length])
    .join('');
}

export function getRandomBase64String(length: number = 22) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

export function getUUID() {
  return crypto.randomUUID();
}
