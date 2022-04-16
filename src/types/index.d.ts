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
