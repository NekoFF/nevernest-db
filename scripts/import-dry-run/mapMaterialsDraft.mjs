import { materialAliases } from '../../src/data/materialAliases.js'
import { materialCatalogDraft } from '../../src/data/materialCatalogDraft.js'
import { slug } from './loadSnapshot.mjs'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function materialKey(label) {
  return slug(label)
}

function resolveMaterial(label) {
  const key = materialKey(label)
  const alias = materialAliases[key]
  if (!alias) return { key, canonicalId: null, alias: null }
  return { key, canonicalId: alias.canonicalId, alias }
}

export function mapMaterialsDraft(payloads = {}) {
  const usageRows = payloads.characters?.characterMaterials || []
  const candidateMap = new Map(materialCatalogDraft.materials.map((material) => [material.id, clone(material)]))
  const usageByCandidate = new Map()
  const unresolvedByLabel = new Map()

  for (const row of usageRows) {
    const resolution = resolveMaterial(row.material_name)
    if (!resolution.canonicalId || !candidateMap.has(resolution.canonicalId)) {
      const key = resolution.key || materialKey(row.material_name)
      const existing = unresolvedByLabel.get(key) || {
        label: row.material_name,
        slug: key,
        observedUsageCount: 0,
        observedTotalAmount: 0,
        characters: [],
        skillExternalIds: [],
        sourceTexts: [],
        sourceStatus: 'needs_verification',
        note: 'Observed in character material data but not included in the reviewed Phase 7 material catalog draft.',
      }
      existing.observedUsageCount += 1
      existing.observedTotalAmount += Number(row.amount || 0)
      existing.characters.push(row.character_external_id)
      existing.skillExternalIds.push(row.skill_external_id)
      existing.sourceTexts.push(...(row.sources || []))
      unresolvedByLabel.set(key, existing)
      continue
    }

    const candidate = candidateMap.get(resolution.canonicalId)
    candidate.rawNames = unique([...(candidate.rawNames || []), row.material_name, ...(resolution.alias?.originalLabels || [])])
    candidate.aliases = unique([...(candidate.aliases || []), ...(resolution.alias?.originalLabels || [])])
    candidate.observedUsageCount += 1
    candidate.observedTotalAmount += Number(row.amount || 0)
    candidate.sourceStatus = candidate.sourceStatus || resolution.alias?.status || 'needs_verification'

    const materialUsage = {
      material_external_id: resolution.canonicalId,
      source_label: row.material_name,
      character_external_id: row.character_external_id,
      skill_external_id: row.skill_external_id || null,
      amount: row.amount ?? null,
      category: row.category || 'unknown',
      source_texts: row.sources || [],
      source_status: row.source_status || 'needs_verification',
      raw: row.raw || {},
    }
    usageByCandidate.set(resolution.canonicalId, [...(usageByCandidate.get(resolution.canonicalId) || []), materialUsage])
  }

  const materialCandidates = [...candidateMap.values()].sort((a, b) => a.id.localeCompare(b.id))
  const materialUsageRows = [...usageByCandidate.values()].flat().sort((a, b) => (
    a.material_external_id.localeCompare(b.material_external_id) ||
    a.character_external_id.localeCompare(b.character_external_id) ||
    String(a.skill_external_id || '').localeCompare(String(b.skill_external_id || ''))
  ))
  const unresolvedMaterialLabels = [...unresolvedByLabel.values()].map((item) => ({
    ...item,
    characters: unique(item.characters),
    skillExternalIds: unique(item.skillExternalIds),
    sourceTexts: unique(item.sourceTexts),
  })).sort((a, b) => a.slug.localeCompare(b.slug))

  return {
    status: 'draft',
    sourceStatus: 'needs_verification',
    materialCandidates,
    materialUsageRows,
    unresolvedMaterialLabels,
    sourceVerificationSummary: {
      verified: 0,
      needsVerification: materialCandidates.length + unresolvedMaterialLabels.length,
      unresolvedLabels: unresolvedMaterialLabels.length,
      note: 'Material data is draft-only and must be reviewed against trusted sources before production import.',
    },
  }
}
