const PDF_STATUS = 'pdf_import_needs_review'

function values(labels, row) {
  return labels.map((label, index) => ({ label, value: row[index] }))
}

function levels(labels, rows) {
  return rows.map((row, index) => ({ level: index + 1, values: values(labels, row), sourceStatus: PDF_STATUS }))
}

function emptyLevels(labels, startLevel, endLevel) {
  return Array.from({ length: endLevel - startLevel + 1 }, (_, index) => ({
    level: startLevel + index,
    values: labels.map((label) => ({ label, value: '—' })),
    sourceStatus: PDF_STATUS,
  }))
}

const nanallySkillMaterials = {
  currency: 437000,
  items: [
    { name: 'FNG', amount: 10, sources: ['Skill Material Instance: Incantation', 'Event Shop'] },
    { name: 'Fading Silhouette', amount: 10, sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'] },
    { name: 'CO', amount: 10, sources: ['Skill Material Instance: Incantation', 'Event Shop'] },
    { name: 'Blurred Silhouette', amount: 10, sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'] },
    { name: 'Good Boy Stamp', amount: 8, sources: ['Store Front', 'Instance Drops', 'World Exploration'] },
    { name: 'White Rose', amount: 16, sources: ['Skill Material Instance: Incantation', 'Event Shop'] },
    { name: 'Chaos Silhouette', amount: 16, sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'] },
  ],
}

const sakiriSkillMaterials = {
  currency: 437000,
  items: [
    { name: 'First Expectations', amount: 10, sources: ['Skill Material Instance: Chaos', 'Event Shop'] },
    { name: 'Blurred Numeral', amount: 10, sources: ['Monster Drop (Forest Path)', 'Simulation Center'] },
    { name: 'Known Weariness', amount: 10, sources: ['Skill Material Instance: Chaos', 'Event Shop'] },
    { name: 'Unsolved Numeral', amount: 10, sources: ['Monster Drop (Forest Path)', 'Simulation Center'] },
    { name: 'Good Boy Stamp', amount: 8, sources: ['Store Front', 'Instance Drops', 'World Exploration'] },
    { name: 'Black Hat', amount: 16, sources: ['Skill Material Instance: Chaos', 'Event Shop'] },
    { name: 'Distorted Numeral', amount: 16, sources: ['Monster Drop (Forest Path)', 'Simulation Center'] },
  ],
}

const nanallySkillRows = levels(['Area DMG Ratio', 'CD', 'Cycle Rate', 'CRIT DMG Increase'], [
  ['100% x 5', '16s', '11', '30%'],
  ['108% x 5', '16s', '11', '30%'],
  ['116.6% x 5', '16s', '11', '30%'],
  ['126% x 5', '16s', '11', '30%'],
  ['136% x 5', '16s', '11', '30%'],
  ['146.9% x 5', '16s', '11', '30%'],
  ['158.7% x 5', '16s', '11', '30%'],
  ['171.4% x 5', '16s', '11', '30%'],
  ['185.1% x 5', '16s', '11', '30%'],
  ['199.9% x 5', '16s', '11', '30%'],
  ['215.9% x 5', '16s', '11', '30%'],
  ['233.2% x 5', '16s', '11', '30%'],
  ['251.8% x 5', '16s', '11', '30%'],
])

const nanallySupportRows = levels(['DMG Ratio'], [
  ['200%'],
  ['216%'],
  ['233%'],
  ['260%'],
  ['272%'],
  ['294%'],
  ['317.4%'],
  ['342%'],
  ['370%'],
  ['400%'],
  ['432%'],
  ['466%'],
  ['504%'],
])

const nanallyBasicLabels = [
  '1st Instance Ratio',
  '2nd Instance Ratio',
  '3rd Instance Ratio',
  '4th Instance Ratio',
  '5th Instance Ratio',
  'Heavy Basic Attack: 1st Instance DMG Ratio',
  'Heavy Basic Attack: 2nd Instance DMG Ratio',
  'Heavy Basic Attack: 3rd Instance DMG Ratio',
  'Aim DMG Ratio',
  'Plunge DMG Ratio',
  'Cycle Rate',
  'Critical Riposte Ratio',
]

const nanallyUltimateLabels = [
  'Area DMG Ratio',
  'Underboss Basic Attack: 1st Instance DMG Ratio',
  'Underboss Basic Attack: 2nd Instance DMG Ratio',
  'Underboss Basic Attack: 3rd Instance DMG Ratio',
  'Underboss Basic Attack: 4th Instance DMG Ratio',
  'Underboss Basic Attack: 5th Instance DMG Ratio',
  'Underboss Heavy Basic Attack: 1st Instance DMG Ratio',
  'Underboss Heavy Basic Attack: 2nd Instance DMG Ratio',
  'Underboss Heavy Basic Attack: 3rd Instance DMG Ratio',
  'Underboss Plunge DMG Ratio',
  'Underboss Skill DMG Ratio',
  'Underboss Critical Riposte Ratio',
  'Underboss Support Skill DMG Ratio',
  'Underboss Duration',
  'CD',
  'Ultimate Energy Cost',
]

const sakiriBasicRows = levels(
  ['1st Instance Ratio', '2nd Instance Ratio', '3rd Instance Ratio', '4th Instance Ratio', '5th Instance Ratio', 'Plunge DMG Ratio', 'Cycle Rate', 'Critical Riposte Ratio'],
  [
    ['40.3%', '13.8% + 75.7%', '1.6% + 71.6%', '33.1% x 3', '3.5% + 106.2%', '50%', '34', '214%'],
    ['43.5%', '14.9% + 81.8%', '1.7% + 77.3%', '35.7% x 3', '3.8% + 114.7%', '54%', '34', '231.1%'],
    ['47%', '16.1% + 88.3%', '1.9% + 83.5%', '38.6% x 3', '4.1% + 123.9%', '58.3%', '34', '249.6%'],
    ['50.8%', '17.4% + 95.4%', '2% + 90.2%', '41.7% x 3', '4.4% + 133.8%', '63%', '34', '269.6%'],
    ['54.8%', '18.8% + 103%', '2.2% + 97.4%', '45% x 3', '4.8% + 144.5%', '68%', '34', '291.1%'],
    ['59.2%', '20.3% + 111.2%', '2.4% + 105.2%', '48.6% x 3', '5.1% + 156%', '73.5%', '34', '314.4%'],
    ['64%', '21.9% + 120.1%', '2.5% + 113.6%', '52.5% x 3', '5.6% + 168.5%', '79.3%', '34', '339.6%'],
    ['69.1%', '23.7% + 129.7%', '2.7% + 122.7%', '56.7% x 3', '6% + 182%', '85.7%', '34', '366.8%'],
    ['74.6%', '25.5% + 140.1%', '3% + 132.5%', '61.3% x 3', '6.5% + 196.6%', '92.5%', '34', '396.1%'],
    ['80.6%', '27.6% + 151.3%', '3.2% + 143.1%', '66.2% x 3', '7% + 212.3%', '100%', '34', '427.8%'],
    ['87%', '29.8% + 163.4%', '3.5% + 154.6%', '71.5% x 3', '7.6% + 229.3%', '107.9%', '34', '462%'],
    ['94%', '32.2% + 176.5%', '3.7% + 166.9%', '77.2% x 3', '8.2% + 247.6%', '116.6%', '34', '499%'],
    ['101.5%', '34.8% + 190.6%', '4% + 180.3%', '83.4% x 3', '8.8% + 267.4%', '125.9%', '34', '538.9%'],
  ],
)

const sakiriSkillRows = levels(['Press Ratio', 'Hold Ratio', 'CD', 'Cycle Rate', 'Cycle Energy'], [
  ['167.8% + 232.2%', '90.3% + 118.8% + 190.9%', '16s', '16', '23'],
  ['181.2% + 250.8%', '97.5% + 128.3% + 206.2%', '16s', '16', '23'],
  ['195.7% + 270.8%', '105.3% + 138.6% + 222.7%', '16s', '16', '23'],
  ['211.4% + 292.5%', '113.8% + 149.7% + 240.5%', '16s', '16', '23'],
  ['228.3% + 315.9%', '122.9% + 161.6% + 259.7%', '16s', '16', '23'],
  ['246.6% + 341.2%', '132.7% + 174.6% + 280.5%', '16s', '16', '23'],
  ['266.3% + 368.5%', '143.3% + 188.5% + 302.9%', '16s', '16', '23'],
  ['287.6% + 397.9%', '154.8% + 203.6% + 327.2%', '16s', '16', '23'],
  ['310.6% + 429.8%', '167.1% + 219.9% + 353.3%', '16s', '16', '23'],
  ['335.4% + 464.2%', '180.5% + 237.5% + 381.6%', '16s', '16', '23'],
  ['362.3% + 501.3%', '195% + 256.5% + 412.1%', '16s', '16', '23'],
  ['391.2% + 541.4%', '210.5% + 277% + 445.1%', '16s', '16', '23'],
  ['422.5% + 584.7%', '227.4% + 299.2% + 480.7%', '16s', '16', '23'],
])

const sakiriUltimateRows = levels(['Gravity Slurry Ratio', 'CD', 'Ultimate Energy Cost', 'Suppress Duration', 'ATK Bonus Ratio', 'Duration'], [
  ['120% x 5 + 300%', '20s', '120', '3s', '30%', '20s'],
  ['129.6% x 5 + 324%', '20s', '120', '3s', '30%', '20s'],
  ['140% x 5 + 349.9%', '20s', '120', '3s', '30%', '20s'],
  ['151.2% x 5 + 377.9%', '20s', '120', '3s', '30%', '20s'],
  ['163.3% x 5 + 408.1%', '20s', '120', '3s', '30%', '20s'],
  ['176.3% x 5 + 440.8%', '20s', '120', '3s', '30%', '20s'],
  ['190.4% x 5 + 476.1%', '20s', '120', '3s', '30%', '20s'],
  ['205.7% x 5 + 514.1%', '20s', '120', '3s', '30%', '20s'],
  ['222.1% x 5 + 555.3%', '20s', '120', '3s', '30%', '20s'],
  ['239.9% x 5 + 599.7%', '20s', '120', '3s', '30%', '20s'],
  ['259.1% x 5 + 647.7%', '20s', '120', '3s', '30%', '20s'],
  ['279.8% x 5 + 699.5%', '20s', '120', '3s', '30%', '20s'],
  ['302.2% x 5 + 755.5%', '20s', '120', '3s', '30%', '20s'],
])

const sakiriSupportRows = levels(['DMG Ratio'], [
  ['200%'],
  ['216%'],
  ['233.3%'],
  ['251.9%'],
  ['272.1%'],
  ['293.9%'],
  ['317.4%'],
  ['342.8%'],
  ['370.2%'],
  ['399.8%'],
  ['431.8%'],
  ['466.3%'],
  ['503.6%'],
])

const nanallyRawSourceText = {
  importedFrom: 'H:/Cursor/NevernestDB/characters/Nanally/date.pdf',
  extractedTextPath: '.generated/pdf-extract/nanally.txt',
  machineTranslationNotes: [
    'PDF alternates Colucci, Kolucci, Collucci, and "Kollucci".',
    'PDF phrases include "damage of the anima", "specimen of animation", and "Secret Gudno Kollucci"; clean site wording is retained publicly.',
    'Basic Attack and Ultimate Lv.1-Lv.13 tables are preserved as raw extraction fragments because the PDF text stream interleaves columns across pages.',
  ],
  basicAttackText:
    'Basic Attack: The Secret Skill of Kolucci. Exposes the fangs and demonstrates sharp claws to carry out up to 5 consecutive attacks, damaging the anima. Heavy blows, aiming mode, plunge, and Critical counterattack fragments are retained from the PDF extraction.',
  ultimateText:
    'Colucci Ultimate Technique. Deals 7 instances of Anima DMG immediately to surrounding enemies and summons Underboss to fight alongside her, dealing Anima DMG that also counts as follow-up attack damage.',
}

const nanallySkills = [
  {
    id: 'colucci-secret-skill',
    name: 'Colucci Secret Skill',
    type: 'Basic Attack',
    icon: 'BA',
    maxLevel: 13,
    description: [
      { title: 'Basic Attack: Colucci Secret Skill', text: 'Bares her fangs and brandishes her claws, performing up to 5 consecutive attacks, dealing Anima DMG. Dodging does not interrupt the combo.' },
      { title: 'Basic Attack: Heavy Hitter!', text: 'Triggers by holding Basic Attack. Performs up to 3 powerful attacks, dealing Anima DMG. Chains after Critical Riposte and the 1st, 2nd, 3rd, and 4th attacks of Colucci Secret Skill.' },
      { title: 'Basic Attack: Colucci Secret Gundo', text: 'Enters aim mode, dealing 1 instance of single-target Anima DMG to the enemy in the crosshair.' },
      { title: 'Basic Attack: Grand Entrance!', text: 'Swings her claws in the air and plunges, dealing 1 instance of Anima DMG to an area upon impact. Damage increases based on fall height.' },
      { title: "Critical Riposte: Can't Touch This!", text: 'Charges toward the target after a Critical Dodge and delivers a roundhouse kick, dealing 1 instance of Anima DMG to an area and reducing Break.' },
    ],
    quote: 'A secret Colucci combat technique with obvious Hetherau street-fighting elements.',
    attributes: [
      {
        level: 1,
        values: [
          { label: '1st Instance Ratio', value: '29.6%' },
          { label: '2nd Instance Ratio', value: '38.8%' },
          { label: '3rd Instance Ratio', value: '12.2% + 21% + 127%' },
          { label: '4th Instance Ratio', value: '6.9% x 7' },
          { label: '5th Instance Ratio', value: '77.1% + 77.3%' },
          { label: 'Heavy Basic Attack: 1st Instance DMG Ratio', value: '6% + 67.3%' },
          { label: 'Heavy Basic Attack: 2nd Instance DMG Ratio', value: '11.6% x 2 + 84.7%' },
          { label: 'Heavy Basic Attack: 3rd Instance DMG Ratio', value: '158.5%' },
          { label: 'Aim DMG Ratio', value: 'Each instance 13%' },
          { label: 'Plunge DMG Ratio', value: '50%' },
          { label: 'Cycle Rate', value: '28' },
          { label: 'Critical Riposte Ratio', value: '166%' },
        ],
      },
      ...emptyLevels(nanallyBasicLabels, 2, 13),
    ],
    materials: nanallySkillMaterials,
  },
  {
    id: 'colucci-howling-technique',
    name: 'Colucci Howling Technique',
    type: 'Skill',
    icon: 'SK',
    maxLevel: 13,
    description: [{ title: 'Colucci Howling Technique', text: "Deals 5 instances of Anima DMG around Nanally and wraps her in Anima Esper Ability, entering Ichi-daime's Authority for 12s or until she leaves the battlefield. Recasting during the state ends it early." }],
    quote: "Mint tried to learn this move from Nanally, but gave up after seeing Nanally's hair go rough, curved, split, and knotted.",
    attributes: nanallySkillRows,
    materials: nanallySkillMaterials,
  },
  {
    id: 'colucci-ultimate-technique',
    name: 'Colucci Ultimate Technique',
    type: 'Ultimate',
    icon: 'UL',
    maxLevel: 13,
    description: [{ title: 'Colucci Ultimate Technique', text: "Deals 7 instances of Anima DMG immediately to surrounding enemies and summons Underboss to fight alongside her. Underboss damage counts as follow-up attack damage." }],
    quote: "A proper gang leader gives her goons room to shine in the spotlight.",
    attributes: [
      {
        level: 1,
        values: [
          { label: 'Area DMG Ratio', value: '293.1% + 42.3% x 5 + 495.4%' },
          { label: 'Underboss Basic Attack: 1st Instance DMG Ratio', value: '25%' },
          { label: 'Underboss Basic Attack: 2nd Instance DMG Ratio', value: '22.5%' },
          { label: 'Underboss Basic Attack: 3rd Instance DMG Ratio', value: '42.5% + 40%' },
          { label: 'Underboss Basic Attack: 4th Instance DMG Ratio', value: '31.7% x 3' },
          { label: 'Underboss Basic Attack: 5th Instance DMG Ratio', value: '45% + 60%' },
          { label: 'Underboss Heavy Basic Attack: 1st Instance DMG Ratio', value: '31.1%' },
          { label: 'Underboss Heavy Basic Attack: 2nd Instance DMG Ratio', value: '22% + 20.1% + 71.5%' },
          { label: 'Underboss Heavy Basic Attack: 3rd Instance DMG Ratio', value: '46.6% x 3' },
          { label: 'Underboss Plunge DMG Ratio', value: '50%' },
          { label: 'Underboss Skill DMG Ratio', value: '24% x 5' },
          { label: 'Underboss Critical Riposte Ratio', value: '85.7%' },
          { label: 'Underboss Support Skill DMG Ratio', value: '150%' },
          { label: 'Underboss Duration', value: '6s' },
          { label: 'CD', value: '15s' },
          { label: 'Ultimate Energy Cost', value: '100' },
        ],
      },
      ...emptyLevels(nanallyUltimateLabels, 2, 13),
    ],
    materials: nanallySkillMaterials,
  },
  {
    id: 'justice-from-above',
    name: 'Justice from Above',
    type: 'Other',
    icon: 'AS',
    maxLevel: 13,
    description: [{ title: 'Justice from Above', text: 'Charges with a spinning motion, delivering a kick and dealing 1 instance of Anima DMG to an area.' }],
    quote: "Got a problem? Come find Nanally - I've got you covered!",
    attributes: nanallySupportRows,
    materials: nanallySkillMaterials,
  },
]

const nanallyPassiveSkills = [
  { id: 'more-than-passionate', name: 'More than Passionate', type: 'Passive', icon: 'P1', description: [{ title: 'Blossom Enhancement', text: 'Fires 10 Vita Pistils with Vita Bud, reducing the interval between each shot to 1s.' }], quote: 'The First Rule of Gang Wars: "Watch your back."' },
  { id: 'fair-duel', name: 'Fair Duel', type: 'Passive', icon: 'P2', description: [{ title: 'Fair Duel', text: "When there is only 1 enemy on the field, increases Nanally's ATK by 60%." }] },
]

const nanallyAwakeningSkills = [
  { id: 'nanally-a1', name: 'A1: Gang Formation', type: 'Awakening', icon: 'A1', description: [{ title: 'Gang Formation', text: "Underboss remains on the field while Ichi-daime's Authority is active and launches coordinated attacks with Nanally." }] },
  { id: 'nanally-a2', name: 'A2: Second Member', type: 'Awakening', icon: 'A2', description: [{ title: 'Second Member', text: 'Increases the skill level of Colucci Howling Technique and Colucci Ultimate Technique by 1.' }] },
  { id: 'nanally-a3', name: 'A3: Call Me the Boss', type: 'Awakening', icon: 'A3', description: [{ title: 'Call Me the Boss', text: "Increases Nanally's follow-up attack damage while Underboss is active." }] },
  { id: 'nanally-a4', name: 'A4: Not a Troublemaker', type: 'Awakening', icon: 'A4', description: [{ title: 'Not a Troublemaker', text: "Underboss deals 30% increased damage." }] },
  { id: 'nanally-a5', name: "A5: Because We're Family", type: 'Awakening', icon: 'A5', description: [{ title: "Because We're Family", text: "Increases Nanally's ATK after Underboss attacks." }] },
  { id: 'nanally-a6', name: 'A6: Followers Everywhere', type: 'Awakening', icon: 'A6', description: [{ title: 'Followers Everywhere', text: "Extends the duration of Ichi-daime's Authority to 15s, and further extends it to 20s when out of combat." }] },
  { id: 'nanally-r1', name: 'Colucci Part 1', type: 'Breakthrough', icon: 'R1', description: [{ title: 'Colucci Part 1', text: 'Increases the skill level of Colucci Secret Skill, Colucci Howling Technique, and Colucci Ultimate Technique by 1.' }] },
  { id: 'nanally-r2', name: 'Colucci Secrets Part 2', type: 'Breakthrough', icon: 'R2', description: [{ title: 'Colucci Secrets Part 2', text: "Increases Nanally's damage by an additional 10%." }] },
  { id: 'family-business', name: 'Family Business', type: 'Life Skill', icon: 'LS', description: [
    { title: 'Lv.1', text: 'Increases dish prices by 0.2 Fons for every Main Dish tag.' },
    { title: 'Lv.2', text: 'Reduces ingredient consumption rate by 1%.' },
    { title: 'Lv.3', text: "Owner's Selection hammer grants 115% of the current dish price." },
    { title: 'Lv.4', text: 'Reduces ingredient consumption rate by 1%.' },
    { title: 'Lv.5', text: 'Increases dish prices by 0.3 Fons for every 2 Main Dish tags.' },
  ] },
]

export const nanallyPdfSourcePatch = {
  skills: [...nanallySkills, ...nanallyPassiveSkills, ...nanallyAwakeningSkills],
  passives: nanallyPassiveSkills,
  awakenings: nanallyAwakeningSkills.filter((skill) => skill.type === 'Awakening'),
  resonance: nanallyAwakeningSkills.filter((skill) => skill.type === 'Breakthrough'),
  breakthroughs: nanallyAwakeningSkills.filter((skill) => skill.type === 'Breakthrough'),
  lifeSkills: [{ id: 'family-business', name: 'Family Business', levels: nanallyAwakeningSkills.find((skill) => skill.id === 'family-business')?.description || [] }],
  materials: {
    notes: 'Per-skill upgrade materials and breakthrough totals.',
    skillMaterials: nanallySkillMaterials.items,
    ascension: [
      { name: 'Fading Silhouette', amount: 17, sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'] },
      { name: "A Page from Delusion's Shore", amount: 86, sources: ['World Boss: Stormherald'] },
      { name: 'Blurred Silhouette', amount: 18, sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'] },
      { name: 'Chaos Silhouette', amount: 15, sources: ['Monster Drop (Desert Ruins)', 'Simulation Center'] },
      { name: 'Required Currency', amount: 525000 },
    ],
  },
  sourceNotes: {
    importedFrom: nanallyRawSourceText.importedFrom,
    conflicts: [
      'A4 Not a Troublemaker changed from previous 100% Underboss damage wording to PDF value 30%.',
      'R2 Colucci Secrets Part 2 changed from previous 15% damage wording to PDF value 10%.',
      'A5/A6 labels are preserved with clean site naming because the PDF extraction interleaves Followers Everywhere with the duration-extension text.',
    ],
  },
  rawSourceText: nanallyRawSourceText,
  unmappedSourceData: [
    'Nanally Basic Attack Lv.2-Lv.13 table columns require manual reconstruction from interleaved PDF stream text.',
    'Nanally Ultimate Lv.2-Lv.13 table columns require manual reconstruction from interleaved PDF stream text.',
  ],
}

const sakiriSkills = [
  {
    id: 'kiroumaru-headbutt',
    name: 'Kiroumaru Headbutt',
    type: 'Basic Attack',
    icon: 'BA',
    maxLevel: 13,
    description: [
      { title: 'Basic Attack', text: 'Sakiri conducts up to 5 consecutive attacks, swinging Kiroumaru and dealing Incantation DMG.' },
      { title: 'Eating Mode', text: 'Hold Basic Attack to enter Eating Mode. Sakiri rides Kiroumaru, moves, pulls nearby targets in front of Kiroumaru, and can devour weak enemies or destroy nearby movable objects. One digested enemy lasts 180s and only one target can be digested at a time.' },
      { title: 'Plunge', text: 'Swings Kiroumaru in the air and dives, dealing 1 instance of Incantation DMG to an area on impact. Damage increases based on fall height.' },
      { title: 'Critical Riposte', text: 'Triggers after a Critical Dodge, dealing Incantation DMG and reducing Break.' },
    ],
    attributes: sakiriBasicRows,
    materials: sakiriSkillMaterials,
  },
  {
    id: 'devour-whole',
    name: 'Devour Whole',
    type: 'Skill',
    icon: 'SK',
    maxLevel: 13,
    description: [
      { title: 'Burp', text: 'Press to activate. Kiroumaru opens its mouth, pulls in nearby enemies, then inflates and knocks the enemy down.' },
      { title: 'Gravity Eater', text: 'Hold to activate. Kiroumaru opens its mouth, pulls in nearby enemies, then bites through the ground and devours gravity in that area, levitating enemies there. This is not effective against powerful enemies.' },
    ],
    quote: '"Sa... Sakiri, can I eat this?" "Moron, next time ask before you eat!"',
    attributes: sakiriSkillRows,
    materials: sakiriSkillMaterials,
  },
  {
    id: 'feast-of-gluttony',
    name: 'Feast of Gluttony',
    type: 'Ultimate',
    icon: 'UL',
    maxLevel: 13,
    description: [{ title: 'Feast of Gluttony', text: 'Kiroumaru spits out a large amount of Gravity Slurry from above, dealing Incantation DMG to an area. Applies strong gravity to hit enemies, pressing them heavily to the ground and preventing suppressed enemies from moving for a period. This suppression is not effective against bosses.' }],
    quote: 'No prey escapes before Kiroumaru has its fill.',
    attributes: sakiriUltimateRows,
    materials: sakiriSkillMaterials,
  },
  {
    id: 'squash',
    name: 'Squash!',
    type: 'Other',
    icon: 'AS',
    maxLevel: 13,
    description: [{ title: 'Squash!', text: 'Sakiri slams the enlarged Kiroumaru heavily onto the target, dealing 1 instance of Incantation DMG to an area.' }],
    quote: 'Kiroumaru, stop right there! Hm? Did you just bump into something?',
    attributes: sakiriSupportRows,
    materials: sakiriSkillMaterials,
  },
]

const sakiriPassiveSkills = [
  { id: 'can-i-eat-this', name: 'Can I Eat This?', type: 'Passive', icon: 'P1', description: [{ title: 'Scorch Enhancement', text: 'Increases DoT taken by the target by 25% for each type of DoT effect while in Scorch state, up to 100%.' }], quote: "It's not time to start yet! Instead of swallowing whole... wouldn't it be better to add more ingredients?" },
  { id: 'impish-trick', name: 'Impish Trick', type: 'Passive', icon: 'P2', description: [{ title: 'Impish Trick', text: "Increases Team members' ATK, excluding Sakiri, by 30% of Sakiri's Base ATK for 20s after casting Feast of Gluttony." }], quote: 'Those on the naughty list... will be taken by ghosts... or perhaps eaten?' },
]

const sakiriAwakeningSkills = [
  { id: 'sakiri-a1', name: 'A1: Diffusive Haze', type: 'Awakening', icon: 'A1', description: [{ title: 'Diffusive Haze', text: 'Extends the immovable effect inflicted by Feast of Gluttony to 6s.' }] },
  { id: 'sakiri-a2', name: 'A2: Dextrous Separation', type: 'Awakening', icon: 'A2', description: [{ title: 'Dextrous Separation', text: 'Feast of Gluttony deals extra damage to airborne enemies, scaling with target mass and capped at 600% ATK.' }] },
  { id: 'sakiri-a3', name: 'A3: Adhesive Grip', type: 'Awakening', icon: 'A3', description: [{ title: 'Adhesive Grip', text: 'After Team members defeat enemies, Devour Whole and Feast of Gluttony damage increases for 15s by 6% per enemy, up to 60%. This count resets out of combat.' }] },
  { id: 'sakiri-a4', name: 'A4: Wishful Reliance', type: 'Awakening', icon: 'A4', description: [{ title: 'Wishful Reliance', text: "Increases Team ATK, excluding Sakiri, by 30% of Sakiri's Base ATK for 20s after casting Feast of Gluttony." }] },
  { id: 'sakiri-a5', name: 'A5: Sensory Collapse', type: 'Awakening', icon: 'A5', description: [{ title: 'Sensory Collapse', text: "Fully restores Feast of Gluttony's Ultimate Energy and resets its cooldown immediately when Devour Whole makes the target airborne." }] },
  { id: 'sakiri-a6', name: 'A6: Gluttonous Dissolution', type: 'Awakening', icon: 'A6', description: [{ title: 'Gluttonous Dissolution', text: 'Kiroumaru can devour and digest up to 3 enemies at a time in Eating Mode. Digestion time is tracked independently.' }] },
  { id: 'sakiri-r1', name: 'Insatiable Appetite', type: 'Breakthrough', icon: 'R1', description: [{ title: 'Insatiable Appetite', text: 'Increases the skill level of Kiroumaru Headbutt, Devour Whole, and Feast of Gluttony by 1.' }] },
  { id: 'sakiri-r2', name: 'Fog Penetration', type: 'Breakthrough', icon: 'R2', description: [{ title: 'Fog Penetration', text: 'For each negative effect on the target, Sakiri deals 3% increased damage, up to 12%.' }] },
  { id: 'no-work-no-reward', name: 'No Work, No Reward', type: 'Life Skill', icon: 'LS', description: [
    { title: 'Lv.1', text: 'Increases dish prices by 0.12 Fons.' },
    { title: 'Lv.2', text: 'Reduces ingredient consumption rate by 1%.' },
    { title: 'Lv.3', text: "Owner's Selection: Kiroumaru actively attacks and drives away Danzaburou." },
    { title: 'Lv.4', text: 'Reduces ingredient consumption rate by 1%.' },
    { title: 'Lv.5', text: 'Increases dish prices by 0.3 Fons when a dish contains 3 identical tags.' },
  ] },
]

export const sakiriPdfDetail = {
  rarity: 'S',
  element: 'incantation',
  arcType: 'gas',
  faction: 'Eibon Antique Shop',
  birthday: 'November 7',
  roles: ['Buff', 'Control', 'DMG Boost', 'Support'],
  tags: ['Buff', 'Control', 'DMG Boost', 'Support'],
  shortDescription: 'S-rank Incantation support who uses Kiroumaru to group, immobilize, debuff, and boost team damage.',
  profileText: 'Best guide and build for Sakiri from NTE. Sakiri is an S-rank Incantation support from Eibon Antique Shop with Gas arc compatibility, unrivaled at Eibon and as scary as she looks.',
  profile: {
    text: 'Best guide and build for Sakiri from NTE. Sakiri is an S-rank Incantation support from Eibon Antique Shop with Gas arc compatibility, unrivaled at Eibon and as scary as she looks.',
  },
  trait: {
    available: true,
    title: 'Ghost-Eater',
    text: 'Ghost-Eater / Devourer-style Esper ability tied to Kiroumaru and gravity-devouring combat actions.',
  },
  consoleTrait: {
    title: 'Type III Specialization',
    trigger: 'Each Type III module equipped',
    effect: 'Increases Incantation DMG Bonus by 9% for each Type III Module equipped.',
    statId: 'incantation_dmg_bonus',
    valuePerModule: 9,
    moduleType: 'III',
  },
  buildTraits: [
    {
      id: 'sakiri-type-iii-specialization',
      title: 'Type III Specialization',
      trigger: 'module_type_count',
      moduleType: 'III',
      stat: 'incantationDmgBonus',
      operation: 'add',
      valuePerModule: 9,
      valueType: 'percent',
      maxStacks: null,
      description: 'Increases Incantation DMG Bonus by 9% for each Type III Module equipped.',
    },
  ],
  overview: {
    blocks: [
      {
        id: 'at-a-glance',
        type: 'heroSummary',
        title: 'At a glance',
        enabled: true,
        content: 'Best guide and build for Sakiri from NTE. Sakiri is an S-rank Incantation support from Eibon Antique Shop who controls enemy position with Kiroumaru, buffs team damage, and fits especially well into DoT and Scorch-oriented teams.',
        size: 'full',
      },
      {
        id: 'profile-snapshot',
        type: 'profileGrid',
        title: 'Profile snapshot',
        enabled: true,
        rows: [
          { label: 'Rarity', value: 'S-Rank' },
          { label: 'Element', value: 'Incantation' },
          { label: 'Arc', value: 'Gas' },
          { label: 'Faction', value: 'Eibon Antique Shop' },
          { label: 'Combat Roles', value: 'Buff / Control / DMG Boost / Support' },
          { label: 'Birthday', value: 'November 7' },
          { label: 'Esper Ability', value: 'Ghost-Eater' },
        ],
      },
      {
        id: 'voice-actors',
        type: 'voiceActors',
        title: 'Voice actors',
        enabled: true,
        rows: [
          { label: 'ENG', value: 'Brianna Knickerbocker' },
          { label: 'JPN', value: '\u4f0a\u85e4\u7f8e\u6765' },
          { label: 'CN', value: '\u8521\u4e66\u747e' },
          { label: 'KR', value: '\uae40\ub098\uc728' },
        ],
      },
      {
        id: 'gameplay-identity',
        type: 'gameplaySummary',
        title: 'Gameplay identity',
        enabled: true,
        content: 'Sakiri usually swaps in, uses Devour Whole to group enemies or Feast of Gluttony to buff and debuff, then swaps out. Her basic attack devour gimmick is flavorful, but it takes too long for practical combat against many targets.',
        size: 'full',
      },
      {
        id: 'kit-focus',
        type: 'list',
        title: 'Kit focus',
        enabled: true,
        items: [
          'Pulls and groups nearby enemies with Kiroumaru.',
          'Uses Eating Mode to devour weak enemies and destroy nearby movable objects.',
          'Levitates enemies with Gravity Eater when the hold version of Devour Whole is used.',
          'Suppresses enemies with Feast of Gluttony and prevents movement for a short duration.',
          'Boosts team ATK after Feast of Gluttony through Impish Trick.',
          'Scales Incantation damage through Type III console modules.',
        ],
      },
      {
        id: 'pros',
        type: 'list',
        title: 'Strengths',
        enabled: true,
        items: [
          "Doesn't need much field time.",
          'Can group and immobilize enemies.',
          'Passive DoT buffing.',
          'Universal support with DEF debuffs and ATK buffs.',
        ],
      },
      {
        id: 'cons',
        type: 'list',
        title: 'Tradeoffs',
        enabled: true,
        items: [
          'Loses some potential outside of Scorch teams.',
          'Ultimate has high Energy cost.',
        ],
      },
      {
        id: 'review-summary',
        type: 'gameplaySummary',
        title: 'Review summary',
        enabled: true,
        content: 'Sakiri is a support character of the Incantation attribute whose strengths are grouping enemies, immobilizing them, and buffing the team. She is especially strong for teams that use DoT and is recommended for Scorch teams involving Chaos + Incantation. She can also work as a universal support thanks to her flat debuff and buff from her ultimate.',
        size: 'full',
      },
      {
        id: 'awakening-review',
        type: 'gameplaySummary',
        title: 'Awakening review',
        enabled: true,
        content: "Priority: A4 > A5 > A1 > A2 > A3 > A6. A4 is the most valuable because it turns Sakiri into a stronger buffer, adding a flat ATK buff based on 30% of Sakiri's own ATK to teammates for 20 seconds after her ultimate. A5 is situational but strong because it restores ultimate energy and resets cooldown when Devour Whole makes the target airborne. Other awakenings are less impactful, though A1 adds quality of life by extending the control duration. R1/R2 are minor damage and level bonuses.",
        size: 'full',
      },
      {
        id: 'trivia',
        type: 'loreCards',
        title: 'Kit notes',
        enabled: true,
        items: [
          'Eating Mode: Kiroumaru becomes full after reaching the digestion limit and can keep moving, but cannot continue attracting or devouring enemies.',
          'Gravity Eater: Kiroumaru bites through the ground and devours gravity in the target area.',
          'No Work, No Reward: Kiroumaru can actively drive away Danzaburou through the Owner\'s Selection life-skill upgrade.',
        ],
      },
      {
        id: 'quotes',
        type: 'quoteList',
        title: 'Quotes',
        enabled: true,
        items: [
          '"Sa... Sakiri, can I eat this?" "Moron, next time ask before you eat!"',
          '"No prey escapes before Kiroumaru has its fill."',
          '"Kiroumaru, stop right there! Hm? Did you just bump into something?"',
        ],
      },
    ],
  },
  voiceActors: [
    { lang: 'ENG', name: 'Brianna Knickerbocker' },
    { lang: 'JPN', name: '\u4f0a\u85e4\u7f8e\u6765' },
    { lang: 'CN', name: '\u8521\u4e66\u747e' },
    { lang: 'KR', name: '\uae40\ub098\uc728' },
  ],
  skills: [...sakiriSkills, ...sakiriPassiveSkills, ...sakiriAwakeningSkills],
  passives: sakiriPassiveSkills,
  awakenings: sakiriAwakeningSkills.filter((skill) => skill.type === 'Awakening'),
  resonance: sakiriAwakeningSkills.filter((skill) => skill.type === 'Breakthrough'),
  breakthroughs: sakiriAwakeningSkills.filter((skill) => skill.type === 'Breakthrough'),
  lifeSkills: [{ id: 'no-work-no-reward', name: 'No Work, No Reward', levels: sakiriAwakeningSkills.find((skill) => skill.id === 'no-work-no-reward')?.description || [] }],
  materials: {
    notes: 'Per-skill upgrade materials and breakthrough totals.',
    skillMaterials: sakiriSkillMaterials.items,
    ascension: [
      { name: 'Blurred Numeral', amount: 17, sources: ['Monster Drop (Forest Path)', 'Simulation Center'] },
      { name: 'Charging Knight Spark Plug', amount: 86, sources: ['World Boss: Torrential Void'] },
      { name: 'Unsolved Numeral', amount: 18, sources: ['Monster Drop (Forest Path)', 'Simulation Center'] },
      { name: 'Distorted Numeral', amount: 15, sources: ['Monster Drop (Forest Path)', 'Simulation Center'] },
      { name: 'Required Currency', amount: 525000 },
    ],
  },
  build: {
    recommendedWeaponIds: ['good-boys-grand-adventure'],
    recommendedWeapons: [
      {
        weaponId: 'good-boys-grand-adventure',
        priority: 1,
        label: 'Best Arc / Weapon',
        refinement: 'M1',
        note: "Sakiri's signature Arc that provides quicker ultimate generation and attack buffs for the party. This can be obtained f2p and there isn't a better alternative for Sakiri.",
      },
    ],
    recommendedCartridges: [
      {
        cartridgeId: 'speedy-hedgehog',
        rarity: 'S',
        priority: 1,
        label: 'Best in Slot',
        note: "Provides additional charge efficiency for more frequent Ultimates, and stacks another 15% attack buff onto using Sakiri's Ultimate.",
      },
      {
        cartridgeId: 'crimson-twin-butterflies',
        rarity: 'S',
        priority: 2,
        label: 'Alternative',
        note: 'Provides Sakiri with a damage boost and 36% additional attack that is likely to always be up when paired with an Incantation teammate.',
      },
    ],
    mainStats: [
      { statId: 'crit_rate', priority: 1, note: 'Crit Rate % = Crit DMG %' },
      { statId: 'crit_dmg', priority: 1, note: 'Crit Rate % = Crit DMG %' },
      { statId: 'atk_percent', priority: 2 },
      { statId: 'incantation_dmg_bonus', priority: 3 },
      { label: 'Cycle Intensity', priority: 4, note: 'Cycle Intensity = Break Intensity' },
      { statId: 'break_intensity', priority: 4, note: 'Cycle Intensity = Break Intensity' },
    ],
    subStats: [
      { statId: 'crit_dmg', priority: 1, note: 'Crit DMG % = Crit Rate %' },
      { statId: 'crit_rate', priority: 1, note: 'Crit DMG % = Crit Rate %' },
      { statId: 'atk_percent', priority: 2 },
      { statId: 'atk', priority: 3 },
      { statId: 'break_intensity', priority: 4, note: 'Break Intensity = Cycle Intensity' },
      { label: 'Cycle Intensity', priority: 4, note: 'Break Intensity = Cycle Intensity' },
    ],
    endgameStats: [
      { statId: 'hp', targetValue: '20,000+' },
      { statId: 'atk', targetValue: '2300+' },
      { statId: 'crit_rate', targetValue: '50%+' },
      { statId: 'crit_dmg', targetValue: '100%+' },
      { statId: 'break_intensity', targetValue: '50+' },
      { statId: 'dmg_bonus', label: 'Universal DMG', targetValue: '10%+' },
      { statId: 'incantation_dmg_bonus', targetValue: '54%+' },
    ],
    skillPriority: ['Ultimate', 'Passive 2', 'Skill', 'Passive 1 = Basic', 'Support Skill'],
    notes: [
      {
        id: 'sakiri-build-role',
        title: 'Build role',
        content: "Prioritize Ultimate uptime and team support value. Good Boy's Grand Adventure and Speedy Hedgehog both reinforce Sakiri's Ultimate-driven support window.",
      },
    ],
  },
  consoleSetup: {
    title: 'Type III Specialization',
    description: 'Increases Incantation DMG Bonus by 9% for each Type III Module equipped.',
    arc: "Good Boy's Grand Adventure",
    arcId: 'good-boys-grand-adventure',
    mainCartridge: 'Speedy Hedgehog',
    mainCartridgeId: 'speedy-hedgehog',
    rarityPriority: ['S', 'A', 'B'],
    trait: {
      title: 'Type III Specialization',
      description: 'Incantation DMG Bonus +9% for each Type III Module equipped.',
    },
    cartridgeEffects: [
      '(2) Charge Efficiency +12%',
      "(4) Increases all allies' ATK by 15% for 20s after the wearer casts Ultimate. Effect does not stack.",
    ],
    requiredPieces: [
      { id: 'sakiri-piece-a', label: 'Type III module', type: 'III', shapeKey: 'type-iii-horizontal', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-pink', visualGroup: 'group-pink' },
      { id: 'sakiri-piece-b', label: 'Type III module', type: 'III', shapeKey: 'type-iii-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-purple', visualGroup: 'group-purple' },
      { id: 'sakiri-piece-c', label: 'Type II module', type: 'II', shapeKey: 'type-ii-horizontal', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-blue', visualGroup: 'group-blue' },
      { id: 'sakiri-piece-d', label: 'Type II module', type: 'II', shapeKey: 'type-ii-vertical', preferredRarity: 'S', fallbackRarities: ['A', 'B'], layoutColor: 'group-green', visualGroup: 'group-green' },
    ],
    notes: [
      "Prioritize Type III modules to scale Sakiri's Incantation DMG Bonus console trait.",
      'Use Speedy Hedgehog for Charge Efficiency and the team ATK window after Ultimate.',
    ],
  },
  synergies: [
    { characterId: 'jiuyuan', name: 'Jiuyuan', role: 'Strong AoE option', notes: ['Strong AoE option due to gathering enemies with her skill. Can utilize Hexed reaction with Sakiri and increase both characters damage by 20% for the duration.'] },
    { characterId: 'nanally', name: 'Nanally', role: 'On-field DPS', notes: ["On-field DPS character who can take advantage of Sakiri's attack buff. Can utilize Hexed reaction with Sakiri and increase Nanally damage by 20% for the duration."] },
    { characterId: 'mint', name: 'Mint', role: 'On-field DPS', notes: ["On-field DPS character who can take advantage of Sakiri's attack buff and Sakiri's control windows."] },
    { characterId: 'adler', name: 'Adler', role: 'Support / utility partner', notes: ['Provides shielding and 10% Incantation DMG when shielded with all 6 Awakenings. Deals DoT damage with his skill that Sakiri buffs. Can use The Great Thief to buff break damage in Scorch team.'] },
    { characterId: 'daffodil', name: 'Daffodil', role: 'Scorch cycle partner', notes: ['Supports Scorch-oriented cycling cores where Sakiri buffs DoT damage including Scorch.'] },
  ],
  teams: [
    {
      id: 'sakiri-scorch-core',
      name: 'Scorch Team',
      tag: 'Scorch',
      type: 'DoT / support',
      members: [
        { characterId: 'sakiri', slot: 'DoT buffer', note: 'Buffs DoT damage including Scorch and supplies Ultimate support windows.' },
        { characterId: 'daffodil', slot: 'Cycle partner', note: 'Helps maintain the Scorch-oriented team rhythm.' },
        { characterId: 'adler', slot: 'Support', note: 'Adds shielding, Incantation support at A6, and DoT damage Sakiri can buff.' },
      ],
      description: 'Scorch-oriented roster core that uses Sakiri as a DoT buffer and support anchor.',
    },
    {
      id: 'sakiri-aoe-hex-core',
      name: 'AoE Hex Team',
      tag: 'Hex',
      type: 'AoE / reaction',
      members: [
        { characterId: 'sakiri', slot: 'Buffer / enabler', note: 'Groups enemies, enables Hex reaction uptime, and buffs team windows.' },
        { characterId: 'nanally', slot: 'Damage carry', note: 'Uses Hex and Sakiri attack buffs for stronger on-field windows.' },
        { characterId: 'jiuyuan', slot: 'AoE partner', note: 'Adds area pressure and can utilize Hexed reaction with Sakiri.' },
      ],
      description: 'AoE Hex core using Sakiri as a buffer and enabler. Hex affects Incantation or Anima damage and can be maintained in this style of team.',
    },
  ],
  sourceNotes: {
    importedFrom: ['H:/Cursor/NevernestDB/characters/Sakiri/date.pdf', 'C:/Users/melln/Downloads/sakiri_import_packet_v1.pdf'],
    namingConflicts: ['Kiroumaru/Kirumar/Kirumara spelling variants appear in the PDF extraction.', 'PDF text uses broken phrases including "techin mode" and "enemized enemy"; public descriptions were normalized while raw text remains internally noted.'],
    unresolvedPacketData: ['Exact console grid coordinates were not guessed.', 'Blue-haired Chaos unit and silver-haired Incantation/DoT screenshot identities were not mapped to public cards.'],
  },
  rawSourceText: {
    importedFrom: 'H:/Cursor/NevernestDB/characters/Sakiri/date.pdf',
    extractedTextPath: '.generated/pdf-extract/sakiri.txt',
    profile: 'Rarity: S-Rank; Element: Incantation; Arc: Gas; Faction: Eibon Antique Shop; Roles: Buff, Control, DMG Boost; Birthday: November 7; EN voice: Brianna Knickerbocker.',
    machineTranslationNotes: ['"techin mode"', '"enemized enemy"', '"Critical Watch: Ill-Assortment"', 'Kiroumaru/Kirumar/Kirumara variants'],
  },
  unmappedSourceData: [
    'Sakiri CN and JP voice actor fields are blank in the PDF extraction and are intentionally omitted from public UI.',
    'Blue-haired Chaos unit and silver-haired Incantation/DoT screenshot identities are kept internal until mapped to existing database IDs.',
  ],
}
