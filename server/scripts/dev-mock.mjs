import { spawn } from 'node:child_process'

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsx', 'watch', 'server/src/index.ts'], {
  env: {
    ...process.env,
    SERVER_DATA_MODE: 'mock',
  },
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code || 0)
})
