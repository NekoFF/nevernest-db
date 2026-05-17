import { cloneRaw, stringOrEmpty } from './normalizeShared.js'

export function normalizeBuildDraftForExport(draft = {}) {
  const state = draft.state || draft.plannerState || draft
  const slots = Array.isArray(state.slots) ? state.slots : []
  return {
    id: stringOrEmpty(draft.id || `draft-${Date.now()}`),
    name: stringOrEmpty(draft.name || draft.characterName || 'Build draft'),
    version: Number(draft.version) || 1,
    savedAt: stringOrEmpty(draft.savedAt || draft.createdAt || new Date().toISOString()),
    activeSlotIndex: Number(state.activeSlotIndex || draft.selectedSlot || 0),
    slots: slots.map((slot, index) => ({
      slotIndex: index,
      characterId: slot.characterId || null,
      level: Number(slot.level) || 80,
      weaponId: slot.weaponId || slot.arcId || null,
      weaponLevel: Number(slot.weaponLevel || slot.arcLevel || 80),
      cartridgeId: slot.console?.cartridgeId || null,
      cartridgeRarity: slot.console?.rarity || 'S',
      mainStatId: slot.console?.mainStat || null,
      subStatIds: Array.isArray(slot.console?.subStats) ? slot.console.subStats.filter(Boolean) : [],
      modules: Array.isArray(slot.modules) ? slot.modules.map((module, moduleIndex) => ({
        id: stringOrEmpty(module.id || module.placementId || `module-${moduleIndex + 1}`),
        moduleShapeId: module.moduleShapeId || module.shapeId || null,
        rarity: module.rarity || 'S',
        x: Number(module.x) || 0,
        y: Number(module.y) || 0,
        mainStatId: module.mainStat || module.mainStatId || null,
        subStatIds: Array.isArray(module.subStats) ? module.subStats.filter(Boolean) : [],
      })) : [],
      awakening: slot.awakening || {},
      abilities: slot.abilities || {},
    })),
    raw: cloneRaw(draft),
  }
}

