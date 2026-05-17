import type { DisplayRef, EntityDetail, EntitySummary, MediaDisplay, SourceStatus } from './common.js'

export type WeaponSummary = EntitySummary & {
  rarityId?: string | null
  rarity?: DisplayRef | null
  arcTypeId?: string | null
  arcType?: DisplayRef | null
  mainStatId?: string | null
  mainStat?: WeaponStatDisplay | null
  subStatId?: string | null
  subStat?: WeaponStatDisplay | null
  media?: MediaDisplay | null
}

export type WeaponDetail = EntityDetail & WeaponSummary & {
  quote?: string | null
  refinements?: WeaponRefinement[]
  growthScaling?: WeaponGrowthStat[]
}

export type WeaponRefinement = {
  rank: number
  effectText: string
}

export type WeaponStatDisplay = {
  statId?: string | null
  stat?: DisplayRef | null
  value?: number | null
  valueText?: string | null
}

export type WeaponGrowthStat = WeaponStatDisplay & {
  level: number
  sourceStatus: SourceStatus
}
