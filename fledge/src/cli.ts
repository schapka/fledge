#!/usr/bin/env node

import { EOL } from 'node:os';

import { Command } from 'commander';
import * as prompts from '@clack/prompts';

import { Fledge } from './main.js';
import { write, read, RC } from './core/rc.js';
import { stackPrompt } from './prompts/stack.js';
import { secretsPrompt } from './prompts/secrets.js';
import { getRelativePath, resolveHomeDir } from './utils/fs.js';
import { showLogo } from './prompts/logo.js';

const program = new Command('fledge');
let spinner: undefined | ReturnType<(typeof prompts)['spinner']>;

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
    const source = options.source || read('source') || 'gh:schapka/fledge-stacks';
    const auth = options.auth || read('auth');

    if (!source) {
      throw new Error('No source defined. Please run `fledge config set source first.');
    }

    if (options.clearCache) {
      Fledge.clearCache();
    }

    const targetDirectory = resolveHomeDir(projectPath || process.cwd());

    const fledge = new Fledge(source, auth);

    await showLogo();

    spinner = prompts.spinner();
    spinner.start('Loading stacks');
    const stacks = await fledge.getStacks();
    spinner.stop('Stacks loaded');

    /**
     * Prompts
     */
    const stack = await stackPrompt(stacks);
    const secrets = await secretsPrompt(stack);

    /**
     * Create project
     */
    spinner.start('Creating project');
    const createProjectResult = await fledge.createProject({
      targetDirectory,
      stackId: stack.id,
      secrets: secrets,
    });
    spinner.stop('Project created');

    /**
     * Instructions
     */
    const relativeProjectDir = getRelativePath(createProjectResult.projectPath, process.cwd());
    const nextSteps = [`cd ${relativeProjectDir}`, ...stack.postSetupInstructions];
    prompts.note(nextSteps.join(EOL), '🚀 🚀 🚀');
  });

/**
 Config command
 */

const config = program.command('config');
config
  .command('set')
  .description('Set configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action(async <T extends keyof RC>(key: T, value: RC[T]) => {
    await write(key, value);
  });
config
  .command('get')
  .description('Get configuration value')
  .argument('<key>', 'Configuration key')
  .action(async (key: keyof RC) => {
    const value = await read(key);
    process.stdout.write(`${key}: ${value}${EOL}`);
  });

/**
 * Cache command
 */

const cache = program.command('cache');
cache
  .command('clear')
  .description('Clear stacks source cache')
  .action(() => {
    Fledge.clearCache();
  });

/**
 * Run programm
 */

program.parseAsync().catch((error) => {
  spinner?.stop();
  prompts.cancel(error.toString());
  process.exit(1);
});
