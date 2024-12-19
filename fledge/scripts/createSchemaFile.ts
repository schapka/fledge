import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { configSchema } from '../src/core/schemas.js';

const jsonSchema = zodToJsonSchema(configSchema, {
  name: 'FledgeConfigSchema',
});

writeFileSync('schema.json', JSON.stringify(jsonSchema, null, 2), 'utf-8');
