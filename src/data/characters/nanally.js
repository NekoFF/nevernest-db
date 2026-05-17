import { T } from './helpers.js'

export const nanallySkillMaterials = {
  currency: 437000,
  items: [
    {
      name: 'FNG',
      amount: 10,
      sources: ['Skill Material Instance: Incantation', 'Event Shop'],
    },
    {
      name: 'Fading Silhouette',
      amount: 10,
      sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'],
    },
    {
      name: 'CO',
      amount: 10,
      sources: ['Skill Material Instance: Incantation', 'Event Shop'],
    },
    {
      name: 'Blurred Silhouette',
      amount: 10,
      sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'],
    },
    {
      name: 'Good Boy Stamp',
      amount: 8,
      sources: ['Store Front', 'Instance Drops', 'World Exploration'],
    },
    {
      name: 'White Rose',
      amount: 16,
      sources: ['Skill Material Instance: Incantation', 'Event Shop'],
    },
    {
      name: 'Chaos Silhouette',
      amount: 16,
      sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'],
    },
  ],
}

export const nanallyDetail = {
  rarity: 'S',
  element: 'anima',
  arcType: 'plasma',
  faction: 'Elbon Antique Shop',
  birthday: 'August 20',
  roles: ['Damage', 'Main DPS', 'Follow-up Attack'],
  tags: ['Main DPS', 'Damage', 'Follow-up Attack'],
  shortDescription: "The Ichi-daime of the Coluccis - currently seeking new recruits!",
  profileText: "The Ichi-daime of the Coluccis - currently seeking new recruits!",
  levelStats: {
    mode: 'base',
    minLevel: 1,
    maxLevel: 80,
    keyframes: [
      { level: 1, hp: 1320, atk: 80, def: 75, critRate: 5, critDmg: 50 },
      { level: 45, hp: 9134, atk: 376, def: 519, critRate: 5, critDmg: 50 },
      { level: 80, hp: 15998, atk: 636, def: 909, critRate: 5, critDmg: 50 },
    ],
    note: 'Stats are interpolated between verified level checkpoints. Lv.90 data may be affected by a bug or external modifier and is not used yet.',
  },
  stats: {
    hp: '15,998',
    atk: '636',
    def: '909',
    critRate: '5%',
    critDmg: '50%',
  },
  overview: {
    blocks: [
      {
        id: "at-a-glance",
        type: "text",
        title: "At a glance",
        enabled: true,
        content: "The Ichi-daime of the Coluccis — currently seeking new recruits!"
      },
      {
        id: "strengths",
        type: "list",
        title: "Strengths",
        enabled: true,
        items: [
          "Strong follow-up attack damage once Ichi-daime's Authority and Underboss are active.",
          "Straightforward rotation that is easy to understand.",
          "Useful exploration utility through wall-walking.",
          "Can boost Blossom output through her passive."
        ]
      },
      {
        id: "tradeoffs",
        type: "list",
        title: "Tradeoffs",
        enabled: true,
        items: [
          "Wants uninterrupted field time.",
          "Loses a significant part of her burst window if forced off-field.",
          "Ichi-daime's Authority does not persist after switching out."
        ]
      },
      {
        id: "recommended-playstyle",
        type: "text",
        title: "Recommended playstyle",
        enabled: true,
        content: "Use Skill to enter Ichi-daime's Authority, then use Ultimate to summon Underboss. Stay on-field and use normal attacks to trigger follow-up damage."
      }
    ],
    updateTracker: {
      lastReviewUpdate: 'Patch 1.0',
      lastMajorBuildUpdate: 'Patch 1.0',
      lastProfileUpdate: 'May 3rd, 2026',
    },
    videoGuide: {
      available: true,
      text: 'Nanally has at least one video guide available. Video guide links can be added later.',
    },
  },
  voiceActors: [
    { lang: 'ENG', name: 'Brittany Lauda' },
    { lang: 'JPN', name: '竹達彩奈' },
    { lang: 'CN', name: '宋媛媛' },
    { lang: 'KR', name: '강새봄' },
  ],
  trait: {
    available: false,
    text: "Nanally Traits aren't available. The character either doesn't have a Trait or the data needs to be added.",
  },
  consoleTrait: {
    title: 'Type II Specialization',
    trigger: 'Each Type II module equipped',
    effect: 'Increases CRIT Rate by 6% for each Type II Module equipped.',
    statId: 'crit_rate',
    valuePerModule: 6,
    moduleType: 'II',
  },
  buildTraits: [
    {
      id: 'nanally-type-ii-specialization',
      title: 'Type II Specialization',
      trigger: 'module_type_count',
      moduleType: 'II',
      stat: 'critRate',
      operation: 'add',
      valuePerModule: 6,
      valueType: 'percent',
      maxStacks: null,
      description: 'Increases CRIT Rate by 6% for each Type II Module equipped.',
    },
  ],
  gallery: {
    available: false,
    text: "Nanally images aren't available yet. They will be added soon.",
  },
  skills: [
    {
      id: 'colucci-secret-skill',
      name: 'Colucci Secret Skill',
      type: 'Basic Attack',
      icon: 'BA',
      description: [
        {
          title: 'Basic Attack: Colucci Secret Skill',
          text: 'Bares her fangs and brandishes her claws, performing up to 5 consecutive attacks, dealing Anima DMG. Dodging does not interrupt the combo.',
        },
        {
          title: 'Basic Attack: Heavy Hitter!',
          text: 'Triggers by holding Basic Attack. Performs up to 3 powerful attacks, dealing Anima DMG. Chains after Critical Riposte and the 1st, 2nd, 3rd, and 4th attacks of Colucci Secret Skill. Dodging does not interrupt the combo.',
        },
        {
          title: 'Basic Attack: Colucci Secret Gundo',
          text: 'Enters aim mode, dealing 1 instance of single-target Anima DMG to the enemy in the crosshair.',
        },
        {
          title: 'Basic Attack: Grand Entrance!',
          text: 'Swings her claws in the air and plunges, dealing 1 instance of Anima DMG to an area upon impact. Increases DMG based on fall height, up to 200%.',
        },
        {
          title: "Critical Riposte: Can't Touch This!",
          text: 'Triggers when using Colucci Secret Skill after a Critical Dodge. Charges toward the target at full speed, planting one hand on the ground, delivering a roundhouse kick that deals 1 instance of Anima DMG to an area, and reducing Break.',
        },
      ],
      flavorText:
        'Said to be a secret combat technique passed down in the Coluccis, though it clearly incorporates many street-fighting elements from Hetherau.',
      attributes: [
        {
          level: 1,
          values: [
            { label: '1st Instance Ratio', value: '29.6%' },
            { label: '2nd Instance Ratio', value: '38.8%' },
            { label: '3rd Instance Ratio', value: '12.2%*21%+127%' },
            { label: '4th Instance Ratio', value: '6.9%*7' },
            { label: '5th Instance Ratio', value: '77.1%+77.3%' },
            { label: 'Heavy Basic Attack: 1st Instance DMG Ratio', value: '6%+67.3%' },
            { label: 'Heavy Basic Attack: 2nd Instance DMG Ratio', value: '11.6%*2+84.7%' },
            { label: 'Heavy Basic Attack: 3rd Instance DMG Ratio', value: '158.5%' },
            { label: 'Aim DMG Ratio', value: 'Each instance 13%' },
            { label: 'Plunge DMG Ratio', value: '50%' },
            { label: 'Cycle Rate', value: '28' },
            { label: 'Critical Riposte Ratio', value: '166%' },
          ],
        },
      ],
      materials: nanallySkillMaterials,
    },
    {
      id: 'colucci-howling-technique',
      name: 'Colucci Howling Technique',
      type: 'Skill',
      icon: 'SK',
      description: [
        {
          title: 'Colucci Howling Technique',
          text: "Hehe, surprise time! Deals 5 instances of Anima DMG to surrounding enemies and wraps herself in Anima Esper Ability, gaining the Ichi-daime's Authority effect. Lasts 12s or until Nanally is switched out. Ends Ichi-daime's Authority early when recast.",
        },
      ],
      flavorText:
        "Mint tried to learn this move from Nanally, but the moment she saw that Nanally's hair went rough, curved, split, and knotted, she gave up the idea. Adler is not with her in the Bureau of Anomaly Control to take care of her hair, after all.",
      attributes: [
        {
          level: 1,
          values: [
            { label: 'Area DMG Ratio', value: '100%*5' },
            { label: 'CD', value: '16s' },
            { label: 'Cycle Rate', value: '11' },
            { label: 'Crit DMG Increase', value: '30%' },
          ],
        },
      ],
      materials: nanallySkillMaterials,
    },
    {
      id: 'colucci-ultimate-technique',
      name: 'Colucci Ultimate Technique',
      type: 'Ultimate',
      icon: 'UL',
      description: [
        {
          title: 'Colucci Ultimate Technique',
          text: "I'm way stronger than them! Deals 7 instances of Anima DMG immediately to surrounding enemies and summons Underboss to fight alongside her. Creates a small pull effect on surrounding enemies with Nanally's attacks while Underboss is active, and coordinates with all of Nanally's attacks to launch strikes, dealing Anima DMG that also counts as follow-up attack damage.",
        },
      ],
      flavorText:
        "A proper gang leader will give her goons some room to shine in the spotlight... I can't fight without my goons?! Ahem, are you having doubts about my strength?",
      attributes: [
        {
          level: 1,
          values: [
            { label: 'Area DMG Ratio', value: '293.1%+42.3%*5+495.4%' },
            { label: 'Underboss Basic Attack: 1st Instance DMG Ratio', value: '25%' },
            { label: 'Underboss Basic Attack: 2nd Instance DMG Ratio', value: '22.5%' },
            { label: 'Underboss Basic Attack: 3rd Instance DMG Ratio', value: '42.5%+40%' },
            { label: 'Underboss Basic Attack: 4th Instance DMG Ratio', value: '31.7%*3' },
            { label: 'Underboss Basic Attack: 5th Instance DMG Ratio', value: '45%+60%' },
            { label: 'Underboss Heavy Basic Attack: 1st Instance DMG Ratio', value: '31.1%' },
            { label: 'Underboss Heavy Basic Attack: 2nd Instance DMG Ratio', value: '22%+20.1%*71.5%' },
            { label: 'Underboss Heavy Basic Attack: 3rd Instance DMG Ratio', value: '46.6%*3' },
            { label: 'Underboss Plunge Attack DMG Ratio', value: '50%' },
            { label: 'Underboss Skill DMG Ratio', value: '24%*5' },
            { label: 'Underboss Critical Riposte DMG Ratio', value: '85.7%' },
            { label: 'Underboss Support Skill DMG Ratio', value: '150%' },
            { label: 'Underboss Duration', value: '6s' },
            { label: 'CD', value: '15s' },
            { label: 'Costs Ultimate Energy', value: '100' },
          ],
        },
      ],
      materials: nanallySkillMaterials,
    },
    {
      id: 'justice-from-above',
      name: 'Justice from Above',
      type: 'Support / Passive / Special',
      icon: 'SP',
      description: [
        {
          title: 'Justice from Above',
          text: 'Time to get serious! Charges with a spinning motion, delivering a kick and dealing 1 instance of Anima DMG to an area.',
        },
      ],
      flavorText: "Got a problem? Come find Nanally - I've got you covered!",
      attributes: [
        {
          level: 1,
          values: [{ label: 'DMG Ratio', value: '200%' }],
        },
      ],
      materials: nanallySkillMaterials,
    },
  ],
  passives: [
    {
      id: 'more-than-passionate',
      name: 'More Than Passionate',
      description: 'Blossom Enhancement: Fires 10 Vita Pistils with Vita Bud, reducing the interval between each shot to 1s.',
      flavorText: 'The First Rule of Gang Wars: "Watch your back."',
    },
    {
      id: 'fair-duel',
      name: 'Fair Duel',
      description:
        "Applies 1 follow-up attack to a single enemy, dealing Anima DMG of 60% ATK whenever any character in the team deals 1 instance of Esper Cycle DMG to an enemy while in Ichi-daime's Authority state. Triggers up to once every 2s.",
      flavorText: "Hey, hey, hey! The duel's already started! Running soooo far away... Chickening out, huh?",
    },
  ],
  lifeSkills: [
    {
      id: 'family-business',
      name: 'Family Business',
      effects: [
        { level: 1, text: 'Nanally increases dish prices by 0.2 Fons for each Main Dish tag on dishes.' },
        { level: 2, text: 'Nanally reduces ingredient consumption rate by 1%.' },
        { level: 3, text: "In Owner's Selection, hitting customers with the hammer grants 115% of the current dish price." },
        { level: 4, text: 'Nanally reduces ingredient consumption rate by 1%.' },
        { level: 5, text: 'Nanally increases dish prices by 0.3 Fons for every 2 Main Dish tags on dishes.' },
      ],
    },
  ],
  awakenings: [
    {
      id: 'a1',
      label: 'A1',
      type: 'Awakening 1',
      name: 'Gang Formation',
      description: 'Grants Nanally 2.5 Ultimate Energy for each follow-up attack she performs. Triggers at most once every 1s.',
    },
    { id: 'a2', label: 'A2', type: 'Awakening 2', name: 'Second Member', description: 'Underboss lasts 3s longer.' },
    {
      id: 'a3',
      label: 'A3',
      type: 'Awakening 3',
      name: 'Call Me the Boss',
      description:
        "Applies 1 follow-up attack to a single enemy, dealing Anima DMG of 50% ATK whenever Nanally deals damage to an enemy while in Ichi-daime's Authority. Triggers up to once per second.",
    },
    { id: 'a4', label: 'A4', type: 'Awakening 4', name: 'Not a Troublemaker', description: 'Underboss deals 100% increased damage.' },
    {
      id: 'a5',
      label: 'A5',
      type: 'Awakening 5',
      name: "Because We're Family",
      description: "Increases Nanally's ATK by 2% for each follow-up attack she performs, up to 20%. Disappears when Nanally leaves the battlefield or exits combat.",
    },
    {
      id: 'a6',
      label: 'A6',
      type: 'Awakening 6',
      name: 'Followers Everywhere',
      description: "Extends the duration of Ichi-daime's Authority state to 15s, and further extends it to 20s when out of combat.",
    },
  ],
  breakthroughs: [
    {
      id: 'r1',
      label: 'R1',
      type: '3-Awakening Bonus',
      name: 'Colucci Secrets Part 1',
      description: 'Increases the skill level of Colucci Secret Skill, Colucci Howling Technique, and Colucci Ultimate Technique by 1.',
    },
    {
      id: 'r2',
      label: 'R2',
      type: '6-Awakening Bonus',
      name: 'Colucci Secrets Part 2',
      description: "Increases Nanally's damage by an additional 15%.",
    },
  ],
  build: {
    recommendedWeaponIds: ['ready-ready', 'fluff-of-fortitude', 'raging-flames', 'oraora', 'song-of-the-whale'],
    recommendedWeapons: [
      { weaponId: 'ready-ready', priority: 1, label: 'Best in Slot', note: 'M5 calculation reference.' },
      { weaponId: 'ready-ready', priority: 2, label: 'Signature', note: "M1 signature option. Provides stats Nanally wants." },
      { weaponId: 'fluff-of-fortitude', priority: 3, label: 'Alternative', note: 'Battlepass arc and good secondary option for Nanally.' },
      { weaponId: 'raging-flames', priority: 4, label: 'F2P', note: 'F2P option that increases skill and ultimate damage. Cast Ultimate first when using this arc.' },
      { weaponId: 'oraora', priority: 5, label: 'A-Rank Option', note: 'A-Rank option that supports enhanced basic attack damage.' },
      { weaponId: 'song-of-the-whale', priority: 6, label: 'Alternative', note: 'Can be stronger if you get more stuns.' },
    ],
    recommendedCartridges: [
      { cartridgeId: 'fireflies-and-the-forest', rarity: 'S', priority: 1, label: 'Best in Slot', note: 'Provides Nanally with crit value and supports her main damage type.' },
      { cartridgeId: 'shadow-creed', rarity: 'S', priority: 2, label: 'Alternative', note: "Can lean into Nanally's Crit Rate console trait with Type II modules." },
      { cartridgeId: 'lost-radiance', rarity: 'S', priority: 3, label: 'Alternative', note: 'Provides a defense shred option, but changes her setup order.' },
      { cartridgeId: 'devils-blood-curse', rarity: 'S', priority: 4, label: 'Alternative', note: 'Theory option that may reduce Type II module count for Nanally.' },
    ],
    mainStats: [
      { statId: 'anima_dmg_bonus', priority: 1 },
      { statId: 'crit_dmg', priority: 2 },
      { statId: 'atk_percent', priority: 3 },
      { statId: 'crit_rate', priority: 4 },
    ],
    subStats: [
      { statId: 'crit_rate', priority: 1 },
      { statId: 'crit_dmg', priority: 2 },
      { statId: 'atk_percent', priority: 3 },
      { statId: 'dmg_bonus', priority: 4 },
      { statId: 'atk', priority: 5 },
    ],
    endgameStats: [
      { statId: 'hp', targetValue: '20,000+' },
      { statId: 'atk', targetValue: '2200+' },
      { statId: 'crit_rate', targetValue: '85%+' },
      { statId: 'crit_dmg', targetValue: '300%+ before 56% from Cartridge set bonus.' },
      { statId: 'dmg_bonus', targetValue: '30%+' },
      { statId: 'anima_dmg_bonus', targetValue: '47.5%+' },
    ],
    skillPriority: ['Passive 1', 'Passive 2', 'Basic = Ult', 'Skill', 'Support'],
    notes: [
      'Nanally wants uninterrupted field time during her burst window.',
      'Use Skill before Ultimate when setting up her damage window.',
      'Prioritize Crit Rate and Crit DMG while keeping enough ATK.',
      'Type II modules are important because of her console trait.',
    ],
    videoGuides: ["Nanally guide videos aren't available yet."],
  },
  consoleSetup: {
    title: 'Type II Specialization',
    description: 'Increases CRIT Rate by 6% for each Type II Module equipped.',
    arc: 'Ready-Ready',
    mainCartridge: 'Fireflies and the Forest',
    rarityPriority: ['S', 'A', 'B'],
    cartridgeEffects: [
      '(2) Anima DMG +10%',
      "(4) Increases wearer's CRIT DMG by 8% when a nearby enemy takes Anima DMG from the Team, up to 7 stacks. Each stack lasts 10s. Effect remains active when the character is off-field.",
    ],
    requiredPieces: [
      { id: 'piece-a', label: 'Piece A', type: 'II', shapeKey: 'type-ii-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'green' },
      { id: 'piece-b', label: 'Piece B', type: 'III', shapeKey: 'type-iii-line-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'purple' },
      { id: 'piece-c', label: 'Piece C', type: 'II', shapeKey: 'type-ii-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'teal' },
      { id: 'piece-d', label: 'Piece D', type: 'II', shapeKey: 'type-ii-horizontal', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'blue' },
      { id: 'piece-e', label: 'Piece E', type: 'III', shapeKey: 'type-iii-l-bottom-left', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'cyan' },
      { id: 'piece-f', label: 'Piece F', type: 'IV', shapeKey: 'type-iv-z-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'gold' },
      { id: 'piece-g', label: 'Piece G', type: 'II', shapeKey: 'type-ii-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'green' },
      { id: 'piece-h', label: 'Piece H', type: 'II', shapeKey: 'type-ii-horizontal', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'blue' },
    ],
    grid: {
      rows: 7,
      cols: 7,
      blockedCells: [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
        [2, 0], [2, 6],
        [3, 0], [3, 6],
        [4, 0], [4, 6],
        [5, 0], [5, 6],
        [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
      ],
      placedPieces: [
        { pieceId: 'piece-a', cells: [[2, 1], [3, 1]] },
        { pieceId: 'piece-b', cells: [[2, 2], [3, 2], [4, 2]] },
        { pieceId: 'piece-c', cells: [[2, 3], [3, 3]] },
        { pieceId: 'piece-d', cells: [[2, 4], [2, 5]] },
        { pieceId: 'piece-e', cells: [[4, 1], [5, 1], [5, 2]] },
        { pieceId: 'piece-f', cells: [[3, 4], [4, 3], [4, 4], [5, 3]] },
        { pieceId: 'piece-g', cells: [[3, 5], [4, 5]] },
        { pieceId: 'piece-h', cells: [[5, 4], [5, 5]] },
      ],
    },
    notes: [
      "Prioritize Type II module count first to scale Nanally's Crit Rate through her console trait.",
      'Recommended layout follows the current reference image with the former green placeholders replaced by real S, A, and B rarity modules.',
    ],
  },
  materials: {
    skill: nanallySkillMaterials.items,
  },
  synergies: [
    {
      characterId: 'zero-female',
      name: 'Zero / MC',
      role: 'Instant Cycle / Cycle Damage',
      notes: [
        'A great choice for characters that can cause an Esper Cycle due to Instant Cycle on their Skill.',
        'Provides good cycle damage when built with Cycle Intensity.',
        'Can be built as semi-sustain in Charge setups or with the Arc "Your Happiness is Priceless".',
      ],
    },
    {
      characterId: 'jiuyuan',
      name: 'Jiuyuan',
      role: 'Blossom Support / Gather',
      notes: [
        'Provides 2 Vita Buds whenever a Blossom interaction is triggered, allowing double damage from the Esper Cycle.',
        'Strong option for AoE content due to her ability to gather enemies easily with her Skill.',
      ],
    },
    {
      characterId: 'hotori',
      name: 'Hotori',
      role: 'Sub DPS / Dual DPS',
      notes: [
        'A good dual DPS option when playing Hotori as a Sub DPS, since Nanally requires more field time while Hotori can operate from the sidelines.',
        "Hotori's recording ability can capture Nanally's skills during Present Replay, contributing to a big burst window during her Ultimate.",
        'Triggers the Blossom Cycle Reaction with Hotori, with her More Than Passionate passive further boosting Blossom output for the team.',
        "Hotori's Ghost Orchid Crest passive allows Nanally's Vita Bud attacks to continue even during Time Stop.",
      ],
    },
    {
      characterId: 'hanizel',
      name: 'Hanizel',
      role: 'Off-field DPS / Buff',
      notes: [
        "Deals damage from off-field and buffs the on-field character's attack with her signature Arc.",
        "Buffs the team's attack after using her Ultimate and Crit DMG when she has all 6 Awakening active.",
        'Strong choice even when there is no opportunity to create an Esper Cycle.',
      ],
    },
    {
      characterId: 'sakiri',
      name: 'Sakiri',
      role: 'Buffer / DEF Shred',
      notes: [
        "Buffs the team's attack by 30% and shreds enemy defense by 10% with her Ultimate.",
        'Creates the opportunity to trigger the Hex Esper Cycle for Nanally to deal an additional 20% damage for 12s.',
      ],
    },
    {
      characterId: 'hathor',
      name: 'Hathor',
      role: 'Dual DPS / Charge',
      notes: [
        'Can be used in a dual DPS comp with Nanally in a Charge team setup for higher Ultimate uptime.',
        'Extends Remora duration to 12 seconds, allowing more Charge procs.',
        'Provides a Crit buff when attacking targets with Remora.',
        'Gaining copies of Nanally and obtaining her Awakening "Gang Formation" can make Charge teams less necessary.',
      ],
    },
    {
      characterId: 'chiz',
      name: 'Chiz',
      role: 'Sub DPS / Blossom Trigger',
      notes: [
        'A decent Sub DPS option for a dual DPS team.',
        'An option for triggering Blossom with Nanally.',
      ],
    },
    {
      characterId: 'adler',
      name: 'Adler',
      role: 'Shield / Hex Setup',
      notes: [
        'Provides shielding to the team.',
        'Creates the opportunity to trigger the Hex Esper Cycle for Nanally to deal an additional 20% damage for 12s.',
      ],
    },
    {
      characterId: 'aurelia',
      name: 'Aurelia',
      role: 'Healer / Blossom Support',
      notes: [
        'Provides healing to the team.',
        'Can participate in the Blossom reaction.',
        'Can give an attack buff with his Ultimate when using the Speedy Hedgehog set.',
        'Can provide additional defense to characters standing in his Ultimate with his awakening "Visitor from Planet Curiosity".',
      ],
    },
  ],
  teams: [
    {
      id: 'nanally-blossom',
      name: 'Blossom Team',
      tag: 'Recommended',
      type: 'Blossom',
      members: [
        { characterId: 'nanally', slot: 'Main DPS', note: 'Primary field-time damage dealer.' },
        { characterId: 'jiuyuan', slot: 'Blossom Support', note: 'Adds Vita Bud value and grouping.' },
        { characterId: 'zero-female', name: 'Zero / MC', slot: 'Instant Cycle', note: 'Enables Esper Cycle pressure.' },
        { characterId: 'hotori', slot: 'Sub DPS', note: 'Repeats Nanally windows during Time Stop.' },
      ],
      description:
        "This team focuses on generating as many Blossoms as possible through MC's Instant Cycle ability and Hotori being able to repeat this during her Time Stop. Nanally has high field time to take advantage of that synergy, while the other members support her burst windows. For players missing Hotori, options like Hanizel or Sakiri can provide damage boosts.",
      rotation: [
        'Use support skills to prepare Blossom and buffs.',
        "Use Nanally Skill to enter Ichi-daime's Authority.",
        'Use Nanally Ultimate to summon Underboss.',
        'Keep Nanally on-field and chain normal attacks.',
        'Reapply support effects before the next Nanally burst window.',
      ],
      alternatives: [
        'Hanizel can replace Hotori as an off-field damage/buff option.',
        'Sakiri can replace a flex slot for ATK buff and DEF shred.',
        'Aurelia can be used if healing is needed.',
      ],
    },
    {
      id: 'nanally-hex',
      name: 'Hex Team',
      tag: 'Alternative',
      type: 'Hex',
      members: [
        { characterId: 'nanally', slot: 'Main DPS', note: 'Main follow-up damage source.' },
        { characterId: 'sakiri', slot: 'Buffer / Hex Enabler', note: 'ATK buff and DEF shred.' },
        { characterId: 'jiuyuan', slot: 'Support', note: 'Support and grouping when needed.' },
        { characterId: 'adler', slot: 'Shield / Hex Setup', note: 'Shielding and Hex setup.' },
      ],
      description:
        'Nanally remains the main damage dealer in this team, but the whole team can take advantage of the Hex reaction. With two characters of each attribute, it becomes easier to maintain Hex uptime and create additional damage windows.',
      rotation: [
        'Use Sakiri to apply buffs and create Hex opportunity.',
        'Use Adler for shielding and setup.',
        'Use Jiuyuan for support and grouping if needed.',
        'Use Nanally Skill and Ultimate, then stay on-field to deal follow-up damage.',
      ],
      alternatives: [
        'Hotori can be used for a stronger dual DPS setup.',
        'Aurelia can replace a flex slot if sustain is needed.',
      ],
    },
  ],
  detailReady: true,
}

export const nanallyCard = T('Nanally', {
    id: 'nanally',
    rarity: 'S',
    element: 'anima',
    arcType: 'plasma',
    roles: ['Damage', 'Main DPS', 'Follow-up Attack'],
    tags: ['Main DPS', 'Damage', 'Follow-up Attack'],
    shortDescription: "The Ichi-daime of the Coluccis - currently seeking new recruits!",
    releaseDate: '2025-08-22',
    isNew: false,
    portrait: { from: '#ccfbf1', to: '#fff7ed' },
  })
