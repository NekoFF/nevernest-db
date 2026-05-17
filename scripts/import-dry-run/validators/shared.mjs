import { SOURCE_STATUSES } from '../loadSnapshot.mjs'

export const SEVERITY = Object.freeze({
  OK: 'OK',
  INFO: 'INFO',
  WARNING: 'WARNING',
  NEEDS_VERIFICATION: 'NEEDS_VERIFICATION',
  BLOCKER: 'BLOCKER',
})

export function issue(severity, area, message, detail = {}) {
  return { severity, area, message, detail }
}

export function setOf(rows, field = 'external_id') {
  return new Set((rows || []).map((row) => row[field]).filter(Boolean))
}

export function checkDuplicates(issues, tableName, rows, field) {
  const seen = new Map()
  for (const row of rows || []) {
    const value = row[field]
    if (!value) continue
    if (seen.has(value)) issues.push(issue(SEVERITY.BLOCKER, tableName, `Duplicate ${field}: ${value}`))
    seen.set(value, true)
  }
}

export function checkRequired(issues, tableName, rows, fields) {
  for (const [index, row] of (rows || []).entries()) {
    for (const field of fields) {
      if (row[field] == null || row[field] === '') {
        issues.push(issue(SEVERITY.BLOCKER, tableName, `Missing required ${field}`, { index, row }))
      }
    }
  }
}

export function checkSourceStatus(issues, tableName, rows) {
  for (const [index, row] of (rows || []).entries()) {
    if (!('source_status' in row)) continue
    if (!SOURCE_STATUSES.has(row.source_status)) {
      issues.push(issue(SEVERITY.BLOCKER, tableName, `Invalid source_status: ${row.source_status}`, { index }))
    }
  }
}

export function refCheck(issues, tableName, rows, field, targetSet, targetName, severity = SEVERITY.BLOCKER) {
  for (const row of rows || []) {
    const value = row[field]
    if (!value) continue
    if (!targetSet.has(value)) {
      issues.push(issue(severity, tableName, `Reference ${field}=${value} not found in ${targetName}`, { row }))
    }
  }
}

export function validateTableBasics(issues, tableName, rows, requiredFields, options = {}) {
  checkRequired(issues, tableName, rows, requiredFields)
  checkDuplicates(issues, tableName, rows, 'external_id')
  if (options.slug !== false) checkDuplicates(issues, tableName, rows, 'slug')
  checkSourceStatus(issues, tableName, rows)
}

