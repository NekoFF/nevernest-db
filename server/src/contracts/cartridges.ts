import type { DisplayRef, EntityDetail, EntitySummary, MediaDisplay, SourceStatus } from './common.js'

export type CartridgeSetSummary = EntitySummary & {
  elementId?: string | null
  element?: DisplayRef | null
  bonusCategory?: string | null
  bonusCategoryLabel?: string | null
  dataStatus?: string | null
  media?: MediaDisplay | null
}

export type CartridgeSetDetail = EntityDetail & CartridgeSetSummary & {
  bonuses?: CartridgeSetBonus[]
  compatibleShapes?: CartridgeCompatibleShape[]
}

export type CartridgeSetBonus = {
  pieces: number
  effectText: string
  isConditional: boolean
  sourceStatus: SourceStatus
}

export type CartridgeCompatibleShape = {
  slotIndex: number
  moduleShapeId?: string | null
  shapeExternalId?: string | null
  shape?: {
    id: string
    externalId: string
    slug: string
    name: string
    moduleType: string
    width?: number | null
    height?: number | null
    cellCount?: number | null
  } | null
  sourceStatus: SourceStatus
}
