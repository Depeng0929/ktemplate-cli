import path from 'path'
import fs from 'fs-extra'
import { TemplateTypes } from '../types/index.d'
import { BaseProject } from './BaseProject'

export class SingleProject extends BaseProject {
  async init() {
    await this.changePackageJson()
    await this.removeUseless()

    if (this.type !== TemplateTypes.monorepo)
      this.initGit()
  }

  private async removeUseless() {
    const files = [
      '.git',
    ]
    await fs.remove(path.join(this.dir, 'packages', 'README.md'))
    return await Promise.all(files.map(file => fs.remove(path.join(this.dir, file))))
  }

  private async changePackageJson() {
    const target = path.join(this.dir, 'package.json')
    const s = await fs.readFile(target, 'utf-8')
    const ns = s.replace(/(\[name\])|(?<=")name(?=",)/g, this.name)

    return await fs.outputFile(target, ns)
  }
}
