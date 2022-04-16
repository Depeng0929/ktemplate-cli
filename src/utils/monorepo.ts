import path from 'path'
import fs from 'fs-extra'
import { workRoot } from './path'

export function isMonorepo() {
  const workspace = path.join(workRoot, 'pnpm-workspace.yaml')
  const isExists = fs.existsSync(workspace)
  return isExists
}
