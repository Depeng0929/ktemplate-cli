import { resolve } from 'path'
export const workRoot = process.cwd()

export function resolveWork(path: string) {
  return resolve(workRoot, path)
}
