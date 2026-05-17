import type { DisplayRef, EntitySummary, SourceStatus } from './common.js'

export type ModuleShapeSummary = EntitySummary & {
  moduleType: string
  moduleTypeLabel?: string
  width?: number | null
  height?: number | null
  cellCount?: number | null
}

export type ModulePieceSummary = EntitySummary & {
  moduleShapeId: string
  moduleShape?: ModuleShapeSummary | null
  rarityId?: string | null
  rarity?: DisplayRef | null
  moduleType: string
  moduleTypeLabel?: string
  mainStatId?: string | null
  mainStat?: {
    statId?: string | null
    stat?: DisplayRef | null
    value?: number | null
    valueText?: string | null
  } | null
  substats?: unknown[]
  sourceStatus: SourceStatus
}
