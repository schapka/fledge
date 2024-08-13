import { defineConfig } from '../../src/main.js';

export default defineConfig({
  stacks: [
    {
      id: 'test-stack',
      name: 'Test Stack',
      description: 'Lorem Ipsum',
      path: './test-stack',
      ignore: ['**/ignore-dir/**/*', '**/ignore-file'],
      secrets: [
        {
          name: 'secret',
          hint: 'Lorem',
        },
        {
          name: 'NORMALIZED_SECRET',
          hint: 'Lorem',
        },
      ],
      preconditions: [],
      // scripts: [
      //   async ({ env, stackOptions, projectTarget: { projectPath } }) => {
      //     await fs.writeJSON(resolve(projectPath, 'env-and-options.json'), {
      //       env,
      //       stackOptions,
      //     });
      //   },
      // ],
      postSetupCommands: ['touch new-file-from-post-setup-command'],
      postSetupInstructions: [],
    },
  ],
});
