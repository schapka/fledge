import { createHash } from 'node:crypto';

export function getHash(input: string): string {
  return createHash('md5').update(input, 'utf8').digest('hex');
}
