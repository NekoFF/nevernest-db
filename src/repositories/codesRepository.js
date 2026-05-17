export function getAllCodes(sourceData = []) {
  return Array.isArray(sourceData) ? sourceData : []
}

export function getCodeByIdOrCode(sourceData = [], idOrCode) {
  const needle = String(idOrCode || '').trim().toLowerCase()
  return getAllCodes(sourceData).find((code) => code.id === needle || String(code.code || '').toLowerCase() === needle) || null
}

