import path from 'path'
import yargs from 'yargs'
import type { Argv } from 'yargs'
import consola from 'consola'
import inquirer from 'inquirer'
import { version } from '../package.json'
import { removeProject } from './core/remove'
import { add } from './core/add'
import { ProjectTypes, TemplateTypes } from './types/index.d'
import { createMonorepo } from './core/create'
import { createProject } from './project'
import { isMonorepo, workRoot } from './utils'

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
          choices: Object.values(ProjectTypes),
        },
      ])

    if (type === ProjectTypes.monorepo) { createMonorepo(name) }
    else {
      const { add: item } = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'add',
            message: '请选择您要添加的项目种类',
            choices: Object.values(TemplateTypes),
          },
        ])

      const project = createProject({
        name,
        type: item,
      })
      add(project)
    }
  })

cli.command(
  'add [name]',
  'Add project in monorepo',
  (yargs: any) => commandOptions(yargs),
  async({ name }) => {
    const { add: item } = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'add',
          message: '请选择您要添加的项目种类',
          choices: [TemplateTypes.ts, TemplateTypes.vue, TemplateTypes.minapp],
        },
      ])

    const project = isMonorepo()
      ? createProject({
        name,
        type: item,
        rootPath: path.join(workRoot, 'packages'),
        isPackage: true,
      })
      : createProject({
        name,
        type: item,
      })
    add(project)
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
      describe: '项目名称',
    })
}
