import { spawn } from 'node:child_process'

const requestedMode = process.argv[2]
const wantsEmpty = requestedMode === 'empty' || process.env.RUN_EMPTY_DB_TESTS === '1'
const wantsSeeded = requestedMode === 'seeded' || process.env.RUN_SEEDED_DB_TESTS === '1'
const hasDbOptIn = process.env.RUN_DB_TESTS === '1' || requestedMode === 'empty' || requestedMode === 'seeded'

if (!hasDbOptIn) {
  console.log('Skipping DB integration tests. Set RUN_DB_TESTS=1 plus RUN_EMPTY_DB_TESTS=1 or RUN_SEEDED_DB_TESTS=1.')
  process.exit(0)
}

if (wantsEmpty && wantsSeeded) {
  console.error('Choose one DB test mode: empty or seeded. Do not set RUN_EMPTY_DB_TESTS=1 and RUN_SEEDED_DB_TESTS=1 together.')
  process.exit(1)
}

if (!wantsEmpty && !wantsSeeded) {
  console.log('RUN_DB_TESTS=1 was set, but no DB mode was selected.')
  console.log('Use RUN_EMPTY_DB_TESTS=1 for an empty migrated DB, or RUN_SEEDED_DB_TESTS=1 for a seeded local DB.')
  process.exit(0)
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const testFiles = wantsEmpty
  ? ['server/tests/db/*.test.ts']
  : ['server/tests/routes/db-mode.seeded.test.ts']
const env = {
  ...process.env,
  RUN_DB_TESTS: '1',
}
delete env.RUN_EMPTY_DB_TESTS
delete env.RUN_SEEDED_DB_TESTS
if (wantsEmpty) env.RUN_EMPTY_DB_TESTS = '1'
if (wantsSeeded) env.RUN_SEEDED_DB_TESTS = '1'

console.log(wantsEmpty ? 'Running empty DB integration tests.' : 'Running seeded DB integration tests.')
console.log(wantsEmpty ? 'Requires an empty migrated local DB.' : 'Requires a seeded local DB.')

const child = spawn([command, 'tsx', '--test', ...testFiles].join(' '), {
  env,
  shell: true,
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code ?? 1)
})
