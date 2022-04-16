import ora from 'ora'
import fs from 'fs-extra'
import { download } from '../utils/download'
import type { Project } from '../utils/Project'

export async function add(project: Project) {
  const loading = ora(`正在下载远程仓库-类型：${project.type}, 名称:${project.name}`).start()
  loading.start()
  const templateDir: string = await download(project.templateURL)
  loading.succeed(`模版下载完成-类型：${project.type}, 名称:${project.name}`)

  const loading2 = ora(`正在复制模版到${project.rootDir}`)
  loading2.start()
  await fs.move(templateDir, project.rootDir)
  await fs.remove(templateDir)
  loading2.succeed(`模版已建立-${project.rootDir}`)

  project.initSingleProject()
}
