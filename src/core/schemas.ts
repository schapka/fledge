import z from 'zod';

// const optionsConditionSchema = z.object({
//   optionId: z.string(),
//   logic: z.literal('equals').default('equals'),
//   value: z.union([z.string(), z.boolean(), z.number()]),
// });

// const selectOptionSchema = z.object({
//   type: z.literal('select'),
//   id: z.string().min(1),
//   message: z.string().min(1),
//   options: z
//     .array(
//       z.object({
//         value: z.string().min(1),
//         label: z.string().min(1),
//         hint: z.string().min(1).optional(),
//       }),
//     )
//     .min(2),
//   defaultValue: z.string().optional(),
//   when: optionsConditionSchema.optional(),
// });

// const booleanOptionSchema = z.object({
//   type: z.literal('boolean'),
//   id: z.string().min(1),
//   message: z.string().min(1),
//   defaultValue: z.boolean().optional(),
//   when: optionsConditionSchema.optional(),
// });

// const textOptionSchema = z.object({
//   type: z.literal('text'),
//   id: z.string().min(1),
//   message: z.string().min(1),
//   defaultValue: z.string().optional(),
//   when: optionsConditionSchema.optional(),
// });

const stackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  path: z.string().min(1),
  ignore: z
    .array(z.string())
    .default([
      '**/.DS_Store',
      '**/node_modules/**/*',
      '**/.git/**/*',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/.env',
    ]),
  preconditions: z
    .array(
      z.union([
        z.string(),
        z.object({
          sh: z.string().min(1),
          message: z.string().min(1).optional(),
        }),
      ]),
    )
    .default([]),
  secrets: z
    .array(
      z.object({
        name: z.string().min(1),
        hint: z.string().min(1).optional(),
      }),
    )
    .default([]),
  // options: z
  //   .array(
  //     z.discriminatedUnion('type', [selectOptionSchema, booleanOptionSchema, textOptionSchema]),
  //   )
  //   .default([]),
  // scripts: z
  //   .array(
  //     z.function().args(
  //       z.object({
  //         env: z.record(z.string(), z.string()),
  //         stackOptions: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])),
  //         projectTarget: z.object({
  //           projectPath: z.string(),
  //           projectName: z.string(),
  //           projectShortName: z.string(),
  //           projectDisplayName: z.string(),
  //           projectCreationDate: z.string(),
  //         }),
  //       }),
  //     ),
  //   )
  //   .default([]),
  postSetupCommands: z.array(z.string()).default([]),
  postSetupInstructions: z.array(z.string()).default([]),
});

export const configSchema = z.object({
  stacks: z.array(stackSchema).min(1),
});

export type Config = z.infer<typeof configSchema>;

export type ConfigInput = z.input<typeof configSchema>;

export type Stack = Config['stacks'][number];
