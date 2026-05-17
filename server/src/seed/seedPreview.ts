import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { LoadedGeneratedPayloads, SeedPlan, SeedValidationResult } from './seedTypes.js'
import { buildSeedPlan } from './seedPlan.js'
import { validateSeedPayloads } from './seedValidation.js'

export type SeedPreview = {
  loaded: LoadedGeneratedPayloads
  validation: SeedValidationResult
  plan: SeedPlan
}

export function createSeedPreview(loaded: LoadedGeneratedPayloads): SeedPreview {
  const validation = validateSeedPayloads(loaded)
  const plan = buildSeedPlan(loaded.payloads, validation)
  return { loaded, validation, plan }
}

export function renderSeedPreviewReport(preview: SeedPreview): string {
  const blockerCount = preview.validation.severityCounts.BLOCKER
  const warningCount = preview.validation.severityCounts.WARNING
  const needsVerificationCount = preview.validation.severityCounts.NEEDS_VERIFICATION
  const blockedSteps = preview.plan.steps.filter((step) => !step.allowedForFutureLocalImport)

  const planRows = preview.plan.steps
    .map((step) => `| ${step.order} | ${step.group} | ${step.table} | ${step.rowCount} | ${step.allowedForPreview ? 'yes' : 'no'} | ${step.allowedForFutureLocalImport ? 'yes' : 'no'} | ${step.blockedReason ?? ''} |`)
    .join('\n')

  const issueRows = preview.validation.issues
    .slice(0, 80)
    .map((issue) => `| ${issue.severity} | ${issue.area} | ${issue.table ?? ''} | ${issue.message.replaceAll('|', '\\|')} |`)
    .join('\n')

  return `# Seed Preview Report

Generated: ${preview.validation.generatedAt}

## Summary

- Snapshot source: ${preview.loaded.summary.snapshot?.source ?? 'unknown'}
- Total planned rows: ${preview.plan.totals.rows}
- Preview rows: ${preview.plan.totals.previewRows}
- Future local import rows: ${preview.plan.totals.futureLocalImportRows}
- Blocked rows: ${preview.plan.totals.blockedRows}
- Blockers: ${blockerCount}
- Warnings: ${warningCount}
- Needs verification: ${needsVerificationCount}
- Can preview: ${preview.validation.canPreview ? 'yes' : 'no'}
- Can future local import without review: ${preview.validation.canFutureLocalImport ? 'yes' : 'no'}

This report is read-only. It does not write to PostgreSQL.

## Seed Plan

| Order | Group | Table | Rows | Preview | Future Local Import | Blocked Reason |
| --- | --- | ---: | ---: | --- | --- | --- |
${planRows}

## Blocked Or Review-gated Areas

${blockedSteps.length > 0 ? blockedSteps.map((step) => `- ${step.table}: ${step.blockedReason ?? 'blocked'}`).join('\n') : '- None'}

## Validation Issues

| Severity | Area | Table | Message |
| --- | --- | --- | --- |
${issueRows || '| OK | seed-validation |  | No validation issues detected. |'}

${preview.validation.issues.length > 80 ? `\nAdditional issues omitted from markdown: ${preview.validation.issues.length - 80}. See .generated/server-seed-preview/seed-validation.json.\n` : ''}

## Import Policy

- Cartridge compatible shapes with \`needs_verification\` are allowed for preview but require source review before production import.
- Character material rows are draft references and are blocked from future local import until material catalog verification is complete.
- Placeholder guides, community links, and apartment items remain blocked from import planning.
- Admin, user, session, and localStorage data are not allowed in seed payloads.
- Unverified data must not be promoted to \`verified\`.
`
}

export async function writeSeedPreviewArtifacts(preview: SeedPreview) {
  const generatedDir = path.join(process.cwd(), '.generated', 'server-seed-preview')
  await mkdir(generatedDir, { recursive: true })
  await writeFile(path.join(generatedDir, 'seed-plan.json'), `${JSON.stringify(preview.plan, null, 2)}\n`)
  await writeFile(path.join(generatedDir, 'seed-validation.json'), `${JSON.stringify(preview.validation, null, 2)}\n`)
  await writeFile(path.join(process.cwd(), 'docs', 'SEED_PREVIEW_REPORT.md'), renderSeedPreviewReport(preview))
}
