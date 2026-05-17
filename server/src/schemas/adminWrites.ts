import * as v from 'valibot'

/**
 * Skeleton schemas for future admin write operations.
 * These are not wired to any active DB mutation yet.
 */

export const characterUpdateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
  description: v.optional(v.pipe(v.string(), v.maxLength(2000))),
  slug: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
})

export const characterCreateSchema = v.object({
  externalId: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  slug: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  description: v.optional(v.pipe(v.string(), v.maxLength(2000))),
})

export const codeUpdateSchema = v.object({
  code: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
  rewardSummary: v.optional(v.pipe(v.string(), v.maxLength(500))),
  status: v.optional(v.union([v.literal('active'), v.literal('expired'), v.literal('unknown')])),
  sourceUrl: v.optional(v.pipe(v.string(), v.maxLength(1000))),
  startDate: v.optional(v.union([v.pipe(v.string(), v.isoDate()), v.null_()])),
  endDate: v.optional(v.union([v.pipe(v.string(), v.isoDate()), v.null_()])),
})

export const newsUpdateSchema = v.object({
  title: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(200))),
  description: v.optional(v.pipe(v.string(), v.maxLength(1000))),
  body: v.optional(v.pipe(v.string(), v.maxLength(20000))),
  category: v.optional(v.pipe(v.string(), v.maxLength(50))),
  featured: v.optional(v.boolean()),
  pinned: v.optional(v.boolean()),
  postedAt: v.optional(v.union([v.pipe(v.string(), v.isoDate()), v.null_()])),
  sourceUrl: v.optional(v.pipe(v.string(), v.maxLength(1000))),
})
