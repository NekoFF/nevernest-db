export type SourceStatus = 'verified' | 'needs_verification' | 'estimated' | 'placeholder' | 'mock' | 'unknown'
export type PublicationStatus = 'draft' | 'published' | 'archived' | 'hidden'

export type ApiOkResponse<T> = {
  ok: true
  data: T
  meta?: Record<string, unknown>
}

export type ApiErrorResponse = {
  ok: false
  status: string
  message: string
  issues?: unknown[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total?: number
}

export type PaginatedResponse<T> = ApiOkResponse<T[]> & {
  meta: PaginationMeta & Record<string, unknown>
}

export type EntitySummary = {
  id: string
  externalId: string
  slug: string
  name: string
  sourceStatus: SourceStatus
  publicationStatus?: PublicationStatus
}

export type EntityDetail = EntitySummary & {
  description?: string | null
  raw?: unknown
  createdAt?: string
  updatedAt?: string
}

export type DisplayRef = {
  id: string
  externalId: string
  label: string
  displayName: string
  slug?: string
  color?: string | null
  iconKey?: string | null
  sourceStatus?: SourceStatus
}

export type MediaDisplay = {
  id: string
  externalId: string
  kind: string
  path: string
  alt?: string | null
  sourceUrl?: string | null
  width?: number | null
  height?: number | null
  sourceStatus: SourceStatus
}

export type ListQuery = {
  page?: number
  limit?: number
  q?: string
  rarity?: string
  element?: string
  arcType?: string
  role?: string
  sourceStatus?: SourceStatus
  status?: PublicationStatus
}
