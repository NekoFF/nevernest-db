import * as v from 'valibot'

export const loginRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  password: v.pipe(v.string(), v.minLength(1), v.maxLength(512)),
  provider: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(80))),
})
