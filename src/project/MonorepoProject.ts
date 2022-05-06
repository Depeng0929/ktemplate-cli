import path from 'path'
import fs from 'fs-extra'
import { getMonorepo } from '../utils'
import { TemplateTypes } from '../types/index.d'
import { BaseProject } from './BaseProject'

export class MonorepoProject extends BaseProject {
  async init() {
    await this.changePackageJson()
    await this.removeUseless()
    if (this.type === TemplateTypes.ts)
      this.updateTsConfig()
  }

  private async removeUseless() {
    const files = [
      '.git',
      '.github',
      '.gitignore',
      '.vscode',
    ]

    await fs.remove(path.join(this.dir, 'packages', 'README.md'))
    return await Promise.all(files.map(file => fs.remove(path.join(this.dir, file))))
  }

  private async changePackageJson() {
    const monorepoRoot = getMonorepo(this.dir)
    const monorepoPackageJson = fs.readJsonSync(path.join(monorepoRoot, 'package.json'))

    const target = path.join(this.dir, 'package.json')
    const s = await fs.readFile(target, 'utf-8')
    const ns = s
      .replace(/(\[name\])/g, `${monorepoPackageJson.name}`)
      .replace(/(?<=")name(?=",)/g, `@${monorepoPackageJson.name}/${this.name}`)

    return await fs.outputFile(target, ns)
  }

  private updateTsConfig() {
    const monorepoRoot = getMonorepo(this.dir)
    const tsConfigPath = path.join(monorepoRoot, 'tsconfig.json')
    const monorepoTsConfig = fs.readJsonSync(tsConfigPath)
    const monorepoPackageJson = fs.readJsonSync(path.join(monorepoRoot, 'package.json'))

    if (!monorepoTsConfig.compilerOptions)
      monorepoTsConfig.compilerOptions = {}

    if (!monorepoTsConfig.compilerOptions.paths)
      monorepoTsConfig.compilerOptions.paths = {}

    monorepoTsConfig.compilerOptions.paths[`@${monorepoPackageJson.name}/${this.name}`] = [`./packages/${this.name}/src/index.ts`]

    fs.outputJsonSync(tsConfigPath, monorepoTsConfig, {
      spaces: 2,
    })
  }
}
