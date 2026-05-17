import type { SourceStatus } from './common.js'

export type TaxonomyItem = {
  id: string
  externalId: string
  slug?: string
  name: string
  color?: string | null
  iconKey?: string | null
  sortOrder: number
  sourceStatus: SourceStatus
}

export type StatSummary = TaxonomyItem & {
  displayName: string
  category: string
  valueType: 'flat' | 'percent' | 'integer' | 'text'
  allowedAsMainStat: boolean
  allowedAsSubStat: boolean
  allowedAsWeaponSubStat: boolean
  allowedAsCharacterStat: boolean
}
