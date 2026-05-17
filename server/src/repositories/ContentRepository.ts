import type {
  ApartmentItemSummary,
  CodeSummary,
  CommunityLinkSummary,
  GuideDetail,
  GuideSummary,
  NewsPostDetail,
  NewsPostSummary,
} from '../contracts/content.js'
import type { CodeUpdateRequest } from '../contracts/adminWrites.js'
import type { FindManyOptions, ReadOnlyRepository } from './types.js'

export interface ContentRepository {
  codes: Pick<ReadOnlyRepository<CodeSummary>, 'findMany'> & {
    update(idOrSlug: string, data: CodeUpdateRequest): Promise<CodeSummary>
  }
  news: ReadOnlyRepository<NewsPostSummary, NewsPostDetail>
  guides: ReadOnlyRepository<GuideSummary, GuideDetail>
  communityLinks: {
    findMany(filters?: FindManyOptions): Promise<CommunityLinkSummary[]>
  }
  apartmentItems: ReadOnlyRepository<ApartmentItemSummary>
}
