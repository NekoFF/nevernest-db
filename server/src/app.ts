import Fastify from 'fastify'
import { env } from './config/env.js'
import { closeDbClient, createDbClient } from './db/client.js'
import { assertLocalDatabaseUrl } from './db/safety.js'
import { registerCors } from './plugins/cors.js'
import { isLocalAuthEnabled } from './auth/localAuthConfig.js'
import { authRoutes } from './routes/auth.js'
import { adminRoutes } from './routes/admin.js'
import { cartridgeRoutes } from './routes/cartridges.js'
import { characterRoutes } from './routes/characters.js'
import { contentRoutes } from './routes/content.js'
import { publicRoutes } from './routes/public.js'
import { tierListRoutes } from './routes/tierLists.js'
import { vehicleRoutes } from './routes/vehicles.js'
import { weaponRoutes } from './routes/weapons.js'
import { createServiceContainer, type ServiceContainer, type ServiceMode } from './services/container.js'
import { AuthService } from './services/AuthService.js'
import { DbAuthRepository } from './repositories/db/index.js'
import { toApiError } from './utils/errors.js'

export type BuildAppOptions = {
  services?: ServiceContainer
  mode?: ServiceMode
  authService?: AuthService
}

export async function buildApp(options: BuildAppOptions = {}) {
  const services = options.services || createServiceContainer({ mode: options.mode || env.dataMode })
  const authService = (() => {
    if (options.authService) return options.authService
    if (!isLocalAuthEnabled()) return new AuthService()
    assertLocalDatabaseUrl(env.databaseUrl)
    return new AuthService(new DbAuthRepository(createDbClient(env.databaseUrl)))
  })()
  const app = Fastify({
    logger: true,
  })

  await registerCors(app)
  await publicRoutes(app, { services })
  await authRoutes(app, authService)
  await adminRoutes(app, authService, services)
  await characterRoutes(app, services)
  await weaponRoutes(app, services)
  await cartridgeRoutes(app, services)
  await vehicleRoutes(app, services)
  await tierListRoutes(app, services)
  await contentRoutes(app, services)

  app.addHook('onClose', async () => {
    await closeDbClient()
  })

  app.setErrorHandler((err, _request, reply) => {
    app.log.error(err)
    const response = toApiError(err)
    reply.code(response.statusCode).send(response.body)
  })

  return app
}
