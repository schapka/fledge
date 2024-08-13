#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command } from 'commander';
import * as prompts from '@clack/prompts';

import { Fledge } from './main.js';
import { stackPrompt } from './prompts/stack.js';
import { secretsPrompt } from './prompts/secrets.js';
import { resolveHomeDir } from './utils/fs.js';

const program = new Command('fledge');
const spinner = prompts.spinner();

/**
 * Create command
 */

type CreateOptions = {
  source?: string;
  auth?: string;
  clearCache?: boolean;
};

program
  .command('create', { isDefault: true })
  .description('Create new project')
  .argument(
    '[projectPath]',
    'Path where the project should be created. If omitted, the current directory is used.',
  )
  .option('-s, --source <stacksSource>', 'Use the specified stacks source')
  .option('-a, --auth <auth>', 'Use authorization key')
  .option('-c, --clear-cache', 'Clear stacks source cache')
  .action(async (projectPath: string | undefined, options: CreateOptions) => {
    const source =
      options.source ||
      resolve(dirname(fileURLToPath(import.meta.url)), '../test/test-stack-source');
    const auth = options.auth;

    if (options.clearCache) {
      /**
       * TODO clear cache
       */
    }

    const projectDirectory = resolveHomeDir(projectPath || process.cwd());

    const fledge = new Fledge(source, auth);

    spinner.start('Loading stacks');
    const stacks = await fledge.getStacks();
    spinner.stop('Stacks loaded');

    const stack = await stackPrompt(stacks);
    const secrets = await secretsPrompt(stack);

    console.log({ stack, secrets, projectDirectory });
  });

/**
 * TODO config command
 */

/**
 * TODO cache command
 */

/**
 * Run programm
 */

program.parseAsync().catch((error) => {
  try {
    spinner.stop();
  } catch (_) {
    /**
     * no op
     */
  }
  prompts.cancel(error.toString());
  process.exit(1);
});
