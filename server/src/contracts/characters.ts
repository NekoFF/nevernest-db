import type { DisplayRef, EntityDetail, EntitySummary, MediaDisplay } from './common.js'

export type CharacterSummary = EntitySummary & {
  rarityId?: string | null
  rarity?: DisplayRef | null
  elementId?: string | null
  element?: DisplayRef | null
  arcTypeId?: string | null
  arcType?: DisplayRef | null
  faction?: string | null
  roles?: string[]
  roleLabels?: DisplayRef[]
  tags?: string[]
  tagLabels?: DisplayRef[]
  media?: MediaDisplay | null
}

export type CharacterDetail = EntityDetail & CharacterSummary & {
  birthday?: string | null
  profileText?: string | null
  stats?: CharacterStat[]
  skills?: CharacterSkill[]
}

export type CharacterStat = {
  statId: string
  stat?: DisplayRef | null
  level?: number | null
  value?: number | string | null
  valueText?: string | null
  sourceStatus: CharacterSummary['sourceStatus']
}

export type CharacterSkill = {
  externalId: string
  name: string
  skillType: string
  description?: string | null
  sortOrder: number
}
