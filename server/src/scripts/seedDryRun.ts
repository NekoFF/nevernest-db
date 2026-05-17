import { spawnSync } from 'node:child_process'

const result = spawnSync(process.execPath, ['scripts/import-dry-run.mjs'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  stdio: 'pipe',
})

console.log('NTE backend seed dry-run shell')
console.log('No database connection was opened.')
console.log('No rows were written.')

if (result.stdout) {
  console.log(result.stdout.trim())
}

if (result.stderr) {
  console.error(result.stderr.trim())
}

if (result.status !== 0) {
  process.exit(result.status || 1)
}
