import path from 'path';
import { chmodSync } from 'fs';
import { execAsync, isFile } from './fs';
import { downloadRelease } from '@terascope/fetch-github-release';

export const ARCH_MAPPING: Record<string, string> = {
  'x64': 'x64',
  'arm64': 'arm64'
};

// Mapping between Node's `process.platform` to C# RIDs
export const PLATFORM_MAPPING:  Record<string, string> = {
  'darwin': 'osx.12',
  'linux': 'linux',
  'win32': 'win',
};


export type DiffTool = (sourceDir: string, targetDir: string, patchDir: string, file: string) => Promise<{ stdout: string, stderr: string }>;

export const getWebDiffTool = async (root: string): Promise<DiffTool> => {

  const name = `classicuo-web-diff-tool-${
    PLATFORM_MAPPING[process.platform]
  }-${
    ARCH_MAPPING[process.arch]
  }${
    process.platform === 'win32' ? '.exe' : ''
  }`;

  const executable = path.join(root, 'bin/', name);

  if(!isFile(executable)) {
    await downloadRelease(
      'ClassicUO',
      'classicuo-web',
      path.join(root, 'bin/')
    )
    chmodSync(executable, 0o755);
  }

  return (sourceDir: string, targetDir: string, patchDir: string, file: string) =>
    execAsync(`${name} --source-dir "${sourceDir}" --target-dir "${targetDir}" --output-dir "${patchDir}" ${file}`);
};
