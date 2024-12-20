import { homedir, tmpdir } from 'node:os';
import { existsSync, statSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';

export function isAbsolutePath(path: string): boolean {
  return isAbsolute(path);
}

export function getAbsolutePath(path: string): string {
  if (isAbsolute(path)) {
    return path;
  }
  return resolve(path);
}

export function getRelativePath(path: string, from: string = process.cwd()): string {
  return relative(from, path);
}

export function resolveHomeDir(...path: string[]): string {
  return resolve(...path).replace(/^.*~/, homedir());
}

export function getTempDirectory(...path: string[]): string {
  return resolve(tmpdir(), ...path);
}

export function exists(...path: string[]): boolean {
  return existsSync(resolve(...path));
}

export function isDirectory(...path: string[]): boolean {
  try {
    return statSync(resolve(...path)).isDirectory();
  } catch {
    return false;
  }
}

export function createdAt(...path: string[]): number {
  try {
    return statSync(resolve(...path)).birthtimeMs;
  } catch {
    return 0;
  }
}

export function isEmptyDirectory(...path: string[]): boolean {
  return isDirectory(...path) && readdirSync(resolve(...path)).length === 0;
}

export function ensureDir(...path: string[]): void {
  if (exists(...path)) {
    return;
  }
  mkdirSync(resolve(...path), { recursive: true });
}

export function remove(...path: string[]): void {
  if (!exists(...path)) {
    return;
  }
  if (isDirectory(...path)) {
    rmSync(resolve(...path), { recursive: true, force: true });
  } else {
    rmSync(resolve(...path), { force: true });
  }
}
