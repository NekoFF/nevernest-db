const allowedHosts = new Set(['localhost', '127.0.0.1', 'postgres'])

export function assertLocalDatabaseUrl(databaseUrl: string | undefined | null): void {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required and must point to a local/dev PostgreSQL database.')
  }

  let parsed: URL
  try {
    parsed = new URL(databaseUrl)
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL.')
  }

  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    throw new Error('DATABASE_URL must use the postgres:// or postgresql:// protocol.')
  }

  if (!allowedHosts.has(parsed.hostname)) {
    throw new Error(`Refusing non-local DATABASE_URL host "${parsed.hostname}". Allowed hosts: ${[...allowedHosts].join(', ')}.`)
  }

  const dbName = parsed.pathname.replace(/^\/+/, '')
  if (!dbName) {
    throw new Error('DATABASE_URL must include a database name.')
  }

  if (!/(_database|_dev|_local|test)$/i.test(dbName)) {
    throw new Error(`Refusing database "${dbName}". Local DB name must end with _database, _dev, _local, or test.`)
  }
}
