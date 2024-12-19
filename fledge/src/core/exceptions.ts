export const FledgeException = {
  STACKS_SOURCE_NOT_FOUND: 1001,
  STACKS_SOURCE_INVALID: 1002,
  STACKS_SOURCE_FAILED: 1003,
  STACKS_CONFIG_MISSING: 1101,
  STACKS_CONFIG_INVALID: 1102,
  STACK_UNKNOWN: 1201,
  STACK_PATH_NOT_FOUND: 1202,
  STACK_PATH_INVALID: 1203,
  PRECONDITION_FAILED: 1204,
  TARGET_DIRECTORY_INVALID: 1301,
} as const;

type FledgeErrorCode = (typeof FledgeException)[keyof typeof FledgeException];

export class FledgeError extends Error {
  constructor(
    public readonly errorCode: FledgeErrorCode,
    public readonly message: string,
  ) {
    super();
  }
}
