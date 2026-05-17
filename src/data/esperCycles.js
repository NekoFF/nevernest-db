export const ESPER_CYCLES = [
  {
    id: 'remora',
    name: 'Remora',
    kind: 'pair',
    requiredElements: ['lakshana', 'cosmos'],
    trigger: 'Activated by Lakshana + Cosmos.',
    description: 'Applies Remora to the target for 5 sec, reducing movement speed and attack speed. The effect weakens over time and repeated applications reduce duration.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'enemy_debuff',
        effectKey: 'movement_and_attack_speed_reduction',
        condition: { trigger: 'lakshana_cosmos_cycle', durationSeconds: 5 },
        autoApply: false,
      },
    ],
  },
  {
    id: 'bloom',
    name: 'Bloom',
    kind: 'pair',
    requiredElements: ['cosmos', 'anima'],
    trigger: 'Activated by Cosmos + Anima.',
    description: 'Creates 1 Life Bud near the target, which produces 5 Life Petals. Then Life Petals fly to enemies in range, exploding every 2 sec and dealing AoE damage. Up to 3 Life Buds can exist at once.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'informational',
        effectKey: 'life_bud_petals_aoe_damage',
        condition: { trigger: 'cosmos_anima_cycle', maxInstances: 3 },
        autoApply: false,
        reason: 'Damage instance modeling is not implemented in Preview Stats.',
      },
    ],
  },
  {
    id: 'witchcraft',
    name: 'Witchcraft',
    kind: 'pair',
    requiredElements: ['anima', 'incantation'],
    trigger: 'Activated by Anima + Incantation.',
    description: 'Deals an additional instance of follow-up attack damage equal to 20% of received Anima and Incantation damage over 12 sec after the esper cycle trigger.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'conditional_damage',
        effectKey: 'follow_up_damage_from_received_anima_incantation_damage',
        value: 20,
        valueType: 'percent',
        condition: { trigger: 'anima_incantation_cycle', durationSeconds: 12 },
        autoApply: false,
        reason: 'Requires battle damage intake assumptions.',
      },
    ],
  },
  {
    id: 'nova',
    name: 'Nova',
    kind: 'pair',
    requiredElements: ['chaos', 'psyche'],
    trigger: 'Activated by Chaos + Psyche.',
    description: 'Applies Nova to the target for 5 sec. When the effect ends, the target receives heavy Psyche damage.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'conditional_damage',
        effectKey: 'delayed_psyche_damage',
        condition: { trigger: 'chaos_psyche_cycle', durationSeconds: 5 },
        autoApply: false,
      },
    ],
  },
  {
    id: 'burn',
    name: 'Burn',
    kind: 'pair',
    requiredElements: ['incantation', 'chaos'],
    trigger: 'Activated by Incantation + Chaos.',
    description: 'Applies Burn to the target, dealing periodic damage for 15 sec.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'conditional_damage',
        effectKey: 'periodic_burn_damage',
        condition: { trigger: 'incantation_chaos_cycle', durationSeconds: 15 },
        autoApply: false,
      },
    ],
  },
  {
    id: 'trace',
    name: 'Trace',
    kind: 'pair',
    requiredElements: ['psyche', 'lakshana'],
    trigger: 'Activated by Psyche + Lakshana.',
    description: "Increases the target's received Psyche and Lakshana damage by 20% for 12 sec.",
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'enemy_debuff',
        effectKey: 'received_psyche_lakshana_damage_increase',
        value: 20,
        valueType: 'percent',
        condition: { trigger: 'psyche_lakshana_cycle', durationSeconds: 12 },
        autoApply: false,
        reason: 'Target received-damage modifiers are not part of Preview Stats totals yet.',
      },
    ],
  },
  {
    id: 'charging',
    name: 'Charging',
    kind: 'advanced',
    requiredElements: ['lakshana', 'cosmos', 'anima'],
    trigger: 'Activated by Lakshana + Cosmos + Anima.',
    description: 'When Life Petals hit targets affected by Remora, the active character gains 10 energy for their ultimate / special ability.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'resource',
        effectKey: 'ultimate_energy_gain',
        value: 10,
        valueType: 'flat',
        condition: { trigger: 'life_petals_hit_remora_target' },
        autoApply: false,
        reason: 'Energy timeline modeling is not implemented in Preview Stats.',
      },
    ],
  },
  {
    id: 'dissonance',
    name: 'Dissonance',
    kind: 'advanced',
    requiredElements: ['chaos', 'psyche', 'incantation'],
    trigger: 'Activated by Chaos + Psyche + Incantation.',
    description: 'When a target is simultaneously affected by Nova and Burn, its Destruction / resistance is reduced by a certain percentage.',
    effectCategory: 'conditional',
    affectsStats: false,
    effects: [
      {
        type: 'enemy_debuff',
        effectKey: 'destruction_or_resistance_reduction',
        condition: { trigger: 'target_affected_by_nova_and_burn' },
        autoApply: false,
        reason: 'The exact value is unknown and must not be faked.',
      },
    ],
  },
]

export const ESPER_ELEMENTS = [
  { id: 'incantation', name: 'Incantation' },
  { id: 'cosmos', name: 'Cosmos' },
  { id: 'chaos', name: 'Chaos' },
  { id: 'psyche', name: 'Psyche' },
  { id: 'anima', name: 'Anima' },
  { id: 'lakshana', name: 'Lakshana' },
  { id: 'cognitive', name: 'Cognitive' },
]

export function normalizeElementId(element = '') {
  return String(element || '').trim().toLowerCase()
}

export function getSelectedElementsFromTeam(slots = [], characters = []) {
  return slots
    .map((slot, index) => {
      const character = characters.find((item) => item.id === slot.characterId)
      const element = normalizeElementId(character?.element)
      if (!character || !element) return null
      return {
        slotIndex: index,
        characterId: character.id,
        characterName: character.name,
        element,
      }
    })
    .filter(Boolean)
}

export function getEsperCyclePreview({ slots = [], characters = [], cycles = ESPER_CYCLES } = {}) {
  const selectedElementsFromTeam = getSelectedElementsFromTeam(slots, characters)
  const selectedElementSet = new Set(selectedElementsFromTeam.map((item) => item.element))
  const activeCycles = cycles.filter((cycle) =>
    (cycle.requiredElements || []).every((element) => selectedElementSet.has(normalizeElementId(element))),
  )
  const possibleCycles = cycles.filter((cycle) => {
    if (activeCycles.includes(cycle)) return false
    return (cycle.requiredElements || []).some((element) => selectedElementSet.has(normalizeElementId(element)))
  })
  const missingElements = Array.from(
    new Set(
      possibleCycles.flatMap((cycle) =>
        (cycle.requiredElements || [])
          .map(normalizeElementId)
          .filter((element) => element && !selectedElementSet.has(element)),
      ),
    ),
  )

  return {
    activeCycles,
    possibleCycles,
    missingElements,
    selectedElementsFromTeam,
  }
}

function getActiveCycleList(selectedElementsFromTeam = [], cycles = ESPER_CYCLES) {
  const selectedElementSet = new Set(selectedElementsFromTeam.map((item) => normalizeElementId(item.element)))
  return cycles.filter((cycle) =>
    (cycle.requiredElements || []).every((element) => selectedElementSet.has(normalizeElementId(element))),
  )
}

export function getActiveEsperCycles(selectedElementsFromTeam = [], cycles = ESPER_CYCLES) {
  const activeCycles = getActiveCycleList(selectedElementsFromTeam, cycles)
  return {
    activeCycles,
    involvedElements: Array.from(new Set(activeCycles.flatMap((cycle) => cycle.requiredElements || []).map(normalizeElementId))).filter(Boolean),
    descriptions: activeCycles.map((cycle) => ({ id: cycle.id, name: cycle.name, description: cycle.description })),
    effects: activeCycles.flatMap((cycle) => (cycle.effects || []).map((effect) => ({ ...effect, sourceId: cycle.id, source: cycle.name }))),
    autoApplied: activeCycles.some((cycle) => (cycle.effects || []).some((effect) => effect.autoApply === true)),
  }
}

export function getAdvancedEsperCycles(selectedElementsFromTeam = [], cycles = ESPER_CYCLES) {
  return getActiveCycleList(selectedElementsFromTeam, cycles).filter((cycle) => cycle.kind === 'advanced')
}
