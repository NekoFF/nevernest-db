export type SeedSeverity = 'OK' | 'INFO' | 'WARNING' | 'NEEDS_VERIFICATION' | 'BLOCKER'

export type SeedSourceStatus = 'verified' | 'needs_verification' | 'estimated' | 'placeholder' | 'mock' | 'unknown'

export type SeedRow = Record<string, unknown>

export type SeedGroupName =
  | 'taxonomy'
  | 'media'
  | 'characters'
  | 'weapons'
  | 'cartridgesModules'
  | 'vehicles'
  | 'tierLists'
  | 'content'

export type SeedPayloadGroup = Record<string, SeedRow[]>

export type GeneratedSeedPayloads = Record<SeedGroupName, SeedPayloadGroup>

export type GeneratedPayloadSummary = {
  generatedAt?: string
  snapshot?: {
    source?: string
    version?: number
    generatedAt?: string
  }
  payloadSummary?: Record<string, Record<string, number>>
  severityCounts?: Partial<Record<SeedSeverity, number>>
  sourceStatusBreakdown?: Record<string, number>
  resolvedMediaAliases?: number
  materialCandidates?: number
  materialUsageRows?: number
  unresolvedMaterialLabels?: number
}

export type DryRunIssue = {
  severity: SeedSeverity
  area: string
  message: string
  detail?: unknown
}

export type LoadedGeneratedPayloads = {
  payloads: GeneratedSeedPayloads
  summary: GeneratedPayloadSummary
  issues: DryRunIssue[]
}

export type SeedValidationIssue = {
  severity: SeedSeverity
  area: string
  table?: string
  message: string
  detail?: unknown
}

export type SeedValidationResult = {
  generatedAt: string
  severityCounts: Record<SeedSeverity, number>
  issues: SeedValidationIssue[]
  canPreview: boolean
  canFutureLocalImport: boolean
}

export type SeedPlanStep = {
  order: number
  group: SeedGroupName
  table: string
  rowCount: number
  allowedForPreview: boolean
  allowedForFutureLocalImport: boolean
  blockedReason: string | null
  sourceStatusNotes: Record<string, number>
}

export type SeedPlan = {
  generatedAt: string
  steps: SeedPlanStep[]
  totals: {
    rows: number
    previewRows: number
    futureLocalImportRows: number
    blockedRows: number
  }
}

export type SeedDbTableComparison = {
  planTable: string
  dbTable: string
  plannedRows: number
  existingRows: number | null
  difference: number | null
  status: 'empty' | 'non_empty' | 'missing' | 'skipped'
  allowedForFutureLocalImport: boolean
  blockedReason: string | null
}

export type SeedDbPreview = {
  generatedAt: string
  database: {
    host: string
    database: string
    sanitizedUrl: string
  }
  comparisons: SeedDbTableComparison[]
  totals: {
    plannedRows: number
    existingRows: number
    missingTables: number
    skippedTables: number
    emptyTables: number
    nonEmptyTables: number
  }
}
