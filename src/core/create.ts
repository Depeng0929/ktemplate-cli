import path from 'path'
import inquirer from 'inquirer'
import { add } from '../core/add'
import { TemplateTypes } from '../types/index.d'
import { createProject } from '../project'

export async function createMonorepo(name: string) {
  const monorepoProject = await createMain(name)
  const packagesPath = path.join(monorepoProject.rootDir, 'packages')

  await createPackage(packagesPath)

  monorepoProject.initGit()

  monorepoProject.initGit()
}

// 创建Monorepor主项目
async function createMain(name: string) {
  const monorepoProject = createProject({ name, type: TemplateTypes.monorepo })
  await add(monorepoProject)
  return monorepoProject
}

// 创建monorepo子项目
async function createPackage(packagesPath) {
  const { packages } = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'packages',
        message: '请选择项目类型',
        choices: [TemplateTypes.ts, TemplateTypes.vue, TemplateTypes.minapp],
      },
    ])
  const inquirerOptions = packages.map(p => ({
    type: 'input',
    name: `${p}`,
    message: `请输入${p}项目名称`,
  }))
  const names = await inquirer
    .prompt(inquirerOptions)

  return Promise.all(
    Object.keys(names)
      .map(t =>
        add(
          createProject(
            {
              name: names[t],
              type: t as any,
              rootPath: packagesPath,
              isPackage: true,
            },
          ),
        ),
      ),
  )
}
