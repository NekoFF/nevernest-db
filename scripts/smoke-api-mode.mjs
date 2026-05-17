import { spawnSync } from 'node:child_process'

const baseUrl = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000'

console.log(`API mode smoke expects a backend running in DB mode at ${baseUrl}.`)
console.log('Delegating to scripts/check-api-client.mjs for envelope and endpoint coverage.')

const result = spawnSync(process.execPath, ['scripts/check-api-client.mjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_API_BASE_URL: baseUrl,
  },
})

process.exitCode = result.status ?? 1
