import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import shelljs from 'shelljs'
import consola from 'consola'

import { githubName } from './tools'

export async function download(url: string) {
  const { name } = githubName(url)
  const tmpDir = path.join(os.tmpdir(), name)

  await fs.remove(tmpDir)

  shelljs.cd(os.tmpdir())
  shelljs.exec(`git clone ${url}`)
  consola.success(`临时存储在${tmpDir}`)
  return tmpDir
}
