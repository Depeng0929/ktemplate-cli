import path from 'path'
import fs from 'fs-extra'
import { BaseProject } from './BaseProject'

export class MonorepoProject extends BaseProject {
  async init() {
    await this.changePackageJson()
    await this.removeUseless()
    this.initGit()
  }

  private async removeUseless() {
    const files = [
      '.git',
      '.github',
      '.gitignore',
      '.vscode',
    ]

    await fs.remove(path.join(this.rootDir, 'packages', 'README.md'))
    return await Promise.all(files.map(file => fs.remove(path.join(this.rootDir, file))))
  }

  private async changePackageJson() {
    const target = path.join(this.rootDir, 'package.json')
    const s = await fs.readFile(target, 'utf-8')
    const ns = s.replace(/(\[name\])|(?<=")name(?=",)/g, this.name)

    return await fs.outputFile(target, ns)
  }
}
