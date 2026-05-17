import { eq, or } from 'drizzle-orm'
import type {
  ApartmentItemSummary,
  CodeSummary,
  CommunityLinkSummary,
  GuideDetail,
  GuideSummary,
  NewsPostDetail,
  NewsPostSummary,
} from '../../contracts/content.js'
import type { CodeUpdateRequest, NewsUpdateRequest } from '../../contracts/adminWrites.js'
import type { DbClient } from '../../db/client.js'
import { apartmentItems, codes, communityLinks, guides, newsPosts } from '../../db/schema/index.js'
import type { ContentRepository } from '../ContentRepository.js'
import type { FindManyOptions } from '../types.js'
import { asIsoString, asNumber, asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'
import { NotFoundError } from '../../utils/errors.js'

function toCode(row: typeof codes.$inferSelect): CodeSummary {
  return {
    id: row.id,
    externalId: row.externalId,
    code: row.code,
    rewardSummary: row.rewardSummary,
    status: row.status as CodeSummary['status'],
    sourceStatus: asSourceStatus(row.sourceStatus),
  }
}

function toNewsSummary(row: typeof newsPosts.$inferSelect): NewsPostSummary {
  return {
    ...entityBase({ ...row, name: row.title }),
    title: row.title,
    category: row.category,
    postedAt: asIsoString(row.postedAt),
    featured: row.featured,
    pinned: row.pinned,
  }
}

function toNewsDetail(row: typeof newsPosts.$inferSelect): NewsPostDetail {
  return {
    ...toNewsSummary(row),
    description: row.description,
    body: row.body,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
  }
}

function toGuideSummary(row: typeof guides.$inferSelect): GuideSummary {
  return {
    ...entityBase({ ...row, name: row.title }),
    title: row.title,
    category: row.category,
  }
}

function toGuideDetail(row: typeof guides.$inferSelect): GuideDetail {
  return {
    ...toGuideSummary(row),
    description: row.summary,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
    sections: [],
  }
}

function toCommunityLink(row: typeof communityLinks.$inferSelect): CommunityLinkSummary {
  return {
    externalId: row.externalId,
    label: row.label,
    url: row.url,
    category: row.category,
    sourceStatus: asSourceStatus(row.sourceStatus),
  }
}

function toApartmentItem(row: typeof apartmentItems.$inferSelect): ApartmentItemSummary {
  return {
    ...entityBase(row),
    category: row.category,
    price: asNumber(row.price),
    currency: row.currency,
  }
}

export class DbContentRepository implements ContentRepository {
  constructor(private readonly db: DbClient) {}

  codes = {
    findMany: async (filters: FindManyOptions = {}): Promise<CodeSummary[]> => {
      const rows = await this.db.select().from(codes).limit(filters.limit ?? 50)
      return rows.map(toCode)
    },
    update: async (idOrSlug: string, data: CodeUpdateRequest): Promise<CodeSummary> => {
      const row = await findByIdExternalIdOrSlug(this.db, codes, idOrSlug)
      if (!row) {
        throw new NotFoundError(`Code ${idOrSlug} not found.`)
      }

      const [updated] = await this.db.update(codes)
        .set({
          code: data.code,
          rewardSummary: data.rewardSummary,
          status: data.status,
          sourceUrl: data.sourceUrl,
          startDate: data.startDate ? new Date(data.startDate) : (data.startDate === null ? null : undefined),
          endDate: data.endDate ? new Date(data.endDate) : (data.endDate === null ? null : undefined),
          updatedAt: new Date(),
        })
        .where(eq(codes.id, row.id))
        .returning()

      return toCode(updated)
    },
  }

  news = {
    findMany: async (filters: FindManyOptions = {}): Promise<NewsPostSummary[]> => {
      const rows = await this.db.select().from(newsPosts).limit(filters.limit ?? 50)
      return rows.map(toNewsSummary)
    },
    findByIdOrSlug: async (idOrSlug: string): Promise<NewsPostDetail | null> => {
      const row = await findByIdExternalIdOrSlug(this.db, newsPosts, idOrSlug)
      return row ? toNewsDetail(row) : null
    },
    update: async (idOrSlug: string, data: NewsUpdateRequest): Promise<NewsPostDetail> => {
      const row = await findByIdExternalIdOrSlug(this.db, newsPosts, idOrSlug)
      if (!row) {
        throw new NotFoundError(`News post ${idOrSlug} not found.`)
      }

      const [updated] = await this.db.update(newsPosts)
        .set({
          title: data.title,
          description: data.description,
          body: data.body,
          category: data.category,
          featured: data.featured,
          pinned: data.pinned,
          postedAt: data.postedAt ? new Date(data.postedAt) : (data.postedAt === null ? null : undefined),
          sourceUrl: data.sourceUrl,
          updatedAt: new Date(),
        })
        .where(eq(newsPosts.id, row.id))
        .returning()

      return toNewsDetail(updated)
    },
  }

  guides = {
    findMany: async (filters: FindManyOptions = {}): Promise<GuideSummary[]> => {
      const rows = await this.db.select().from(guides).limit(filters.limit ?? 50)
      return rows.map(toGuideSummary)
    },
    findByIdOrSlug: async (idOrSlug: string): Promise<GuideDetail | null> => {
      const row = await findByIdExternalIdOrSlug(this.db, guides, idOrSlug)
      return row ? toGuideDetail(row) : null
    },
  }

  communityLinks = {
    findMany: async (filters: FindManyOptions = {}): Promise<CommunityLinkSummary[]> => {
      const rows = await this.db.select().from(communityLinks).limit(filters.limit ?? 50)
      return rows.map(toCommunityLink)
    },
  }

  apartmentItems = {
    findMany: async (filters: FindManyOptions = {}): Promise<ApartmentItemSummary[]> => {
      const rows = await this.db.select().from(apartmentItems).limit(filters.limit ?? 50)
      return rows.map(toApartmentItem)
    },
    findByIdOrSlug: async (idOrSlug: string): Promise<ApartmentItemSummary | null> => {
      const row = await findByIdExternalIdOrSlug(this.db, apartmentItems, idOrSlug)
      return row ? toApartmentItem(row) : null
    },
  }
}
