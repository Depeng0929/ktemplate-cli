import ora from 'ora'
import fs from 'fs-extra'
import { download } from '../utils/download'
import type { ITemplate } from '../types'
import { Project } from '../utils/file'

export async function add(template: ITemplate) {
  const { name, templateURL } = template
  const project = new Project(name)

  const loading = ora('正在下载远程仓库')
  loading.start()
  const templateDir: string = await download(templateURL)
  loading.succeed('模版下载完成')

  const loading2 = ora('正在复制模版')
  loading2.start()
  await fs.move(templateDir, project.rootPath)
  await fs.remove(templateDir)
  loading2.succeed('模版已建立')

  project.initSingleProject()
}
