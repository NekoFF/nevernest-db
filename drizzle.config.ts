import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Drizzle Kit commands. Use a local/dev database URL only.')
}

export default defineConfig({
  schema: './server/src/db/schema/index.ts',
  out: './server/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
})
