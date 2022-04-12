import path from 'path'
import child_process from 'child_process'
import fs from 'fs-extra'

export async function init(projectRoot: string) {
  await removeUselessFile(projectRoot)
  initGit(projectRoot)
}

export async function removeUselessFile(projectRoot: string) {
  const files = [
    '.git',
    '.github',
  ]

  await Promise.all(files.map(file => fs.remove(path.join(projectRoot, file))))
}

export async function initGit(cwd: string) {
  child_process.exec('git init && git add . && git commit -m "🎉init project"', { cwd })
}
