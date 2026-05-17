import type { EntitySummary } from './common.js'

/**
 * Skeleton types for future admin write operations.
 */

export type CharacterCreateRequest = {
  externalId: string
  name: string
  slug: string
  description?: string
}

export type CharacterUpdateRequest = Partial<Omit<CharacterCreateRequest, 'externalId'>>

export type AdminWriteResponse<T> = {
  ok: true
  data: T
  auditId?: string
}

export type CodeUpdateRequest = {
  code?: string
  rewardSummary?: string
  status?: 'active' | 'expired' | 'unknown'
  sourceUrl?: string
  startDate?: string | null
  endDate?: string | null
}

export type NewsUpdateRequest = {
  title?: string
  description?: string
  body?: string
  category?: string
  featured?: boolean
  pinned?: boolean
  postedAt?: string | null
  sourceUrl?: string
}
