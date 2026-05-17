import { spawn } from 'node:child_process'

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const child = spawn(command, ['tsx', 'watch', 'server/src/index.ts'], {
  env: {
    ...process.env,
    SERVER_DATA_MODE: 'db',
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code ?? 1)
})
