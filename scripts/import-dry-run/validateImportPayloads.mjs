import { runPayloadValidators, SEVERITY } from './validators/index.mjs'

function rowsByTable(payloads) {
  const rows = []
  for (const [groupName, group] of Object.entries(payloads)) {
    for (const [tableName, tableRows] of Object.entries(group)) {
      rows.push({ groupName, tableName, rows: tableRows })
    }
  }
  return rows
}

export function validateImportPayloads(payloads) {
  const { issues, context } = runPayloadValidators(payloads)
  const counts = {}
  const sourceStatusBreakdown = {}

  for (const { tableName, rows } of rowsByTable(payloads)) {
    counts[tableName] = rows.length
    for (const row of rows) {
      if (row.source_status) {
        sourceStatusBreakdown[row.source_status] = (sourceStatusBreakdown[row.source_status] || 0) + 1
      }
    }
  }

  const severityCounts = Object.values(SEVERITY).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  for (const row of issues) severityCounts[row.severity] += 1

  return {
    issues,
    counts,
    severityCounts,
    sourceStatusBreakdown,
    resolvedMediaAliases: context.resolvedMediaAliases,
  }
}

