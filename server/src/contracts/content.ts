import type { EntityDetail, EntitySummary, SourceStatus } from './common.js'

export type CodeSummary = {
  id: string
  externalId: string
  code: string
  rewardSummary?: string | null
  status: 'active' | 'expired' | 'unknown'
  sourceStatus: SourceStatus
}

export type NewsPostSummary = EntitySummary & {
  title: string
  category?: string | null
  postedAt?: string | null
  featured: boolean
  pinned: boolean
}

export type NewsPostDetail = EntityDetail & NewsPostSummary & {
  body?: string | null
}

export type GuideSummary = EntitySummary & {
  title: string
  category?: string | null
}

export type GuideDetail = EntityDetail & GuideSummary & {
  sections?: Array<{
    heading?: string | null
    body?: string | null
    sortOrder: number
  }>
}

export type CommunityLinkSummary = {
  externalId: string
  label: string
  url: string
  category?: string | null
  sourceStatus: SourceStatus
}

export type ApartmentItemSummary = EntitySummary & {
  category?: string | null
  price?: number | null
  currency?: string | null
}
