import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'
import { assertLocalDatabaseUrl } from '../db/safety.js'
import {
  buildSeedImportDryRun,
  createSeedPreview,
  loadGeneratedPayloads,
  renderSeedImportLocalReport,
  runSeedImportLocal,
  writeSeedPreviewArtifacts,
} from '../seed/index.js'

const databaseUrl = process.env.DATABASE_URL
assertLocalDatabaseUrl(databaseUrl)
const safeDatabaseUrl = databaseUrl as string
const confirmed = process.env.CONFIRM_LOCAL_SEED_IMPORT === '1'

const loaded = await loadGeneratedPayloads()
const preview = createSeedPreview(loaded)
await writeSeedPreviewArtifacts(preview)

const report = confirmed
  ? await runSeedImportLocal(loaded, preview.validation, preview.plan, safeDatabaseUrl)
  : buildSeedImportDryRun(loaded, preview.validation, preview.plan, safeDatabaseUrl)

const generatedDir = path.join(process.cwd(), '.generated', 'server-seed-preview')
await mkdir(generatedDir, { recursive: true })
await writeFile(path.join(generatedDir, 'seed-import-local-report.json'), `${JSON.stringify(report, null, 2)}\n`)
await writeFile(path.join(process.cwd(), 'docs', 'SEED_IMPORT_LOCAL_REPORT.md'), renderSeedImportLocalReport(report))

if (!confirmed) {
  console.log('Local seed import dry-run complete. No writes were performed.')
  console.log('Set CONFIRM_LOCAL_SEED_IMPORT=1 to allow local DB writes.')
} else {
  console.log('Confirmed local seed import complete.')
}

console.log('report: docs/SEED_IMPORT_LOCAL_REPORT.md')
console.log(`mode: ${report.mode}`)
console.log(`database: ${report.database.sanitizedUrl}`)
console.log(`transaction: ${report.transaction}`)
console.log(`inserted: ${report.inserted}`)
console.log(`updated: ${report.updated}`)
console.log(`skipped: ${report.skipped}`)
console.log(`failed: ${report.failed}`)

if (preview.validation.severityCounts.BLOCKER > 0 || report.failed > 0) {
  process.exitCode = 1
}
