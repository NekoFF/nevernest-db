import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const snapshotDir = path.resolve(__dirname, '../snapshots')

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => sanitize(item))
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => {
    if (key === 'timestamp') return [key, '<timestamp>']
    if (key === 'issues' && Array.isArray(nestedValue)) return [key, '<issues>']
    return [key, sanitize(nestedValue)]
  }))
}

export function assertMatchesSnapshot(name: string, value: unknown) {
  const filePath = path.join(snapshotDir, name)
  const sanitized = sanitize(value)
  const actual = `${JSON.stringify(sanitized, null, 2)}\n`

  if (process.env.UPDATE_API_SNAPSHOTS === '1') {
    fs.mkdirSync(snapshotDir, { recursive: true })
    fs.writeFileSync(filePath, actual)
    return
  }

  const expected = fs.readFileSync(filePath, 'utf8')
  assert.equal(actual, expected)
}
