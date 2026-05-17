import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg

export type DbClient = ReturnType<typeof drizzle>

let pool: pg.Pool | null = null
let db: DbClient | null = null

export function getDatabaseStatus() {
  return pool ? 'configured' : 'not_connected'
}

export function createDbClient(databaseUrl = env.databaseUrl): DbClient {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required when explicitly creating a database client.')
  }

  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl })
    db = drizzle(pool)
  }

  return db as DbClient
}

export async function closeDbClient() {
  if (pool) {
    await pool.end()
    pool = null
    db = null
  }
}
