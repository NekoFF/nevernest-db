import { slug } from './loadSnapshot.mjs'

export function mapContent(snapshot) {
  return {
    codes: (snapshot.data.codes || []).map((item) => ({
      external_id: item.id,
      code: item.code,
      reward_summary: item.rewardSummary || '',
      status: item.status || 'unknown',
      start_date: item.startDate || null,
      end_date: item.endDate || null,
      source_url: item.sourceUrl || '',
      source_status: item.startDate || item.endDate ? 'unknown' : 'needs_verification',
    })),
    newsPosts: (snapshot.data.news || []).map((item) => ({
      external_id: item.id,
      slug: item.slug || slug(item.id || item.title),
      title: item.title,
      description: item.description || '',
      category: item.category || '',
      posted_at: item.date || null,
      source_url: item.sourceUrl || '',
      featured: Boolean(item.featured),
      pinned: Boolean(item.pinned),
      source_status: item.sourceUrl ? 'unknown' : 'placeholder',
      publication_status: 'draft',
    })),
    guides: [],
    communityLinks: [],
    apartmentItems: [],
  }
}

