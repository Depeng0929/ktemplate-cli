export enum TemplateTypes {
  vue = 'vue',
  minapp = 'minapp',
  ts = 'ts',
  monorepo = 'monorepo',
  node='node',
  app='app',
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
  single = 'single',
  monorepo = 'monorepo',
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
