import * as v from 'valibot'
import { publicationStatusSchema, sourceStatusSchema } from './commonSchemas.js'

const optionalString = v.optional(v.pipe(v.string(), v.trim(), v.maxLength(120)))

const numberFromQuery = (fallback: number, min: number, max: number) =>
  v.optional(
    v.pipe(
      v.union([v.string(), v.number()]),
      v.transform((value) => Number(value)),
      v.integer(),
      v.minValue(min),
      v.maxValue(max)
    ),
    fallback
  )

export const paginationQuerySchema = v.object({
  page: numberFromQuery(1, 1, 10000),
  limit: numberFromQuery(24, 1, 100),
})

export const searchQuerySchema = v.object({
  q: optionalString,
})

export const filterQuerySchema = v.object({
  rarity: optionalString,
  element: optionalString,
  arcType: optionalString,
  role: optionalString,
  sourceStatus: v.optional(sourceStatusSchema),
  status: v.optional(publicationStatusSchema),
})

export const listQuerySchema = v.intersect([paginationQuerySchema, searchQuerySchema, filterQuerySchema])
