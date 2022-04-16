/* eslint-disable no-console */
import ora from 'ora'
import fs from 'fs-extra'
import { bold, green, yellow } from 'kolorist'

import { download } from '../utils/download'
import type { BaseProject } from '../project/BaseProject'

export async function add(project: BaseProject) {
  if (project.isPackage) {
    console.log()
    console.log(`${bold('当前正处于monorepo')}`)
    console.log()
  }

  const loading = ora('正在下载远程仓库').start()

  console.log()
  console.log(`${bold(`${project.name}`)}   ${yellow(`(${project.type})`)}`)

  const templateDir: string = await download(project.templateURL)
  loading.succeed('模版下载完成')

  const loading2 = ora('正在复制模版')
  loading2.start()
  console.log()
  console.log(`目标：${green(`${project.rootDir}`)}`)
  await fs.move(templateDir, project.rootDir)
  await fs.remove(templateDir)
  loading2.succeed('模版已建立')

  project.init()
}
