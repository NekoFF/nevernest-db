import 'dotenv/config'
import pg from 'pg'
import { assertLocalDatabaseUrl } from '../db/safety.js'

const databaseUrl = process.env.DATABASE_URL
assertLocalDatabaseUrl(databaseUrl)

const client = new pg.Client({ connectionString: databaseUrl })

try {
  await client.connect()
  const result = await client.query('select 1 as ok')
  console.log('Local database check passed.')
  console.log(`Result: ${result.rows[0]?.ok}`)
} catch (error) {
  console.error('Local database check failed.')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await client.end().catch(() => undefined)
}
