import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import downloadGit from 'download-git-repo'
import { githubName } from './tools'

export async function download(url: string): Promise<string> {
  const { name } = githubName(url)
  const tmpDir = path.join(os.tmpdir(), name)

  await fs.remove(tmpDir)

  return new Promise((resolve, reject) => {
    downloadGit(`direct:${url}.git#main`, tmpDir, { clone: true }, (err: any) => {
      if (err)
        return reject(err)

      return resolve(tmpDir)
    })
  })
}
