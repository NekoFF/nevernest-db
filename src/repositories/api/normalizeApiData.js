export function expectArray(value, label) {
  if (Array.isArray(value)) return value
  throw new TypeError(`Expected ${label} API data to be an array.`)
}

export function expectObject(value, label) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  throw new TypeError(`Expected ${label} API data to be an object.`)
}
