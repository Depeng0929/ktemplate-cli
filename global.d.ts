declare module 'download-git-repo' {
  export default function downloadGit(url: string, dest: string, options: { clone: boolean }, cb: (err: any) => void): void
}

declare module 'parse-github-url' {
  export default function parseGithub(url: string): {
    owner: string
    repo: string
    name: string
  }
}
