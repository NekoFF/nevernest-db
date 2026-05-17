import * as v from 'valibot'
import { publicationStatusSchema, sourceStatusSchema } from './commonSchemas.js'

export const entitySummarySchema = v.object({
  id: v.string(),
  externalId: v.string(),
  slug: v.string(),
  name: v.string(),
  sourceStatus: sourceStatusSchema,
  publicationStatus: v.optional(publicationStatusSchema),
})

export const entityDetailSchema = v.object({
  ...entitySummarySchema.entries,
  description: v.optional(v.nullable(v.string())),
  raw: v.optional(v.unknown()),
  createdAt: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
})
