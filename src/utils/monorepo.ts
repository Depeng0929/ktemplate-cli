import path from 'path'
import fs from 'fs-extra'
import { workRoot } from './path'

export function isMonorepo(rootPath: string = workRoot) {
  const workspace = path.join(rootPath, 'pnpm-workspace.yaml')
  const isExists = fs.existsSync(workspace)
  return isExists
}

export function getMonorepo(root: string) {
  const monorepoPath = path.join(root, '../', '../')

  return fs.existsSync(monorepoPath) ? monorepoPath : null
}
