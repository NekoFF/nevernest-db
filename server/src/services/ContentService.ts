import type { ContentRepository } from '../repositories/ContentRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import type { CodeUpdateRequest } from '../contracts/adminWrites.js'
import { NotFoundError } from '../utils/errors.js'
import { plannedServiceMethod } from './base.js'

export class ContentService {
  constructor(private readonly repository?: ContentRepository) {}

  async listCodes(filters?: FindManyOptions) {
    if (this.repository) return this.repository.codes.findMany(filters)
    return plannedServiceMethod('Content')
  }

  async updateCode(idOrSlug: string, data: CodeUpdateRequest) {
    if (!this.repository) return plannedServiceMethod('Content')
    return this.repository.codes.update(idOrSlug, data)
  }

  async listNews(filters?: FindManyOptions) {
    if (this.repository) return this.repository.news.findMany(filters)
    return plannedServiceMethod('Content')
  }

  async getNewsBySlug(slug: string) {
    if (!this.repository) return plannedServiceMethod('Content')
    const news = await this.repository.news.findByIdOrSlug(slug)
    if (!news) throw new NotFoundError('News post not found.')
    return news
  }

  async listGuides(filters?: FindManyOptions) {
    if (this.repository) return this.repository.guides.findMany(filters)
    return plannedServiceMethod('Content')
  }

  async getGuideBySlug(slug: string) {
    if (!this.repository) return plannedServiceMethod('Content')
    const guide = await this.repository.guides.findByIdOrSlug(slug)
    if (!guide) throw new NotFoundError('Guide not found.')
    return guide
  }

  async listCommunityLinks(filters?: FindManyOptions) {
    if (this.repository) return this.repository.communityLinks.findMany(filters)
    return plannedServiceMethod('Content')
  }

  async listApartmentItems(filters?: FindManyOptions) {
    if (this.repository) return this.repository.apartmentItems.findMany(filters)
    return plannedServiceMethod('Content')
  }
}
