import path from 'path'
import ora from 'ora'
import fs from 'fs-extra'
import { download } from '../utils/download'
import type { IProject } from '../types'
import { workRoot } from '../utils'
import { init } from '../utils/file'

export async function add(project: IProject) {
  const { name, templateURL } = project

  const loading = ora('正在下载远程仓库')
  loading.start()
  const templateDir: string = await download(templateURL)
  loading.succeed('模版下载完成')

  const loading2 = ora('正在复制模版')
  loading2.start()
  const projectDir = path.join(workRoot, name)
  await fs.move(templateDir, projectDir)
  await fs.remove(templateDir)
  loading2.succeed('模版已建立')

  init(projectDir)
}
