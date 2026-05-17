import { buildApp } from './app.js'
import { env } from './config/env.js'
import { closeDbClient } from './db/client.js'

const app = await buildApp()

const shutdown = async () => {
  app.log.info('Shutting down NTE backend scaffold')
  await closeDbClient()
  await app.close()
}

process.on('SIGINT', () => {
  void shutdown().then(() => process.exit(0))
})

process.on('SIGTERM', () => {
  void shutdown().then(() => process.exit(0))
})

await app.listen({ host: env.host, port: env.port })
