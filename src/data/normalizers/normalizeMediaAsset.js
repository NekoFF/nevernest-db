import { cloneRaw, stringOrEmpty } from './normalizeShared.js'

export function normalizeMediaAssetForExport(asset = {}) {
  return {
    id: stringOrEmpty(asset.id),
    entityType: stringOrEmpty(asset.entityType),
    entityId: stringOrEmpty(asset.entityId),
    kind: stringOrEmpty(asset.kind),
    path: stringOrEmpty(asset.path),
    alt: stringOrEmpty(asset.alt),
    status: stringOrEmpty(asset.status || 'local-seed'),
    sourceUrl: stringOrEmpty(asset.sourceUrl),
    licenseNote: stringOrEmpty(asset.licenseNote),
    width: asset.width == null ? null : Number(asset.width),
    height: asset.height == null ? null : Number(asset.height),
    raw: cloneRaw(asset),
  }
}

