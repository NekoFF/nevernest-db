import 'dotenv/config'
import { spawnSync } from 'node:child_process'
import { assertLocalDatabaseUrl } from '../db/safety.js'

assertLocalDatabaseUrl(process.env.DATABASE_URL)

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const result = spawnSync(command, ['drizzle-kit', 'generate'], {
  cwd: process.cwd(),
  shell: process.platform === 'win32',
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
