import path from 'path'
import child_process from 'child_process'
import type { IProject, TemplateTypes } from '../types/index.d'
import { workRoot } from '../utils/path'
import { templateURL } from '../config'

export abstract class BaseProject {
  /**
   * 项目名称
   */
  public name: string
  /**
    * 项目所在目录
    */
  public rootPath: string
  /**
    * 项目类型
    */
  public type: TemplateTypes
  /**
    * 当前项目在monorepo中
    */
  public isPackage: boolean

  /**
   * 当前项目目录
   */
  get rootDir() {
    return path.join(this.rootPath, this.name)
  }

  get templateURL() {
    return templateURL[this.type]
  }

  constructor(project: IProject) {
    const { name, type, rootPath, isPackage } = project

    this.name = name
    this.type = type
    this.rootPath = rootPath || workRoot
    this.isPackage = isPackage
  }

  abstract init(): Promise<void>

  public async initGit() {
    child_process.exec('git init && git add . && git commit -m "🎉init project"', { cwd: this.rootDir })
  }
}
