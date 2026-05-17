export function normalizeMaterialItem(material, index) {
  return {
    id: String(material?.id || `material-${index + 1}`),
    materialId: String(material?.materialId || material?.id || `material-${index + 1}`),
    name: String(material?.name || `Material ${index + 1}`),
    amount: Number(material?.amount) || 0,
    image: String(material?.image || material?.icon || ''),
    sources: Array.isArray(material?.sources) ? material.sources.map((source) => String(source)) : [],
    group: String(material?.group || ''),
    sourceStatus: String(material?.sourceStatus || material?.status || ''),
  }
}

function normalizeMaterialSection(section, index) {
  return {
    id: String(section?.id || section?.source || `material-section-${index + 1}`),
    title: String(section?.title || section?.source || `Material Section ${index + 1}`),
    notes: String(section?.notes || section?.note || ''),
    source: String(section?.source || ''),
    status: String(section?.status || section?.sourceStatus || ''),
    items: Array.isArray(section?.items) ? section.items.map(normalizeMaterialItem) : [],
  }
}

export function normalizeCharacterMaterials(materials) {
  const empty = {
    title: 'Character Ascension Materials',
    notes: '',
    items: [],
    currencyCost: 0,
    ascensionMaterials: [],
    skillMaterials: [],
    lifeSkillMaterials: [],
    materialSources: [],
    ascensionTotals: [],
  }

  if (!materials || typeof materials !== 'object') {
    return empty
  }

  return {
    ...empty,
    title: String(materials.title || 'Character Ascension Materials'),
    notes: String(materials.notes || materials.note || ''),
    items: Array.isArray(materials.items) ? materials.items.map(normalizeMaterialItem) : [],
    currencyCost: Number(materials.currencyCost || materials.currency) || 0,
    ascensionMaterials: Array.isArray(materials.ascensionMaterials) ? materials.ascensionMaterials.map(normalizeMaterialItem) : [],
    skillMaterials: Array.isArray(materials.skillMaterials) ? materials.skillMaterials.map(normalizeMaterialItem) : [],
    lifeSkillMaterials: Array.isArray(materials.lifeSkillMaterials) ? materials.lifeSkillMaterials : [],
    materialSources: Array.isArray(materials.materialSources) ? materials.materialSources : [],
    ascensionTotals: Array.isArray(materials.ascensionTotals) ? materials.ascensionTotals.map(normalizeMaterialSection) : [],
  }
}

export function hasCharacterMaterials(materials) {
  const normalized = normalizeCharacterMaterials(materials)
  return Boolean(normalized.notes.trim() || normalized.items.length || normalized.currencyCost > 0)
}
