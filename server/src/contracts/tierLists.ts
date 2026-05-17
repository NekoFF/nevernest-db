import type { DisplayRef, EntityDetail, EntitySummary, MediaDisplay, SourceStatus } from './common.js'

export type TierListSummary = EntitySummary & {
  title: string
  listType: 'official' | 'user' | 'event' | 'draft'
}

export type TierListDetail = EntityDetail & TierListSummary & {
  rows: TierRow[]
}

export type TierRow = {
  externalId?: string | null
  label: string
  subtitle?: string | null
  color?: string | null
  sortOrder: number
  entries: TierEntry[]
}

export type TierEntry = {
  characterId: string
  characterExternalId?: string | null
  characterSlug?: string | null
  characterName?: string | null
  characterAvatar?: MediaDisplay | null
  rarity?: DisplayRef | null
  position: number
  note?: string | null
  sourceStatus: SourceStatus
}
