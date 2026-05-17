import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'
import { getDatabaseStatus } from '../db/client.js'
import type { ServiceContainer } from '../services/container.js'

export async function publicRoutes(app: FastifyInstance, options?: { services?: ServiceContainer }) {
  app.get('/health', async () => ({
    ok: true,
    service: 'nte-community-database-api',
    version: env.packageVersion,
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
    dataMode: options?.services?.source || env.dataMode,
  }))

  app.get('/api/status', async () => ({
    ok: true,
    service: 'nte-community-database-api',
    version: env.packageVersion,
    timestamp: new Date().toISOString(),
    database: options?.services?.source === 'db' ? 'configured' : getDatabaseStatus(),
    ...(options?.services?.source === 'db' ? { mode: options.services.mode } : {}),
    dataMode: options?.services?.source || env.dataMode,
    features: {
      auth: 'not_implemented',
      adminWrites: 'not_implemented',
      databaseBackedReads: options?.services?.source === 'db' ? 'configured' : 'not_implemented',
    },
  }))
}
