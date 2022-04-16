import path from 'path'
import inquirer from 'inquirer'
import { add } from '../core/add'
import { TemplateTypes } from '../types/index.d'
import { workRoot } from '../utils'
import { Project } from '../utils/Project'

export async function create(name: string) {
  const monorepoProject = new Project({ name, type: TemplateTypes.monorepo })
  const monorepoPath = path.join(workRoot, name)
  const packagesPath = path.join(monorepoPath, 'packages')
  // 创建Monorepor主项目
  await add(monorepoProject)

  const { packages } = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'packages',
        message: '请选择项目类型',
        choices: [TemplateTypes.ts, TemplateTypes.vue, TemplateTypes.minapp],
      },
    ])

  // 创建monorepo子项目
  const inquirerOptions = packages.map(p => ({
    type: 'input',
    name: `${p}`,
    message: `请输入${p}项目名称`,
  }))
  const names = await inquirer
    .prompt(inquirerOptions)

  Promise.all(
    Object.keys(names)
      .map(t =>
        add(new Project(
          {
            name: names[t],
            type: t as any,
            rootPath: packagesPath,
            isMonorepo: true,
          },
        )),
      ),
  )
}
