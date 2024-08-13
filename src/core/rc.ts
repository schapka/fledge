import { z } from 'zod';
import { readUser, updateUser } from 'rc9';

const rcSchema = z.object({
  source: z.string().optional(),
  auth: z.string().optional(),
});

type RC = z.input<typeof rcSchema>;

const rcOptions = { name: '.fledgerc' };

export function read<T extends keyof RC>(key: T, defaultValue?: RC[T]): RC[T] {
  const config = rcSchema.parse(readUser(rcOptions));
  return config[key] || defaultValue;
}

export function write<T extends keyof RC>(key: T, value: RC[T]): void {
  updateUser({ [key]: rcSchema.shape[key].parse(value) }, rcOptions);
}
