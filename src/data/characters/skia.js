const SOURCE_STATUS = 'needs_verification'

export const skiaSkillMaterials = {
  currency: 437000,
  items: [
    { name: 'Synchronicity of Thought', amount: 10, sources: ['Skill Material Instance: Lakshana', 'Event Shop'], sourceStatus: SOURCE_STATUS },
    { name: 'Suspended Delusions', amount: 10, sources: ['Monster Drop: Mountain Peaks', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
    { name: 'Resonance of Faith', amount: 10, sources: ['Skill Material Instance: Lakshana', 'Event Shop'], sourceStatus: SOURCE_STATUS },
    { name: 'Yearning Delusions', amount: 10, sources: ['Monster Drop: Mountain Peaks', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
    { name: 'Dress Sleeves of Vanity', amount: 8, sources: ['Store Front', 'Instance Drops', 'World Exploration'], sourceStatus: SOURCE_STATUS },
    { name: 'Heart-Racing Night', amount: 16, sources: ['Skill Material Instance: Lakshana', 'Event Shop'], sourceStatus: SOURCE_STATUS },
    { name: 'Transcendent Delusions', amount: 16, sources: ['Monster Drop: Mountain Peaks', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
  ],
}

const skiaSourceNote = 'Source-pending XLSX import. Lv.1/Lv.40/Lv.80 stats are snapshots; no official scaling formula is claimed.'

export const skiaDetail = {
  rarity: 'A',
  element: 'lakshana',
  arcType: 'plasma',
  faction: 'Bureau of Anomaly Control - ETD-4',
  birthday: 'January 10',
  roles: ['Damage', 'Main DPS'],
  tags: ['Main DPS', 'Damage'],
  sourceStatus: SOURCE_STATUS,
  detailReady: true,
  shortDescription: 'Source-pending Lakshana main DPS who ramps damage through Fang Thrust setup.',
  profileText: "Often mistaken for Squad 4's captain, despite being the lieutenant.",
  levelStats: {
    mode: 'base',
    minLevel: 1,
    maxLevel: 80,
    keyframes: [
      { level: 1, hp: 1100, atk: 70, def: 55, critRate: 5, critDmg: 50, sourceStatus: SOURCE_STATUS },
      { level: 40, hp: 4532, atk: 207, def: 227, critRate: 5, critDmg: 50, sourceStatus: SOURCE_STATUS },
      { level: 80, hp: 8052, atk: 347, def: 403, critRate: 5, critDmg: 50, sourceStatus: SOURCE_STATUS },
    ],
    note: skiaSourceNote,
  },
  stats: {
    hp: '8,052',
    atk: '347',
    def: '403',
    critRate: '5%',
    critDmg: '50%',
  },
  overview: {
    blocks: [
      {
        id: 'skia-at-a-glance',
        type: 'text',
        title: 'At a glance',
        enabled: true,
        content:
          'Skia is imported as source-pending structured data. The sheet describes her as a Lakshana Damage / Main DPS character who builds pressure through Fang Thrust.',
      },
      {
        id: 'skia-gameplay',
        type: 'text',
        title: 'Gameplay identity',
        enabled: true,
        content:
          'Applies Fang Thrust through Basic Attacks and Shadow Hound Chase, then ramps personal damage after setup. The source notes Remora/Stain synergy, but exact team labels still need verification.',
      },
      {
        id: 'skia-strengths',
        type: 'list',
        title: 'Strengths',
        enabled: true,
        items: [
          'Fang Thrust stacks can ramp damage after setup.',
          'Can pressure groups while moving through shadow form.',
          'Has city/business life skill value from Middle Manager.',
        ],
      },
      {
        id: 'skia-tradeoffs',
        type: 'list',
        title: 'Tradeoffs',
        enabled: true,
        items: [
          'Damage can arrive after setup instead of instantly.',
          'Shadow movement is not treated as full invulnerability in the source notes.',
          'Several team and resistance-reduction details remain source-pending.',
        ],
      },
      {
        id: 'skia-source-conflicts',
        type: 'list',
        title: 'Source/conflict notes',
        enabled: true,
        items: [
          'The XLSX lists Arc type as Gas, but the existing site card used Plasma; Plasma was preserved as the current canonical value.',
          'Employee of the Month likely reduces Lakshana RES by 2% per Fang Thrust up to 6%, but the exact per-stack value still needs verification.',
          'Some team screenshots show icons without confirmed names, so only clearly named teams and synergies were applied.',
        ],
      },
    ],
    updateTracker: {
      lastReviewUpdate: 'Patch 1.0',
      lastMajorBuildUpdate: 'Patch 1.0',
      lastProfileUpdate: 'April 28th, 2026',
    },
    videoGuide: {
      available: false,
      text: 'Video guide not imported yet.',
    },
  },
  voiceActors: [
    { lang: 'ENG', name: 'Bill Butts' },
    { lang: 'JPN', name: 'Tomokazu Sugita' },
    { lang: 'CN', name: 'Liu Yuxuan' },
    { lang: 'KR', name: 'Lee Dong-hoon' },
  ],
  trait: {
    available: false,
    text: 'Trait unavailable in the source sheet.',
  },
  consoleTrait: {
    title: 'Type III Specialization',
    trigger: 'Each Type III module equipped',
    effect: 'Increases ATK by 10% for each Type III Module equipped.',
    statId: 'atk_percent',
    valuePerModule: 10,
    moduleType: 'III',
    sourceStatus: SOURCE_STATUS,
  },
  buildTraits: [
    {
      id: 'skia-type-iii-specialization',
      title: 'Type III Specialization',
      trigger: 'module_type_count',
      moduleType: 'III',
      stat: 'atkPercent',
      operation: 'add',
      valuePerModule: 10,
      valueType: 'percent',
      maxStacks: null,
      description: 'Source-pending console trait: ATK +10% for each Type III module equipped.',
      sourceStatus: SOURCE_STATUS,
    },
  ],
  gallery: {
    available: false,
    text: 'Skia images are not imported yet.',
  },
  skills: [
    {
      id: 'arresting-art',
      name: 'Arresting Art',
      type: 'Basic Attack',
      icon: 'BA',
      description: [
        {
          title: 'Basic Attack: Arresting Art',
          text:
            "Uses disciplined martial arts techniques to perform up to 5 consecutive attacks, dealing Lakshana DMG. With each hit, 1 Fang Thrust splits from Skia's shadow to pursue the target. Up to 3 Fang Thrusts can lock onto a single target.",
        },
        {
          title: 'Basic Attack / Plunge: Territory Control',
          text: 'Engages targets in mid-air before plunging, dealing 1 instance of Lakshana DMG to an area. Damage increases based on fall height, up to 200%.',
        },
        {
          title: 'Fang Thrust',
          text: 'Fragmented shadows resembling beast fangs automatically track and attack targets, disappearing after dealing 1 instance of Lakshana DMG.',
        },
        {
          title: 'Critical Riposte: Pen to Paper',
          text: 'Triggers after using Arresting Art after a Critical Dodge. Strikes enemies with ink-splash-like shadows, dealing 1 instance of Lakshana DMG to an area and reducing Break.',
        },
      ],
      attributes: [
        {
          level: 1,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: 'Attack chain', value: 'Up to 5 attacks' },
            { label: 'Fang Thrust lock-on', value: 'Max 3 per target' },
            { label: 'Plunge scaling', value: 'Up to 200%' },
          ],
        },
      ],
      materials: skiaSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'shadow-hound-chase',
      name: 'Shadow Hound Chase',
      type: 'Skill / Redirect Skill',
      icon: 'SK',
      description: [
        {
          title: 'Shadow Hound Chase',
          text:
            "Enters Tailed state, leaps into Skia's own shadow, and deals 6 instances of Lakshana DMG to the surrounding area. For each target hit, 3 Fang Thrusts split from Skia's shadow to pursue the target.",
        },
        {
          title: 'Shadow Hound Gnaw',
          text: 'Allows movement on ground and wall surfaces, remains undetected, and grants immunity to some attacks, but cancels when hit by ground damage.',
        },
      ],
      attributes: [
        {
          level: 1,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: 'Damage instances', value: '6' },
            { label: 'Fang Thrusts per hit target', value: '3' },
          ],
        },
      ],
      materials: skiaSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'the-pack',
      name: 'The Pack',
      type: 'Ultimate',
      icon: 'ULT',
      description: [
        {
          title: 'The Pack',
          text:
            'Throws a spinning lighter, spreading shadow in all directions. Deals 1 instance of Lakshana DMG to an area, then converges shadows on a single point for 3 additional Lakshana AoE instances. Increases Fang Thrust damage after casting.',
        },
      ],
      attributes: [
        {
          level: 1,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: 'Initial hit', value: '1 AoE instance' },
            { label: 'Follow-up hits', value: '3 AoE instances' },
            { label: 'Ultimate Energy', value: '100' },
          ],
        },
      ],
      materials: skiaSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'arrest-warrant',
      name: 'Arrest Warrant',
      type: 'Support Skill',
      icon: 'SUP',
      description: [
        {
          title: 'Arrest Warrant',
          text: 'Commands shadow like a police canine to lunge and bite the target with ferocity, dealing 1 instance of Lakshana DMG to an area.',
        },
      ],
      attributes: [
        { level: 1, sourceStatus: SOURCE_STATUS, values: [{ label: 'Damage', value: '1 Lakshana AoE instance' }] },
      ],
      materials: skiaSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
  ],
  awakenings: [
    { id: 'skia-a1', level: 'A1', name: 'Process of Elimination', effect: 'Increases the auto-attack DMG Ratio for Fang Thrust by 60%.', sourceStatus: SOURCE_STATUS },
    { id: 'skia-a2', level: 'A2', name: 'Law and Order', effect: "Increases Skia's Crit Chance by 10% and Resistance to Interruptions by 50% for 15s after casting Shadow Hound Chase.", sourceStatus: SOURCE_STATUS },
    { id: 'skia-a3', level: 'A3', name: 'Solution', effect: "Skia's damage to targets locked by Fang Thrust is increased by 4%. If only one target is locked by Fang Thrust on the field, damage to it is further increased by 4%.", sourceStatus: SOURCE_STATUS },
    { id: 'skia-a4', level: 'A4', name: 'Resolution', effect: 'Extends Tailed duration to 12s. Increases Attachment DMG by 2% per second a target is attached, up to 40%.', sourceStatus: SOURCE_STATUS },
    { id: 'skia-a5', level: 'A5', name: 'Social Contract', effect: "Increases the target's mass by 50 and reduces Movement Speed by 20% for each Fang Thrust locked onto it.", sourceStatus: SOURCE_STATUS },
    { id: 'skia-a6', level: 'A6', name: 'Unbothered Appearance', effect: 'Increases Extra DMG Ratio of Fang Thrust by 20% while in Shadow Hound Gnaw mode when touching an enemy locked by Fang Thrust.', sourceStatus: SOURCE_STATUS },
    { id: 'skia-r1', level: 'R1', name: 'Cubical Survival Manual', effect: 'Increases the skill level of Arresting Art, Shadow Hound Chase, and The Pack by 1.', sourceStatus: SOURCE_STATUS },
    { id: 'skia-r2', level: 'R2', name: 'Employee of the Month', effect: "Reduces locked-on target's Lakshana RES per Fang Thrust, up to 6%. Exact per-stack value needs verification.", sourceStatus: SOURCE_STATUS },
  ],
  lifeSkills: [
    {
      id: 'middle-manager',
      name: 'Middle Manager',
      effect: "Level 1: traffic +18. Level 2: ingredient consumption -1%. Level 3: Owner's Selection customer patience +50%. Level 4: ingredient consumption -1%. Level 5: traffic +27.",
      sourceStatus: SOURCE_STATUS,
    },
  ],
  build: {
    recommendedWeapons: [
      {
        weaponId: 'watch-your-heads',
        priority: 1,
        label: 'Best listed',
        note: 'Source-pending A-rank weapon recommendation. Sheet lists Base ATK 475 and CRIT DMG 40%.',
      },
    ],
    recommendedCartridges: [
      { cartridgeId: 'street-boxer', rarity: 'S', priority: 1, label: 'Best in Slot', note: 'Lakshana DMG set. 4pc CRIT Rate wording remains source-pending.' },
      { cartridgeId: 'shadow-creed', rarity: 'S', priority: 2, label: 'Alternative', note: 'Secondary option when crit substats are strong.' },
    ],
    mainStats: [
      { statId: 'lakshana_dmg_bonus', priority: 1 },
      { statId: 'crit_dmg', priority: 2 },
      { statId: 'crit_rate', priority: 3 },
      { statId: 'atk_percent', priority: 4 },
    ],
    subStats: [
      { statId: 'crit_rate', priority: 1 },
      { statId: 'crit_dmg', priority: 2 },
      { statId: 'dmg_bonus', priority: 3 },
      { statId: 'atk_percent', priority: 4 },
      { statId: 'atk', priority: 5 },
    ],
    endgameStats: [
      { statId: 'hp', targetValue: '18,000+' },
      { statId: 'atk', targetValue: '2000+' },
      { statId: 'def', targetValue: '1200+' },
      { statId: 'crit_rate', targetValue: '30%+ before A2/Street Boxer' },
      { statId: 'crit_dmg', targetValue: '135%+' },
      { statId: 'dmg_bonus', targetValue: '15%+' },
      { statId: 'lakshana_dmg_bonus', targetValue: '37.5%+' },
    ],
    skillPriority: ['Ultimate', 'Passive 2', 'Passive 1', 'Skill', 'Basic', 'Support Skill'],
    notes: [
      { id: 'skia-rating', title: 'Damage rating', content: 'Source sheet lists T2 Endgame PVE.' },
      { id: 'skia-source-note', title: 'Source status', content: 'All imported build values remain source-pending until manually verified.' },
    ],
  },
  consoleSetup: {
    title: 'Type III Specialization',
    description: 'Increases ATK by 10% for each Type III Module equipped.',
    mainCartridgeId: 'street-boxer',
    mainCartridge: 'Street Boxer',
    rarityPriority: ['S', 'A', 'B'],
    rarityNote: 'Visual placement colors are presentation-only. They are not game rarity and are not used as Build Planner stat sources.',
    cartridgeEffects: ['(2) Lakshana DMG +10%', '(4) CRIT Rate +14%; can reach 28% for 20s when team triggers Remora or Stain. Exact wording needs verification.'],
    requiredPieces: [
      { id: 'skia-piece-a', label: 'Type III module', type: 'III', shapeKey: 'type-iii-line-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-amber', visualGroup: 'group-amber' },
      { id: 'skia-piece-b', label: 'Type III module', type: 'III', shapeKey: 'type-iii-l-bottom-left', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-blue', visualGroup: 'group-blue' },
    ],
    notes: [
      'Exact grid placement was not forced; the workbook says screenshots show a recommended pattern that should be configured manually.',
      'Use Type III modules to scale the source-pending ATK console trait.',
    ],
  },
  materials: {
    title: 'Skia Materials',
    notes: skiaSourceNote,
    currencyCost: 525000,
    ascensionMaterials: [
      { name: 'Required currency', amount: 525000, sourceStatus: SOURCE_STATUS },
      { name: 'Suspended Delusions', amount: 17, sources: ['Monster Drop: Mountain Peaks', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
      { name: 'Confessional Flower Seed', amount: 86, sources: ['World Boss: Aridus Colossus'], sourceStatus: SOURCE_STATUS },
      { name: 'Yearning Delusions', amount: 18, sources: ['Monster Drop: Mountain Peaks', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
      { name: 'Transcendent Delusions', amount: 15, sources: ['Monster Drop: Mountain Peaks', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
    ],
    skillMaterials: skiaSkillMaterials.items,
  },
  synergies: [
    { characterId: 'zero-female', name: 'Esper Zero', role: 'Esper Cycle / support', notes: ['Can help with Remora/Esper Cycle support. Source label needs verification.'], sourceStatus: SOURCE_STATUS },
    { characterId: 'hanizel', name: 'Haniel', role: 'Off-field damage / buffs', notes: ['Named in source teams as off-field damage and buff support.'], sourceStatus: SOURCE_STATUS },
    { characterId: 'hathor', name: 'Hathor', role: 'Remora/Stain support', notes: ['Supports Remora/Stain setup and crit/buff windows. Exact source wording needs verification.'], sourceStatus: SOURCE_STATUS },
  ],
  teams: [
    {
      id: 'skia-remora-stain',
      name: 'Skia Remora/Stain Team',
      tag: 'Source pending',
      type: 'Remora/Stain',
      members: [
        { characterId: 'skia', slot: 'Main DPS', note: 'Primary Fang Thrust damage dealer.' },
        { characterId: 'zero-female', name: 'Esper Zero', slot: 'Cycle support', note: 'Source-pending support slot.' },
        { characterId: 'hathor', slot: 'Remora/Stain support', note: 'Supports reaction setup.' },
        { characterId: 'hanizel', name: 'Haniel', slot: 'Off-field support', note: 'Buff and off-field support.' },
      ],
      description: "Source-pending team that supports Skia's personal damage and Remora/Stain triggers.",
    },
  ],
}
