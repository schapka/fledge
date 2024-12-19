import { kebabCase, splitByCase, upperFirst } from 'scule';

export function getProjectName(directoryName: string): string {
  const kebabDirectoryName = kebabCase(directoryName);
  const normalizedDirectoryName = kebabDirectoryName.replace(/[^a-z0-9-]/gi, '');

  const match = /^[^a-z]*([a-z][a-z0-9-]+)/.exec(normalizedDirectoryName);
  if (!match) {
    throw new Error(`Invalid project name "${normalizedDirectoryName}".`);
  }

  const [, projectName] = match;
  return projectName;
}

export function getProjectDisplayName(projectName: string): string {
  return splitByCase(projectName).map(upperFirst).join(' ');
}

export function getProjectShortName(projectName: string, length = 3): string {
  const words = projectName.split('-');
  let shortName: string = '';
  if (words.length >= length) {
    shortName = words
      .slice(0, length)
      .map((word) => word.charAt(0))
      .join('');
  } else {
    const maxTakePerWord = Math.ceil(length / words.length);
    for (const word of words) {
      const take = Math.min(maxTakePerWord, length - shortName.length);
      shortName += word.slice(0, take);
    }
  }
  return shortName;
}
