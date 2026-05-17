import { createSeedPreview, loadGeneratedPayloads, writeSeedPreviewArtifacts } from '../seed/index.js'

const loaded = await loadGeneratedPayloads()
const preview = createSeedPreview(loaded)
await writeSeedPreviewArtifacts(preview)

console.log('Seed preview generated.')
console.log('report: docs/SEED_PREVIEW_REPORT.md')
console.log(`plannedRows: ${preview.plan.totals.rows}`)
console.log(`futureLocalImportRows: ${preview.plan.totals.futureLocalImportRows}`)
console.log(`blockedRows: ${preview.plan.totals.blockedRows}`)
console.log(`severity: ${JSON.stringify(preview.validation.severityCounts)}`)

if (preview.validation.severityCounts.BLOCKER > 0) {
  process.exitCode = 1
}
