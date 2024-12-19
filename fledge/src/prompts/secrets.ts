import * as prompts from '@clack/prompts';
import { Stack } from '../core/schemas.js';

export async function secretsPrompt(stack: Stack) {
  const secrets: Record<string, string> = {};

  if (!stack.secrets?.length) {
    return secrets;
  }

  for (const { name, hint } of stack.secrets) {
    const value = await prompts.password({
      message: hint ? `Enter value for secret ${name} (${hint})` : `Enter value for secret ${name}`,
    });

    if (prompts.isCancel(value)) {
      prompts.cancel('Project setup cancelled');
      process.exit(0);
    }

    secrets[name] = value;
  }

  return secrets;
}
