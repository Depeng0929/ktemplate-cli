import path from 'path'
import child_process from 'child_process'
import fs from 'fs-extra'
import type { TemplateTypes } from '../types'
import { templateURL } from '../config'
import { workRoot } from './path'

interface IProject {
  name: string
  type: TemplateTypes
  rootPath?: string
  isMonorepo?: boolean
}

export class Project {
  /**
   * 项目名称
   */
  public name: string
  /**
   * 项目所在路径
   */
  public rootPath: string
  /**
   * 项目类型
   */
  public type: TemplateTypes
  /**
   * 当前项目在monorepo中
   */
  public isMonorepo: boolean

  constructor(project: IProject) {
    const { name, type, rootPath, isMonorepo } = project

    this.name = name
    this.type = type
    this.rootPath = rootPath || workRoot
    this.isMonorepo = isMonorepo
  }

  get rootDir() {
    return path.join(this.rootPath, this.name)
  }

  get templateURL() {
    return templateURL[this.type]
  }

  async initSingleProject() {
    await this.changePackageJson()
    await this.removeUseless()
    if (!this.isMonorepo)
      this.initGit()
  }

  private async initGit() {
    child_process.exec('git init && git add . && git commit -m "🎉init project"', { cwd: this.rootDir })
  }

  private async removeUseless() {
    const files = [
      '.git',
    ]

    return await Promise.all(files.map(file => fs.remove(path.join(this.rootDir, file))))
  }

  private async changePackageJson() {
    const target = path.join(this.rootDir, 'package.json')
    const s = await fs.readFile(target, 'utf-8')
    const ns = s.replace(/(\[name\])|(?<=")name(?=",)/g, this.name)

    return await fs.outputFile(target, ns)
  }
}
