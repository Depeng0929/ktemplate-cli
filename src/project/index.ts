
import type { IProject } from '../types'
import type { BaseProject } from './BaseProject'
import { SingleProject } from './SingleProject'

export function createProject(project: IProject): BaseProject {
  return new SingleProject(project)
}
