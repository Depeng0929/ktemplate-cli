import yargs from 'yargs'
import type { Argv } from 'yargs'
import consola from 'consola'
import { version } from '../package.json'
import { templateURL } from './config'
import { removeProject } from './core/remove'
import { add } from './core/add'

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
  ({ name }) => {
    console.log(name)
  })

cli.command(
  'add [name]',
  'Add project in monorepo',
  (yargs: any) => commandOptions(yargs),
  ({ name }) => {
    add({ name, templateURL: templateURL.ts })
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
