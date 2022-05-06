/* eslint-disable no-console */
import path from 'path'
import ora from 'ora'
import fs from 'fs-extra'
import { bold, green, yellow } from 'kolorist'

import { download } from '../utils/download'
import type { BaseProject } from '../project/BaseProject'
import { cssURL } from '../config'
import { isApplication } from '../utils'

export async function add(project: BaseProject) {
  if (project.isPackage) {
    console.log()
    console.log(`${bold('当前正处于monorepo')}`)
    console.log()
  }

  const loading = ora('正在下载远程仓库').start()

  console.log()
  console.log(`${bold(`${project.name}`)}   ${yellow(`(${project.type})`)}`)

  const templateDir: string = await download(project.cloneRUL)
  loading.succeed('模版下载完成')

  const loading2 = ora('正在复制模版')
  loading2.start()
  console.log()
  console.log(`目标：${green(`${project.dir}`)}`)
  await fs.move(templateDir, project.dir)
  await fs.remove(templateDir)
  loading2.succeed('模版已建立')

  if (isApplication(project.type))
    await addCommonCss(project)

  project.init()
}

async function addCommonCss(project: BaseProject) {
  const loading = ora('正在下载@depeng9527/css').start()
  console.log()

  const templateDir: string = await download(cssURL)
  loading.succeed('@depeng9527/css下载完成')

  const target = path.join(project.dir, 'src/styles')
  const source = path.join(templateDir, 'src/styles')
  return await fs.move(source, target, { overwrite: true })
}
