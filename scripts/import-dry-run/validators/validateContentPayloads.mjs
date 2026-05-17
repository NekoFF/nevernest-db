import { validateTableBasics, issue, SEVERITY } from './shared.mjs'

export function validateContentPayloads(payloads) {
  const issues = []
  validateTableBasics(issues, 'codes', payloads.content.codes, ['external_id', 'code', 'status'], { slug: false })
  validateTableBasics(issues, 'news_posts', payloads.content.newsPosts, ['external_id', 'slug', 'title'])
  if (!payloads.content.guides.length) issues.push(issue(SEVERITY.WARNING, 'guides', 'Guides are placeholder-level and not mapped for production import.'))
  if (!payloads.content.communityLinks.length) issues.push(issue(SEVERITY.WARNING, 'community_links', 'Community links do not have a production seed model yet.'))
  if (!payloads.content.apartmentItems.length) issues.push(issue(SEVERITY.WARNING, 'apartment_items', 'Apartment items do not have a production seed model yet.'))
  return issues
}

