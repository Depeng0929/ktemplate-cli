import path from 'path'
import yargs from 'yargs'
import type { Argv } from 'yargs'
import consola from 'consola'
import inquirer from 'inquirer'
import { version } from '../package.json'
import { removeProject } from './core/remove'
import { add } from './core/add'
import { TemplateTypes } from './types/index.d'
import { workRoot } from './utils'
import { Project } from './utils/Project'

enum ProjectTypes {
  monorepo = 'monorepo',
  single = 'single',
}

const cli = yargs
  .scriptName('kdp')
  .usage('$0 [args]')
  .version(version)
  .strict()
  .showHelpOnFail(false)
  .alias('h', 'help')
  .alias('v', 'version')

cli.command(
  'create [name]',
  'Create project',
  (yargs: any) => commandOptions(yargs),
  async({ name }) => {
    const { type } = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'type',
          message: '请选择项目类型',
          choices: [ProjectTypes.monorepo, ProjectTypes.single],
        },
      ])

    // monorepo Project
    if (type === ProjectTypes.monorepo) {
      const monorepoProject = new Project({ name, type: TemplateTypes.monorepo })
      const monorepoPath = path.join(workRoot, name)
      const packagesPath = path.join(monorepoPath, 'packages')
      // 创建Monorepor主项目
      await add(monorepoProject, true)

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
            ), true),
          ),
      )
    }

    // Single Project
    if (type === ProjectTypes.single)
      inquirerAddSingleSelect(name)
  })

cli.command(
  'add [name]',
  'Add project in monorepo',
  (yargs: any) => commandOptions(yargs),
  ({ name }) => {
    inquirerAddSingleSelect(name)
  })

cli.command(
  'remove <path...>',
  'rm -rf',
  // @ts-expect-error yargs
  (yargs) => {
    return yargs
      .positional('path', {
        type: 'string',
        describe: '需要删除的路径（支持多个））',
      })
  },
  ({ path }: { path?: string[] }) => {
    if (!path) {
      cli.help()
      process.exit(0)
    }

    const removeActions = Promise.all(path.map(removeProject))
    removeActions.then(() => {
      consola.success('删除成功')
    }).catch((err) => {
      consola.error(err)
    })
  })

cli
  .help()
  .parse()

function commandOptions(args: Argv<{}>) {
  return args
    .positional('name', {
      default: 'test',
      type: 'string',
      describe: '项目名字',
    })
}

async function inquirerAddSingleSelect(name: string) {
  const { add: item } = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'add',
        message: '请选择您要添加的项目',
        choices: [TemplateTypes.ts, TemplateTypes.vue, TemplateTypes.minapp],
      },
    ])

  const project = new Project({
    name,
    type: item,
  })
  add(project)
}
