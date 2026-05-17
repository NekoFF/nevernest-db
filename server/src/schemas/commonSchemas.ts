import * as v from 'valibot'

export const sourceStatusSchema = v.picklist(['verified', 'needs_verification', 'estimated', 'placeholder', 'mock', 'unknown'])
export const publicationStatusSchema = v.picklist(['draft', 'published', 'archived', 'hidden'])

export const idOrSlugSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1),
  v.maxLength(120),
  v.regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/)
)

export const routeIdOrSlugParamsSchema = v.object({
  idOrSlug: idOrSlugSchema,
})

export function parseWithSchema<TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(schema: TSchema, input: unknown): v.InferOutput<TSchema> {
  return v.parse(schema, input)
}
