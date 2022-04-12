/* eslint-disable no-console */
import { blue, bold, cyan, dim, gray, green, underline, yellow } from 'kolorist'

export function printInfo() {
  console.log()
  console.log()
  console.log(`  ${cyan('●') + blue('■') + yellow('▲')}`)
  console.log(`${bold('  Slidev')}  ${blue(`v${0.01}`)}  ${yellow('(global)')} ${gray('(2)')} `)
  console.log()
  console.log(dim('  theme   ') + green(23233))
  console.log(dim('  entry   ') + dim('111'))
  console.log()
  console.log(`${dim('  slide show     ')} > ${cyan('http://localhost:33/')}`)
  console.log(`${dim('  presenter mode ')} > ${blue('http://localhost:3333')}`)

  console.log(`${dim('  remote control ')} > ${dim('pass --remote to enable')}`)

  console.log()
  console.log(`${dim('  shortcuts ')}      > ${underline('r')}${dim('estart | ')}${underline('o')}${dim('pen | ')}${underline('e')}${dim('dit')}`)
  console.log()
  console.log()
}
