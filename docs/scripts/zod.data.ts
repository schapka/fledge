import { z } from 'zod';
import { defineLoader } from 'vitepress';
import { printNode, zodToTs } from 'zod-to-ts';

import { configSchema } from '../../src/core/schemas.ts';

type Data = {
  configSchema: string;
};

function convertZodSchemaToString(schema: z.ZodTypeAny, schemaTitle: string) {
  const { node } = zodToTs(schema, schemaTitle);
  return printNode(node);
}

const config = convertZodSchemaToString(configSchema, 'Config Schema');

export default defineLoader({
  load(): Data {
    return {
      configSchema: config,
    };
  },
});
