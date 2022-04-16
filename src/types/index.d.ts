export enum TemplateTypes {
  vue = 'vue',
  minapp = 'minapp',
  ts = 'ts',
  monorepo = 'monorepo',
}

export interface ITemplate {
  /**
   * 重命名项目的名称
   */
  name: string
  /**
   * 下载模版来源
   */
  templateURL: string
}

export enum ProjectTypes {
  monorepo = 'monorepo',
  single = 'single',
}

export interface IProject {
  name: string
  type: TemplateTypes
  rootPath?: string
  /**
   * 是否是monorepo 子项目
   */
  isPackage?: boolean
}
