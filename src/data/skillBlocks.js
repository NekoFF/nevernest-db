export const SKILL_TYPES = [
  'Basic Attack',
  'Skill',
  'Ultimate',
  'Passive',
  'Life Skill',
  'Awakening',
  'Breakthrough',
  'Other',
]

function slugify(value, fallback) {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

function normalizeDescriptionBlock(block, skillId, index) {
  const title = block?.title || block?.name || `${skillId} ${index + 1}`
  return {
    id: String(block?.id || `${skillId}-${index + 1}`),
    title: String(title),
    content: String(block?.content ?? block?.text ?? block?.description ?? ''),
  }
}

function normalizeAttributeLevel(level, index) {
  const rows = Array.isArray(level?.rows)
    ? level.rows
    : Array.isArray(level?.values)
      ? level.values
      : []

  return {
    level: Number(level?.level) || index + 1,
    rows: rows.map((row) => ({
      label: String(row?.label || ''),
      value: String(row?.value || ''),
      notes: String(row?.notes || ''),
      sourceStatus: String(row?.sourceStatus || ''),
    })),
    sourceStatus: String(level?.sourceStatus || ''),
  }
}

function normalizeUpgradeMaterial(material, index) {
  return {
    id: String(material?.id || `material-${index + 1}`),
    name: String(material?.name || `Material ${index + 1}`),
    amount: Number(material?.amount) || 0,
    image: String(material?.image || material?.icon || ''),
    sources: Array.isArray(material?.sources) ? material.sources.map((source) => String(source)) : [],
  }
}

function normalizeSkillMaterials(materials) {
  if (!materials) return { upgradeMaterials: [], currencyCost: 0 }
  if (Array.isArray(materials)) return { upgradeMaterials: materials.map(normalizeUpgradeMaterial), currencyCost: 0 }
  if (typeof materials !== 'object') return { upgradeMaterials: [], currencyCost: 0 }

  return {
    upgradeMaterials: Array.isArray(materials.items) ? materials.items.map(normalizeUpgradeMaterial) : [],
    currencyCost: Number(materials.currency || materials.currencyCost) || 0,
  }
}

function normalizeSkill(skill, index, fallbackId) {
  const rawType = SKILL_TYPES.includes(skill?.type) ? skill.type : 'Other'
  const name = String(skill?.name || skill?.title || fallbackId || `Skill ${index + 1}`)
  const id = String(skill?.id || slugify(name, `skill-${index + 1}`))
  const skillMaterials = normalizeSkillMaterials(skill?.upgradeMaterials ? { items: skill.upgradeMaterials, currencyCost: skill.currencyCost } : skill?.materials)
  const rawBlocks = Array.isArray(skill?.descriptionBlocks)
    ? skill.descriptionBlocks
    : Array.isArray(skill?.description)
      ? skill.description
      : skill?.description
        ? [{ title: name, content: skill.description }]
        : []

  return {
    id,
    name,
    type: rawType,
    icon: String(skill?.icon || ''),
    enabled: skill?.enabled !== false,
    descriptionBlocks: rawBlocks.map((block, blockIndex) => normalizeDescriptionBlock(block, id, blockIndex)),
    quote: String(skill?.quote ?? skill?.flavorText ?? ''),
    attributeLevels: Array.isArray(skill?.attributeLevels)
      ? skill.attributeLevels.map(normalizeAttributeLevel)
      : Array.isArray(skill?.attributes)
        ? skill.attributes.map(normalizeAttributeLevel)
        : [],
    attributesByLevel: skill?.attributesByLevel && typeof skill.attributesByLevel === 'object' ? { ...skill.attributesByLevel } : {},
    knownLevels: Array.isArray(skill?.knownLevels) ? skill.knownLevels.map((level) => Number(level)).filter(Number.isFinite) : [],
    maxLevel: Number(skill?.maxLevel) || null,
    upgradeMaterials: skillMaterials.upgradeMaterials,
    currencyCost: skill?.currencyCost !== undefined ? Number(skill.currencyCost) || 0 : skillMaterials.currencyCost,
    sourceStatus: String(skill?.sourceStatus || ''),
    canonicalType: String(skill?.canonicalType || ''),
  }
}

export function normalizeSkills(skills) {
  if (!skills) return []
  if (Array.isArray(skills)) return skills.map((skill, index) => normalizeSkill(skill, index))
  if (typeof skills !== 'object') return []
  return Object.entries(skills).map(([id, skill], index) => normalizeSkill(skill, index, id))
}

export function hasRenderableSkills(skills) {
  return normalizeSkills(skills).some((skill) => {
    if (skill.enabled === false) return false
    if (skill.name.trim()) return true
    if (skill.descriptionBlocks.some((block) => block.title.trim() || block.content.trim())) return true
    return false
  })
}
