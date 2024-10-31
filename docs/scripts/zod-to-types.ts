import { writeFileSync } from 'node:fs';
import { printNode, zodToTs } from 'zod-to-ts';

// import your Zod schema
import { configSchema } from '../../src/core/schemas.ts';

// pass schema and name of type/identifier
const { node } = zodToTs(configSchema, 'Fledge');
const nodeString = printNode(node);

writeFileSync('src/exports/schema.txt', nodeString, 'utf-8');
