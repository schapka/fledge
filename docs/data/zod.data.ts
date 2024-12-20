import { type ZodTypeAny } from "zod";
import { defineLoader } from "vitepress";
import { printNode, zodToTs } from "zod-to-ts";

import { configSchema } from "../../fledge/src/core/schemas.js";

type Data = {
  configSchema: string;
};

function convertZodSchemaToString(
  schema: ZodTypeAny | typeof configSchema,
  schemaTitle: string,
) {
  const { node } = zodToTs(schema as ZodTypeAny, schemaTitle);
  return printNode(node);
}

const config = convertZodSchemaToString(configSchema, "Config Schema");

export default defineLoader({
  load(): Data {
    return {
      configSchema: config,
    };
  },
});
