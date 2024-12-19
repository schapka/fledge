import { execa } from 'execa';
import { promise as fastq } from 'fastq';

const ignorePatterns: RegExp[] = [/^file:/, /\//];

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type QueueItem = {
  packageName: string;
  versionRange?: string;
  prefix?: string;
};

const cache = new Map<string, Promise<string>>();

const q = fastq<unknown, QueueItem, string>(
  ({ packageName, versionRange = 'latest', prefix = '^' }) => {
    const key = `${packageName}-${versionRange}-${prefix}`;
    let promise = cache.get(key);
    if (!promise) {
      promise = getResolvedPackageVersion(packageName, versionRange, prefix);
      cache.set(key, promise);
    }
    return promise;
  },
  4,
);

async function getResolvedPackageVersion(
  packageName: string,
  versionRange: string,
  prefix: string,
): Promise<string> {
  const shouldIgnore = ignorePatterns.some((pattern) => pattern.test(versionRange));
  if (shouldIgnore) {
    return versionRange;
  }
  try {
    const { stdout } = await execa({ shell: true })(`npm view ${packageName} --json`);
    const parsedInfo = JSON.parse(stdout);
    const distTag = versionRange.trim() === '*' ? 'latest' : versionRange;
    const resolvedVersion = parsedInfo?.['dist-tags']?.[distTag];
    return resolvedVersion ? `${prefix}${resolvedVersion}` : versionRange;
  } catch {
    return versionRange;
  }
}

async function resolveDependencyVersions(
  dependencies: Record<string, string> = {},
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  await Promise.all(
    Object.entries(dependencies).map(async ([packageName, versionRange]) => {
      result[packageName] = await q.push({ packageName, versionRange });
    }),
  );
  return result;
}

export async function transformPackageJson(packageJsonString: string): Promise<string> {
  try {
    const packageJson = JSON.parse(packageJsonString) as PackageJson;
    packageJson.dependencies = await resolveDependencyVersions(packageJson.dependencies);
    packageJson.devDependencies = await resolveDependencyVersions(packageJson.devDependencies);
    return JSON.stringify(packageJson, null, 2);
  } catch {
    return packageJsonString;
  }
}
