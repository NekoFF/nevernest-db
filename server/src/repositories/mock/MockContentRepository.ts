import type { ApartmentItemSummary, CodeSummary, CommunityLinkSummary, GuideDetail, GuideSummary, NewsPostDetail, NewsPostSummary } from '../../contracts/content.js'
import type { CodeUpdateRequest, NewsUpdateRequest } from '../../contracts/adminWrites.js'
import type { ContentRepository } from '../ContentRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'
import { NotFoundError } from '../../utils/errors.js'

export class MockContentRepository implements ContentRepository {
  codes: Pick<MockReadOnlyRepository<CodeSummary>, 'findMany'> & {
    update(idOrSlug: string, data: CodeUpdateRequest): Promise<CodeSummary>
  }
  news: MockReadOnlyRepository<NewsPostSummary, NewsPostDetail & NewsPostSummary> & {
    update(idOrSlug: string, data: NewsUpdateRequest): Promise<NewsPostDetail>
  }
  guides: MockReadOnlyRepository<GuideSummary, GuideDetail & GuideSummary>
  communityLinks
  apartmentItems: MockReadOnlyRepository<ApartmentItemSummary>

  constructor(
    codes: CodeSummary[] = [],
    news: Array<NewsPostDetail & NewsPostSummary> = [],
    guides: Array<GuideDetail & GuideSummary> = [],
    communityLinks: CommunityLinkSummary[] = [],
    apartmentItems: ApartmentItemSummary[] = []
  ) {
    this.codes = {
      findMany: async () => codes,
      update: async (idOrSlug, data) => {
        const code = codes.find((c) => c.externalId === idOrSlug || c.code === idOrSlug)
        if (!code) throw new NotFoundError(`Code ${idOrSlug} not found.`)

        const updated = { ...code, ...data } as CodeSummary
        return updated
      }
    }
    this.news = new MockReadOnlyRepository<NewsPostSummary, NewsPostDetail & NewsPostSummary>(news) as any
    this.news.update = async (idOrSlug, data) => {
      const post = news.find((n) => n.externalId === idOrSlug || n.slug === idOrSlug)
      if (!post) throw new NotFoundError(`News post ${idOrSlug} not found.`)

      const updated = { ...post, ...data } as NewsPostDetail & NewsPostSummary
      return updated
    }
    this.guides = new MockReadOnlyRepository<GuideSummary, GuideDetail & GuideSummary>(guides)
    this.communityLinks = { findMany: async () => communityLinks }
    this.apartmentItems = new MockReadOnlyRepository<ApartmentItemSummary>(apartmentItems)
  }
}
