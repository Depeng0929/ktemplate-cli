
import type { IProject } from '../types/index.d'
import type { BaseProject } from './BaseProject'
import { MonorepoProject } from './MonorepoProject'
import { SingleProject } from './SingleProject'

export function createProject(project: IProject): BaseProject {
  const { isPackage } = project

  if (isPackage)
    return new MonorepoProject(project)

  return new SingleProject(project)
}
