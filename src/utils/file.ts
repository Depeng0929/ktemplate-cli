import path from 'path'
import child_process from 'child_process'
import fs from 'fs-extra'
import { workRoot } from './path'

export class Project {
  public name: string
  public rootPath: string
  constructor(name: string, rootPath: string = workRoot) {
    this.name = name
    this.rootPath = path.join(rootPath, name)
  }

  async initSingleProject() {
    await this.changePackageJson()
    await this.initGit()
  }

  async initGit() {
    const files = [
      '.git',
    ]

    await Promise.all(files.map(file => fs.remove(path.join(this.rootPath, file))))
    child_process.exec('git init && git add . && git commit -m "🎉init project"', { cwd: this.rootPath })
  }

  private async changePackageJson() {
    const target = path.join(this.rootPath, 'package.json')
    const s = await fs.readFile(target, 'utf-8')
    const ns = s.replace(/(\[name\])|(?<=")name(?=",)/g, this.name)

    return await fs.outputFile(target, ns)
  }
}
