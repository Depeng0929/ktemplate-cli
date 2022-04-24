import parseGithub from 'parse-github-url'
import { TemplateTypes } from '../types/index.d'

export function githubName(githubURL: string) {
  return parseGithub(githubURL)
}

export function isApplication(type: TemplateTypes) {
  return [
    TemplateTypes.vue,
    TemplateTypes.minapp,
  ].includes(type)
}
