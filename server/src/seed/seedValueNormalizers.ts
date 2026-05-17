export class SeedValueValidationError extends Error {
  field: string
  rawValue: unknown

  constructor(message: string, options: { field: string; rawValue: unknown }) {
    super(message)
    this.name = 'SeedValueValidationError'
    this.field = options.field
    this.rawValue = options.rawValue
  }
}

function parseNumericString(value: string, field: string): number {
  const trimmed = value.trim()
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    throw new SeedValueValidationError(`Invalid numeric seed value for ${field}: ${JSON.stringify(value)}`, {
      field,
      rawValue: value,
    })
  }

  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new SeedValueValidationError(`Invalid numeric seed value for ${field}: ${JSON.stringify(value)}`, {
      field,
      rawValue: value,
    })
  }
  return parsed
}

export function normalizeNumber(value: unknown, field = 'value'): number {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new SeedValueValidationError(`Invalid numeric seed value for ${field}: ${JSON.stringify(value)}`, {
        field,
        rawValue: value,
      })
    }
    return value
  }

  if (typeof value === 'string') {
    return parseNumericString(value, field)
  }

  throw new SeedValueValidationError(`Invalid numeric seed value for ${field}: ${JSON.stringify(value)}`, {
    field,
    rawValue: value,
  })
}

export function normalizePercentNumber(value: unknown, field = 'value'): number {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.endsWith('%')) {
      try {
        return parseNumericString(trimmed.slice(0, -1), field)
      } catch (error) {
        if (error instanceof SeedValueValidationError) {
          throw new SeedValueValidationError(`Invalid numeric seed value for ${field}: ${JSON.stringify(value)}`, {
            field,
            rawValue: value,
          })
        }
        throw error
      }
    }
  }

  return normalizeNumber(value, field)
}

export function normalizeNullableNumber(value: unknown, field = 'value'): number | null {
  if (value === null || value === undefined || value === '') return null
  return normalizeNumber(value, field)
}

export function normalizeNullablePercentNumber(value: unknown, field = 'value'): number | null {
  if (value === null || value === undefined || value === '') return null
  return normalizePercentNumber(value, field)
}
