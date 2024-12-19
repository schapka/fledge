import { basename, resolve, dirname } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat, readFile, writeFile, mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { downloadTemplate, DownloadTemplateOptions } from 'giget';
import { execa } from 'execa';
import glob from 'fast-glob';
import { isBinaryFile } from 'isbinaryfile';
import { loadConfig } from 'c12';
import { kebabCase } from 'scule';
import { Config, configSchema } from './schemas.js';
import { FledgeError, FledgeException } from './exceptions.js';
import {
  createdAt,
  exists,
  getAbsolutePath,
  getTempDirectory,
  isDirectory,
  isEmptyDirectory,
  remove,
} from '../utils/fs.js';
import { getProjectDisplayName, getProjectName, getProjectShortName } from '../utils/string.js';
import {
  getRandomAlphanumericString,
  getRandomBase64String,
  getRandomHexString,
  getRandomNumericString,
  getUUID,
} from '../utils/random.js';
import { getHash } from '../utils/crypto.js';
import { transformPackageJson } from '../transform/package-json.js';

type CreateProjectOptions = {
  targetDirectory: string;
  stackId: string;
  secrets?: Record<string, string>;
};

type ResolvedSource = {
  sourceDirectory: string;
  config: Config;
};

type ProjectTarget = {
  projectPath: string;
  projectName: string;
  projectShortName: string;
  projectDisplayName: string;
  projectCreationDate: string;
};

type TextFileTransformer = (content: string) => string | Promise<string>;

type Vars = {
  [k: string]: Record<string, string | number | boolean>;
};

export class Fledge {
  private transformers = new Map<RegExp, TextFileTransformer>([
    [/package\.json$/, transformPackageJson],
  ]);

  constructor(
    private readonly source: string,
    private readonly auth?: string,
  ) {}

  public async createProject(options: CreateProjectOptions) {
    const { sourceDirectory, config } = await this.resolveSource();
    const projectTarget = this.getProjectTarget(options.targetDirectory);
    const stack = config.stacks.find((stack) => stack.id === options.stackId);

    if (!stack) {
      throw new FledgeError(
        FledgeException.STACK_PATH_NOT_FOUND,
        `Unknown stack "${options.stackId}"`,
      );
    }

    for (const precondition of stack.preconditions) {
      if (typeof precondition === 'string') {
        await this.checkPrecondition(precondition);
      } else {
        await this.checkPrecondition(precondition.sh, precondition.message);
      }
    }

    const stackSourceDirectory = resolve(sourceDirectory, stack.path);

    /**
     * Create project in target directory
     */
    await this.processDirectory(stackSourceDirectory, options.targetDirectory, stack.ignore, {
      project: {
        name: projectTarget.projectName,
        'display-name': projectTarget.projectDisplayName,
        'creation-date': projectTarget.projectCreationDate,
      },
      secrets: this.normalizeSecrets(options.secrets ?? {}),
    });

    await this.runPostSetupCommands(stack.postSetupCommands, projectTarget.projectPath);

    return projectTarget;
  }

  public async resolveSource(): Promise<ResolvedSource> {
    const isLocalDirectory = exists(this.source) && isDirectory(this.source);

    const sourceDirectory = isLocalDirectory
      ? resolve(this.source)
      : await this.resolveExternalSource();

    const { config } = await loadConfig({
      cwd: sourceDirectory,
      name: 'fledge',
      rcFile: false,
      dotenv: false,
      extend: false,
    });

    return {
      sourceDirectory,
      /**
       * TODO: improve error messages for better dx
       */
      config: configSchema.parse(config),
    };
  }

  public async getStacks(): Promise<Config['stacks']> {
    const { config } = await this.resolveSource();
    return config.stacks;
  }

  public static clearCache() {
    const cacheDirectory = getTempDirectory('fledge', 'sources');
    remove(cacheDirectory);
  }

  private async resolveExternalSource(ttl = 10 * 60 * 1000) {
    const targetDirectory = getTempDirectory('fledge', 'sources', getHash(this.source));

    if (exists(targetDirectory)) {
      if (createdAt(targetDirectory) > Date.now() - ttl) {
        return targetDirectory;
      }
      remove(targetDirectory);
    }

    const options: DownloadTemplateOptions = {
      dir: targetDirectory,
      install: true,
      silent: true,
    };

    if (this.auth) {
      options.auth = this.auth;
    }

    /**
     * TODO error handling
     */
    await downloadTemplate(this.source, options);

    return targetDirectory;
  }

  private getProjectTarget(projectDirectory: string) {
    const projectPath = getAbsolutePath(projectDirectory);

    if (exists(projectPath)) {
      if (!isDirectory(projectPath)) {
        throw new FledgeError(
          FledgeException.TARGET_DIRECTORY_INVALID,
          `"${projectPath}" already exists.`,
        );
      }

      if (!isEmptyDirectory(projectPath)) {
        throw new FledgeError(
          FledgeException.TARGET_DIRECTORY_INVALID,
          `"${projectPath}" not empty.`,
        );
      }
    }

    const projectName = getProjectName(basename(projectPath));
    const projectDisplayName = getProjectDisplayName(projectName);
    const projectShortName = getProjectShortName(projectName);
    const projectCreationDate = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

    return {
      projectPath,
      projectName,
      projectDisplayName,
      projectShortName,
      projectCreationDate,
    } satisfies ProjectTarget;
  }

  private async processDirectory(
    sourceDirectory: string,
    targetDirectory: string,
    ignore: string[],
    vars: Vars,
  ): Promise<void> {
    const globStream = glob.stream('**/*', {
      dot: true,
      cwd: sourceDirectory,
      ignore: ignore,
    });
    for await (const file of globStream) {
      await this.processFile(
        resolve(sourceDirectory, file.toString()),
        resolve(targetDirectory, file.toString().replace('____', '.')),
        vars,
      );
    }
  }

  private async processFile(sourceFile: string, targetFile: string, vars: Vars): Promise<void> {
    await mkdir(dirname(targetFile), { recursive: true });

    const { mode } = await stat(sourceFile);

    if (await isBinaryFile(sourceFile)) {
      return await pipeline(createReadStream(sourceFile), createWriteStream(targetFile, { mode }));
    }

    let content = await readFile(sourceFile, 'utf-8');

    /**
     * Random values
     */
    content = content.replace(
      /fledge_random_(alnum|hex|numeric|base64|uuid)(?:_(\d+))?/g,
      (match: string, type: string, length?: string) => {
        const sanitizedLength = Number(length) || undefined;
        switch (type) {
          case 'alnum':
            return getRandomAlphanumericString(sanitizedLength);
          case 'hex':
            return getRandomHexString(sanitizedLength);
          case 'numeric':
            return getRandomNumericString(sanitizedLength);
          case 'base64':
            return getRandomBase64String(sanitizedLength);
          case 'uuid':
            return getUUID();
          default:
            return match;
        }
      },
    );

    /**
     * Placeholder replacement
     */
    content = content.replace(
      /fledge_(project|secrets)_([a-z-]+)/g,
      (match: string, scope: string, key: string) => vars[scope]?.[key]?.toString() ?? match,
    );

    for (const [pattern, transformerFunction] of this.transformers) {
      if (pattern.test(sourceFile)) {
        content = await transformerFunction(content);
      }
    }

    /**
     * Normalize new lines
     */
    content = content.replace(/\r\n|\r|\n/g, () => '\n');

    /**
     * Write target file
     */
    await writeFile(targetFile, content, { encoding: 'utf-8', mode });
  }

  private async checkPrecondition(sh: string, message?: string) {
    try {
      await execa({ shell: true })(sh);
    } catch (_) {
      throw new FledgeError(
        FledgeException.PRECONDITION_FAILED,
        message || `Precondition "${sh}" failed`,
      );
    }
  }

  private async runPostSetupCommands(commands: string[], directory: string): Promise<void> {
    const cwd = resolve(directory);
    for (const cmd of commands) {
      await execa({ shell: true, cwd })(cmd);
    }
  }

  private normalizeSecrets(secrets: Record<string, string>) {
    return Object.entries(secrets).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[kebabCase(key)] = value;
      return acc;
    }, {});
  }
}
