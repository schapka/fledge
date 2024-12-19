import { createDefineConfig } from 'c12';
import { type ConfigInput } from './core/schemas.js';
import { Fledge } from './core/fledge.js';

export const defineConfig = createDefineConfig<ConfigInput>();

export { Fledge };
