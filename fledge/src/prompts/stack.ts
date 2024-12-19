import * as prompts from '@clack/prompts';
import { Stack } from '../core/schemas.js';

export async function stackPrompt(stacks: Stack[]) {
  if (stacks.length === 1) {
    return stacks[0];
  }

  const stack = await prompts.select({
    initialValue: stacks[0],
    message: 'Which stack should be used for the new project?',
    options: stacks.map((stack) => ({
      value: stack,
      label: stack.name,
      hint: stack.description,
    })),
  });

  if (prompts.isCancel(stack)) {
    prompts.cancel('Project setup cancelled');
    process.exit(0);
  }

  return stack;
}
