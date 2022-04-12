import rimraf from 'rimraf'
import { red } from 'kolorist'

import fs from 'fs-extra'

export async function removeProject(projectPath: string) {
  const isExists = await fs.pathExists(projectPath)
  return new Promise((resolve, reject) => {
    if (!isExists)
      return Promise.reject(new Error(`file not found: ${red(projectPath)}`))

    return rimraf(projectPath, (error) => {
      if (error)
        reject(error)
      else
        resolve(error)
    })
  })
}
