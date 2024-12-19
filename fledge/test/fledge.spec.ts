import { tmpdir } from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import crypto from 'node:crypto';
import { describe, expect, test } from 'vitest';
import { Fledge } from '../src/main.js';

function uuid() {
  return crypto.randomUUID();
}

function getStackSourcePath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return resolve(__dirname, 'test-stack-source');
}

function getTemporaryTestDir(projectName: string): string {
  return resolve(tmpdir(), uuid(), projectName);
}

describe('fledge', () => {
  describe('createProject', () => {
    test('should setup test stack correctly', async () => {
      /**
       * Given
       */
      const source = getStackSourcePath();
      const targetDirectory = getTemporaryTestDir('test-project');

      /**
       * When
       */
      const fledge = new Fledge(source);
      const { projectPath, projectName, projectDisplayName, projectShortName } =
        await fledge.createProject({
          targetDirectory,
          stackId: 'test-stack',
          secrets: {
            secret: 'XXX-1',
            NORMALIZED_SECRET: 'XXX-2',
          },
          // stackOptions: {
          //   foo: 'bar',
          // },
        });

      /**
       * Then
       */
      // Result
      expect(projectPath).toEqual(targetDirectory);
      expect(projectName).toEqual('test-project');
      expect(projectDisplayName).toEqual('Test Project');
      expect(projectShortName).toEqual('tep');

      // Files
      expect(existsSync(resolve(targetDirectory, 'src', 'file'))).toBeTruthy();
      expect(existsSync(resolve(targetDirectory, 'package.json'))).toBeTruthy();

      // Ignore
      expect(existsSync(resolve(targetDirectory, 'ignore-dir', 'file'))).toBeFalsy();
      expect(existsSync(resolve(targetDirectory, 'ignore-file'))).toBeFalsy();

      // Package file (resolve dependencies)
      expect(
        JSON.parse(readFileSync(resolve(targetDirectory, 'package.json'), 'utf-8')).dependencies
          .react,
      ).toMatch(/\^[\d]+\./);

      // .env file
      expect(existsSync(resolve(targetDirectory, '.env'))).toBeTruthy();
      expect(readFileSync(resolve(targetDirectory, '.env'), 'utf-8')).toMatch(/FOO_1="XXX-1"/);
      expect(readFileSync(resolve(targetDirectory, '.env'), 'utf-8')).toMatch(/FOO_2="XXX-2"/);

      // dot file rename
      expect(existsSync(resolve(targetDirectory, '.dot-file'))).toBeTruthy();
      expect(existsSync(resolve(targetDirectory, '.dot-dir', 'file'))).toBeTruthy();

      // executable
      expect(existsSync(resolve(targetDirectory, 'scripts', 'executable'))).toBeTruthy();
      const { stdout } = await promisify(exec)(resolve(targetDirectory, 'scripts', 'executable'));
      expect(stdout).toMatch(/^ok/);

      // post setup commands
      expect(existsSync(resolve(targetDirectory, 'new-file-from-post-setup-command'))).toBeTruthy();
    });
  });

  describe('clearCache', () => {
    test('should remove temporary source cache directory', async () => {
      /**
       * Given
       */
      const testFilePath = resolve(tmpdir(), 'fledge', 'sources', `${uuid()}.txt`);
      const testDirPath = dirname(testFilePath);
      if (!existsSync(testDirPath)) {
        mkdirSync(testDirPath, { recursive: true });
      }
      writeFileSync(testFilePath, '');
      expect(existsSync(testFilePath)).toBeTruthy();

      /**
       * When
       */
      Fledge.clearCache();

      /**
       * Then
       */
      expect(existsSync(testFilePath)).toBeFalsy();
    });
  });
});
