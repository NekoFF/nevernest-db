import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'
import { assertLocalDatabaseUrl } from '../db/safety.js'
import { createSeedPreview, inspectSeedDbPreview, loadGeneratedPayloads, renderSeedDbPreviewReport, writeSeedPreviewArtifacts } from '../seed/index.js'

const databaseUrl = process.env.DATABASE_URL
assertLocalDatabaseUrl(databaseUrl)
const safeDatabaseUrl = databaseUrl as string

const loaded = await loadGeneratedPayloads()
const seedPreview = createSeedPreview(loaded)
await writeSeedPreviewArtifacts(seedPreview)

const dbPreview = await inspectSeedDbPreview(safeDatabaseUrl, seedPreview.plan)
const generatedDir = path.join(process.cwd(), '.generated', 'server-seed-preview')
await mkdir(generatedDir, { recursive: true })
await writeFile(path.join(generatedDir, 'seed-db-preview.json'), `${JSON.stringify(dbPreview, null, 2)}\n`)
await writeFile(path.join(process.cwd(), 'docs', 'SEED_DB_PREVIEW_REPORT.md'), renderSeedDbPreviewReport(dbPreview, seedPreview.plan))

console.log('DB-aware seed preview generated.')
console.log('report: docs/SEED_DB_PREVIEW_REPORT.md')
console.log(`database: ${dbPreview.database.sanitizedUrl}`)
console.log(`plannedRows: ${dbPreview.totals.plannedRows}`)
console.log(`existingRows: ${dbPreview.totals.existingRows}`)
console.log(`emptyTables: ${dbPreview.totals.emptyTables}`)
console.log(`nonEmptyTables: ${dbPreview.totals.nonEmptyTables}`)
console.log(`missingTables: ${dbPreview.totals.missingTables}`)
console.log('writes: 0')
