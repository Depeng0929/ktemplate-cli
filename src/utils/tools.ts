import parseGithub from 'parse-github-url'

export function githubName(githubURL: string) {
  return parseGithub(githubURL)
}
