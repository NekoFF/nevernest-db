import 'dotenv/config'

export type ServerEnv = {
  nodeEnv: string
  host: string
  port: number
  dataMode: 'disabled' | 'mock' | 'db'
  databaseUrl: string | null
  corsOrigin: string
  packageVersion: string
}

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function loadEnv(): ServerEnv {
  const dataMode = process.env.SERVER_DATA_MODE === 'mock' || process.env.SERVER_DATA_MODE === 'db' ? process.env.SERVER_DATA_MODE : 'disabled'
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.SERVER_HOST || '127.0.0.1',
    port: readNumber(process.env.SERVER_PORT, 4000),
    dataMode,
    databaseUrl: process.env.DATABASE_URL || null,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    packageVersion: process.env.npm_package_version || '0.0.0',
  }
}

export const env = loadEnv()
