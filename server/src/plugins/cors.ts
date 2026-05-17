import cors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'

export async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: env.corsOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
}
