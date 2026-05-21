const SOURCE_STATUS = 'needs_verification'

export const mintSkillMaterials = {
  currency: 437000,
  items: [
    { name: 'FNG', amount: 10, sources: ['Skill Material Instance: Incantation', 'Event Shop'], sourceStatus: SOURCE_STATUS },
    { name: 'Fading Silhouette', amount: 10, sources: ['Monster Drop: Desert Ruins', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
    { name: 'CO', amount: 10, sources: ['Skill Material Instance: Incantation', 'Event Shop'], sourceStatus: SOURCE_STATUS },
    { name: 'Blurred Silhouette', amount: 10, sources: ['Monster Drop: Desert Ruins', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
    { name: 'Good Boy Stamp', amount: 8, sources: ['Store Front', 'Instance Drops', 'World Exploration'], sourceStatus: SOURCE_STATUS },
    { name: 'White Rose', amount: 16, sources: ['Skill Material Instance: Incantation', 'Event Shop'], sourceStatus: SOURCE_STATUS },
    { name: 'Chaos Silhouette', amount: 16, sources: ['Monster Drop: Desert Ruins', 'Simulation Center'], sourceStatus: SOURCE_STATUS },
  ],
}

const mintSourceNote = 'Source-pending XLSX import. Lv.1/Lv.40/Lv.80 stats are snapshots; no official scaling formula is claimed.'

export const mintDetail = {
  rarity: 'A',
  element: 'anima',
  arcType: 'liquid',
  faction: 'Bureau of Anomaly Control, CSU-2',
  birthday: 'June 1',
  roles: ['Damage', 'Main DPS'],
  tags: ['Main DPS', 'Damage'],
  sourceStatus: SOURCE_STATUS,
  detailReady: true,
  shortDescription: 'Anima / Liquid main DPS with a simple close-range kit.',
  profileText: "If there was such a ranking, I'd probably hold the record for Most Times Tricked by Anomalies in the Containment Units.",
  levelStats: {
    mode: 'base',
    minLevel: 1,
    maxLevel: 80,
    keyframes: [
      { level: 1, hp: 1000, atk: 75, def: 60, critRate: 5, critDmg: 50, sourceStatus: SOURCE_STATUS },
      { level: 40, hp: 4120, atk: 221, def: 247, critRate: 5, critDmg: 50, sourceStatus: SOURCE_STATUS },
      { level: 80, hp: 7320, atk: 371, def: 439, critRate: 5, critDmg: 50, sourceStatus: SOURCE_STATUS },
    ],
    note: mintSourceNote,
  },
  stats: {
    hp: '7,320',
    atk: '371',
    def: '439',
    critRate: '5%',
    critDmg: '50%',
  },
  overview: {
    blocks: [
      {
        id: 'mint-at-a-glance',
        type: 'text',
        title: 'At a glance',
        enabled: true,
        content:
          'Mint is an A-Rank Anima / Liquid Damage character and beginner-friendly Main DPS.',
      },
      {
        id: 'mint-gameplay',
        type: 'text',
        title: 'Gameplay identity',
        enabled: true,
        content:
          'Simple on-field close-range DPS focused on Perfect Containment, Super Claws, tornado-style Anima damage, durability, and Cycle Rate utility.',
      },
      {
        id: 'mint-strengths',
        type: 'list',
        title: 'Strengths',
        enabled: true,
        items: [
          'Free / starter-friendly character in the source notes.',
          'Easy to learn and durable for close-range play.',
          'Can build cycle rate by using skills.',
        ],
      },
      {
        id: 'mint-tradeoffs',
        type: 'list',
        title: 'Tradeoffs',
        enabled: true,
        items: [
          'Kit is described as basic.',
          'Source notes say she wants A1 to function properly.',
          'Several Cycle Rate / Cycle Energy labels are not used in calculator formulas yet.',
        ],
      },
      {
        id: 'mint-source-conflicts',
        type: 'list',
        title: 'Source/conflict notes',
        enabled: false,
        items: [
          'Earlier JP voice actor notes conflict with the newer profile screenshot; Akari Kito is stored as source-pending.',
          'Perfect Containment Lv.1 first ratio uses the screenshot value 10.4% + 23.1%, with the older 30.4% reading preserved as a conflict.',
          'Thunderous Whirlwind Slash cooldown has 25s / 15s conflict notes; it is not used in formulas.',
          'Some team member IDs are not confirmed from icons, so only safe names/roles were applied.',
        ],
      },
    ],
    updateTracker: {
      lastReviewUpdate: 'Patch 1.0',
      lastMajorBuildUpdate: 'Patch 1.0',
      lastProfileUpdate: 'May 12th, 2026',
    },
    videoGuide: {
      available: true,
      text: 'Source screenshot shows a Mint guide thumbnail. Link not imported yet.',
    },
  },
  voiceActors: [
    { lang: 'ENG', name: 'Brianna Knickerbocker' },
    { lang: 'JPN', name: 'Akari Kito' },
    { lang: 'CN', name: 'Chen Yu' },
    { lang: 'KR', name: 'Seong Ye-won' },
  ],
  trait: {
    available: true,
    text: 'Esper ability listed as Meow-chhi! in the source profile; exact localization remains source-pending.',
  },
  consoleTrait: {
    title: 'Type III Specialization',
    trigger: 'Each Type III module equipped',
    effect: 'Increases CRIT Rate by 8% for each Type III Module equipped.',
    statId: 'crit_rate',
    valuePerModule: 8,
    moduleType: 'III',
    sourceStatus: SOURCE_STATUS,
  },
  buildTraits: [
    {
      id: 'mint-type-iii-specialization',
      title: 'Type III Specialization',
      trigger: 'module_type_count',
      moduleType: 'III',
      stat: 'critRate',
      operation: 'add',
      valuePerModule: 8,
      valueType: 'percent',
      maxStacks: null,
      description: 'Console trait: CRIT Rate +8% for each Type III module equipped.',
      sourceStatus: SOURCE_STATUS,
    },
  ],
  skills: [
    {
      id: 'perfect-containment',
      name: 'Perfect Containment',
      type: 'Basic Attack',
      icon: 'BA',
      description: [
        { title: 'Perfect Containment', text: 'Wields her weapon and performs up to 5 consecutive attacks, dealing Anima DMG.' },
        { title: 'Justice from Above', text: 'Plunges from the air, dealing 1 instance of Anima DMG to an area. Damage increases based on fall height, up to 200%.' },
        { title: 'Caramel Crisp', text: "Triggers after using Perfect Containment after a Critical Dodge. Leaps up to dodge an attack, swings her weapon, deals 1 Anima AoE instance, and reduces Break." },
        { title: 'Minty Whirlwind', text: 'Hold Basic Attack to make Mint spin into a tornado, continuously draining Stamina and dealing continuous Anima DMG to surrounding enemies.' },
      ],
      attributes: [
        {
          level: 1,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: '1st Instance Ratio', value: '10.4% + 23.1%' },
            { label: '2nd Instance Ratio', value: '17%' },
            { label: '3rd Instance Ratio', value: '26.2% + 34.1%' },
            { label: '4th Instance Ratio', value: '18.4%' },
            { label: '5th Instance Ratio', value: '25.5% + 52.3%' },
            { label: 'Plunge DMG Ratio', value: '65%' },
            { label: 'Cycle Rate', value: '33' },
            { label: 'Critical Riposte Ratio', value: '174%' },
            { label: 'Hold Basic Attack DMG Ratio Each Instance', value: '13.3%' },
            { label: 'Hold Duration', value: '6s' },
          ],
        },
        {
          level: 10,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: '1st Instance Ratio', value: '20% + 46%' },
            { label: '2nd Instance Ratio', value: '34%' },
            { label: '3rd Instance Ratio', value: '52% + 68%' },
            { label: '4th Instance Ratio', value: '36%' },
            { label: '5th Instance Ratio', value: '51% + 104%' },
            { label: 'Cycle Energy', value: '19' },
            { label: 'Critical Riposte Ratio', value: '347%' },
          ],
        },
      ],
      materials: mintSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'ultimate-super-claws',
      name: 'Ultimate: Super Claws',
      type: 'Redirect Skill / Skill',
      icon: 'SK',
      description: [
        { title: 'Ultimate: Super Claws', text: 'Dashes forward, then returns to the original position, dealing 2 instances of AoE Anima DMG to enemies along the path.' },
      ],
      attributes: [
        { level: 1, sourceStatus: SOURCE_STATUS, values: [{ label: 'DMG Ratio', value: '90% x 2' }, { label: 'CD', value: '6s' }, { label: 'Cycle Rate', value: '7' }] },
        { level: 10, sourceStatus: SOURCE_STATUS, values: [{ label: 'DMG Ratio', value: '179% x 2' }, { label: 'CD', value: '6s' }, { label: 'Cycle Energy', value: '8' }] },
      ],
      materials: mintSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'ultimate-thunderous-whirlwind-slash',
      name: 'Ultimate: Thunderous Whirlwind Slash',
      type: 'Ultimate',
      icon: 'ULT',
      description: [
        { title: 'Ultimate: Thunderous Whirlwind Slash', text: 'Channels surrounding wind into dual blades, dealing multiple instances of Anima DMG to an area, then lands a final massive Anima AoE hit.' },
      ],
      attributes: [
        {
          level: 1,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: 'Impact DMG Ratio', value: '132.6%' },
            { label: 'Claw Combo Ratio', value: '58.8% x 5' },
            { label: 'Slash Ratio', value: '373.5%' },
            { label: 'CD', value: '25s / possible 15s conflict' },
            { label: 'Ultimate Energy', value: '100' },
          ],
        },
        {
          level: 10,
          sourceStatus: SOURCE_STATUS,
          values: [
            { label: 'Impact/Strike DMG Ratio', value: '265%' },
            { label: 'Claw Combo Ratio', value: '117% x 5' },
            { label: 'Slash Ratio', value: '746%' },
            { label: 'CD', value: '15s' },
            { label: 'Ultimate Energy', value: '100' },
          ],
        },
      ],
      materials: mintSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'ultimate-invincible-tornado-slash',
      name: 'Ultimate: Invincible Tornado Slash',
      type: 'Support Skill',
      icon: 'SUP',
      description: [
        { title: 'Ultimate: Invincible Tornado Slash', text: 'Charges or leaps into the air and performs a penetrating attack on enemies, dealing 1 instance of Anima DMG in an area.' },
      ],
      attributes: [
        { level: 1, sourceStatus: SOURCE_STATUS, values: [{ label: 'DMG Ratio', value: '200%' }] },
        { level: 10, sourceStatus: SOURCE_STATUS, values: [{ label: 'DMG Ratio', value: '399%' }] },
      ],
      materials: mintSkillMaterials,
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'transform-super-mint',
      name: 'Transform! Super Mint!',
      type: 'Passive Skill',
      icon: 'P1',
      description: [{ title: 'Passive', text: 'Blossom/Life Pistil enhancement: expands the AoE of Life Pistil impact damage.' }],
      sourceStatus: SOURCE_STATUS,
    },
    {
      id: 'bingo-were-done-here',
      name: "Bingo! We're Done Here!",
      type: 'Passive Skill',
      icon: 'P2',
      description: [{ title: 'Passive', text: 'While Mint is on field, DEF increases by 20% and interruption resistance increases by 30%.' }],
      sourceStatus: SOURCE_STATUS,
    },
  ],
  awakenings: [
    { id: 'mint-a1', level: 'A1', name: 'Task Force Operation', effect: 'Resets the cooldown of Ultimate/Super Claws when Caramel Crisp hits an enemy. Triggers once every 3s.', sourceStatus: SOURCE_STATUS },
    { id: 'mint-a2', level: 'A2', name: 'Re-examination', effect: 'Redirect Skill / Ultimate: Super Claws damage increases by 40%.', sourceStatus: SOURCE_STATUS },
    { id: 'mint-a3', level: 'A3', name: 'Attendance Bonus', effect: "When any character triggers Blossom or Hexed near an enemy, Mint's ATK increases by 15% for 15s.", sourceStatus: SOURCE_STATUS },
    { id: 'mint-a4', level: 'A4', name: 'Lunch Break', effect: "When Mint deals damage to the last enemy on the field, Mint's Crit Chance increases by 12%.", sourceStatus: SOURCE_STATUS },
    { id: 'mint-a5', level: 'A5', name: 'First Instinct', effect: "After using Redirect Skill / Ultimate: Super Claws, Mint's Crit DMG increases by 25% for 6s.", sourceStatus: SOURCE_STATUS },
    { id: 'mint-a6', level: 'A6', name: 'Elite Member', effect: "Mint's damage against enemies whose HP is below 40% increases by 15%.", sourceStatus: SOURCE_STATUS },
    { id: 'mint-r1', level: 'R1', name: 'Minty Bubble Tea', effect: 'Increases the skill level of Perfect Containment, Ultimate: Super Claws, and Ultimate: Thunderous Whirlwind Slash by 1.', sourceStatus: SOURCE_STATUS },
    { id: 'mint-r2', level: 'R2', name: 'Fluffy Mousse', effect: 'Grants an additional 2 Cycle Rate after successfully casting Ultimate: Super Claws.', sourceStatus: SOURCE_STATUS },
  ],
  lifeSkills: [
    {
      id: 'mint-tornado',
      name: 'Mint Tornado',
      effect: "Level 1: dish prices +0.12 Fons. Level 2: ingredient consumption -1%. Level 3: Owner's Selection tips increase with each combo, up to 5 times per combo. Level 4: ingredient consumption -1%. Level 5: dish prices +0.18 Fons.",
      sourceStatus: SOURCE_STATUS,
    },
  ],
  build: {
    recommendedWeapons: [
      { weaponId: 'fluff-of-fleetness', priority: 1, label: 'M5 listed', note: 'Source score 101.91%. Best listed weapon, source-pending.' },
      { weaponId: 'mind-royale', priority: 2, label: 'M5 listed', note: 'Source score 101.91%. Can improve if another Ultimate is gained in a fight.' },
      { weaponId: 'shiny-days', priority: 3, label: 'M5 listed', note: 'Source score 97.83%. Break and damage vs broken targets.' },
      { weaponId: 'clear-skies', priority: 4, label: 'M5 listed', note: 'Source score 95.87%. Anima DMG boost option.' },
    ],
    recommendedCartridges: [
      { cartridgeId: 'fireflies-and-the-forest', rarity: 'S', priority: 1, label: 'Best in Slot', note: 'Source score 100%. Anima DMG and CRIT DMG stacking option.' },
      { cartridgeId: 'shadow-creed', rarity: 'S', priority: 2, label: 'Alternative', note: 'Source score 96.25%. Secondary if crit substats are strong.' },
    ],
    mainStats: [
      { statId: 'anima_dmg_bonus', priority: 1 },
      { statId: 'crit_rate', priority: 2 },
      { statId: 'crit_dmg', priority: 3 },
      { statId: 'atk_percent', priority: 4 },
    ],
    subStats: [
      { statId: 'crit_rate', priority: 1 },
      { statId: 'crit_dmg', priority: 2 },
      { statId: 'atk_percent', priority: 3 },
      { statId: 'dmg_bonus', priority: 4 },
      { statId: 'atk', priority: 5 },
    ],
    endgameStats: [
      { statId: 'hp', targetValue: '17,000+' },
      { statId: 'atk', targetValue: '2,000+' },
      { statId: 'crit_rate', targetValue: '60%+' },
      { statId: 'crit_dmg', targetValue: '100%+ before 56% cartridge set bonus' },
      { statId: 'dmg_bonus', targetValue: '10%+' },
      { statId: 'anima_dmg_bonus', targetValue: '47.5%+' },
    ],
    skillPriority: ['Basic = Skill', 'Ult', 'Support', 'Passive 2', 'Passive 1'],
    notes: [
      { id: 'mint-rating', title: 'Damage rating', content: 'Source sheet lists T2 Endgame PVE.' },
      { id: 'mint-source-note', title: 'Source status', content: 'All imported build values remain source-pending until manually verified.' },
    ],
  },
  consoleSetup: {
    title: 'Type III Specialization',
    description: 'Increases CRIT Rate by 8% for each Type III Module equipped.',
    mainCartridgeId: 'fireflies-and-the-forest',
    mainCartridge: 'Fireflies and the Forest',
    rarityPriority: ['S', 'A', 'B'],
    rarityNote: 'Visual placement colors are presentation-only. They are not game rarity and are not used as Build Planner stat sources.',
    cartridgeEffects: [
      '(2) Anima DMG +10%',
      "(4) Increases wearer's CRIT DMG by 8% when a nearby enemy takes Anima DMG from the team, up to 7 stacks. Each stack lasts 10s. Effect remains active when the character is off-field.",
    ],
    requiredPieces: [
      { id: 'mint-piece-a', label: 'Type III module', type: 'III', shapeKey: 'type-iii-line-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-cyan', visualGroup: 'group-cyan' },
      { id: 'mint-piece-b', label: 'Type III module', type: 'III', shapeKey: 'type-iii-l-bottom-left', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-pink', visualGroup: 'group-pink' },
    ],
    notes: [
      'Exact grid placement was not forced; final placement can be adjusted manually in local development tooling.',
      'Use Type III modules to scale the source-pending CRIT Rate console trait.',
    ],
  },
  materials: {
    title: 'Mint Materials',
    notes: mintSourceNote,
    currencyCost: 525000,
    ascensionMaterials: [
      { name: 'Required currency', amount: 525000, sourceStatus: SOURCE_STATUS },
      { name: 'Unknown black/purple material', amount: 86, sourceStatus: SOURCE_STATUS, note: 'Icon/name not readable; do not invent item id.' },
      { name: 'Chaos Silhouette', amount: 15, sourceStatus: SOURCE_STATUS },
      { name: 'Blurred Silhouette', amount: 18, sourceStatus: SOURCE_STATUS },
      { name: 'Fading Silhouette', amount: 17, sourceStatus: SOURCE_STATUS },
    ],
    ascensionTotals: [
      {
        id: 'mint-lv40',
        title: 'Lv.40 breakthrough snapshot',
        items: [
          { name: 'Required currency', amount: 150000, sourceStatus: SOURCE_STATUS },
          { name: 'Unknown black/purple material', amount: 10, sourceStatus: SOURCE_STATUS, note: 'Icon/name not readable.' },
          { name: 'Blurred Silhouette', amount: 6, sourceStatus: SOURCE_STATUS },
          { name: 'Fading Silhouette', amount: 17, sourceStatus: SOURCE_STATUS },
        ],
      },
    ],
    skillMaterials: mintSkillMaterials.items,
    lifeSkillMaterials: [
      {
        level: 'Life Skill',
        items: [
          { name: 'Yellow ticket/material', amount: 22000, sourceStatus: SOURCE_STATUS, note: 'Exact item name not visible.' },
          { name: 'Blue/purple round item', amount: 56, sourceStatus: SOURCE_STATUS, note: 'Exact item name not visible.' },
        ],
      },
    ],
  },
  synergies: [
    { name: 'Esper Cycle character', role: 'Cycle support', notes: ['Exact character name from icon not confirmed; do not assign a DB id yet.'], sourceStatus: SOURCE_STATUS },
    { name: 'Off-field buffer/DPS', role: 'Off-field support', notes: ['Exact character name from icon not confirmed.'], sourceStatus: SOURCE_STATUS },
    { name: 'Gather/AoE support', role: 'AoE support', notes: ['Exact character name from icon not confirmed.'], sourceStatus: SOURCE_STATUS },
    { name: 'Attack/DEF shred support', role: 'Buff / shred support', notes: ['Exact character name from icon not confirmed.'], sourceStatus: SOURCE_STATUS },
    { characterId: 'skia', name: 'Skia', role: 'Dual DPS / Charge', notes: ['Named in source as a possible dual DPS composition partner.'], sourceStatus: SOURCE_STATUS },
  ],
  teams: [
    {
      id: 'mint-blossom',
      name: 'Blossom Team',
      tag: 'Planned',
      type: 'Blossom',
      members: [
        { characterId: 'mint', slot: 'Main DPS', note: 'Primary on-field DPS.' },
        { characterId: 'hanizel', name: 'Haniel', slot: 'Off-field support', note: 'Source text references off-field AoE with Haniel and Blossom.' },
        { characterId: 'edgar', slot: 'Reaction / flex', note: 'Switch into Edgar for reaction and back out unless healing is needed.' },
      ],
      description: 'Team concept focused on off-field AoE and Blossom while Mint remains the main on-field DPS.',
    },
    {
      id: 'mint-hypercarry',
      name: 'Mint Hypercarry Team',
      tag: 'Planned',
      type: 'Hypercarry',
      members: [
        { characterId: 'mint', slot: 'Main DPS', note: 'Primary on-field DPS.' },
        { characterId: 'sakiri', slot: 'Crowd control / Hex support', note: 'Named in source text as a possible teammate.' },
        { characterId: 'jiuyuan', slot: 'Crowd control / AoE support', note: 'Named in source text as a possible teammate.' },
      ],
      description: 'AoE team concept using Blossom extra damage and Hex damage windows.',
    },
  ],
}
