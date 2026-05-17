import { slug } from './loadSnapshot.mjs'

export function mapTaxonomy(snapshot) {
  const t = snapshot.taxonomy
  return {
    elements: t.elements.map((item, index) => ({
      external_id: item.id,
      slug: slug(item.id),
      name: item.name,
      color: item.color || null,
      sort_order: index,
      source_status: 'unknown',
    })),
    arcTypes: t.arcTypes.map((item, index) => ({
      external_id: item.id,
      slug: slug(item.id),
      name: item.name,
      sort_order: index,
      source_status: 'unknown',
    })),
    rarities: t.rarities.map((item, index) => ({
      external_id: item.id,
      name: item.name,
      rank_label: item.rankLabel,
      color: item.color || null,
      sort_order: index,
      source_status: 'unknown',
    })),
    roles: t.roles.map((item, index) => ({
      external_id: item.id,
      slug: slug(item.id),
      name: item.label,
      aliases: item.aliases || [],
      description: item.notes || '',
      sort_order: index,
      source_status: 'unknown',
    })),
    tags: t.tags.map((item, index) => ({
      external_id: item.id,
      slug: slug(item.id),
      name: item.label,
      aliases: item.aliases || [],
      description: item.notes || '',
      sort_order: index,
      source_status: 'unknown',
    })),
    stats: t.stats.map((item) => ({
      external_id: item.id,
      name: item.name,
      display_name: item.displayName || item.name,
      category: item.category,
      value_type: item.valueType,
      icon_key: item.iconKey,
      allowed_as_main_stat: Boolean(item.allowedAsMainStat),
      allowed_as_sub_stat: Boolean(item.allowedAsSubStat),
      allowed_as_weapon_sub_stat: Boolean(item.allowedAsWeaponSubStat),
      allowed_as_character_stat: Boolean(item.allowedAsCharacterStat),
      aliases: [],
      sort_order: item.sortOrder || 0,
      source_status: 'unknown',
    })),
  }
}

