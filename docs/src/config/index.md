---
outline: deep
---

# Configuring Fledge

#### `fledge.config.ts`

The Fledge configuration includes various options for defining your stack(s).

```ts
import { defineConfig } from "fledge";

export default defineConfig({
  stacks: [
    {
      id: "test-stack",
      name: "Test Stack",
      description: "Lorem Ipsum",
      path: "./test-stack",
      ignore: ["**/ignore-dir/**/*", "**/ignore-file"],
      secrets: [
        {
          name: "secret",
          hint: "Lorem",
        },
        {
          name: "NORMALIZED_SECRET",
          hint: "Lorem",
        },
      ],
      preconditions: [],
      postSetupCommands: ["touch new-file-from-post-setup-command"],
      postSetupInstructions: [],
    },
  ],
});
```

## Stacks

- **Type:** `Array<StackConfig>`
- **Default:** none

This array contains each stack configuration (e.g. id, name, description, path).

## StackConfig

- **Type:** `Object`
- **Default:** none

This object contains all predefined stack options.

#### Types

<script lang="ts" setup>
import { data } from '../../data/zod.data.ts'
</script>

```ts-vue
{{ data.configSchema }}
```
