// Generated from c:\Users\melln\Downloads\nte_weapons_arcs_database_complete_v5.xlsx
// Source sheets: Weapons, Refinement, Growth. This is the central reusable Weapons / Arcs database.
// Keep visual components data-driven: character builds should reference these records by id instead of duplicating stats/effects.

/**
 * @typedef {'S' | 'A' | 'B'} WeaponRarity
 * @typedef {'Bose' | 'Gas' | 'Liquid' | 'Plasma' | 'Solid'} WeaponType
 * @typedef {'ATK' | 'ATK%' | 'HP' | 'HP%' | 'DEF' | 'DEF%' | 'CRIT Rate' | 'CRIT DMG' | 'Break Intensity' | 'Charge Efficiency' | 'Healing Bonus' | string} WeaponStatType
 * @typedef {{ level: string, atk: number, subStatType: WeaponStatType, subStatValue: string | number }} WeaponGrowthRow
 * @typedef {{ rank: 1 | 2 | 3 | 4 | 5, effect: string }} WeaponRefinementRank
 * @typedef {{
 *   id: string,
 *   slug: string,
 *   name: string,
 *   rarity: WeaponRarity,
 *   type: WeaponType,
 *   quote?: string,
 *   shortDescription?: string,
 *   mainStat: { type: 'ATK', value: number },
 *   subStat: { type: WeaponStatType, value: string | number },
 *   refinements: WeaponRefinementRank[],
 *   growthScaling: WeaponGrowthRow[],
 *   image?: string,
 *   icon?: string,
 *   recommendedCharacters?: string[],
 *   tags?: string[],
 * }} WeaponData
 */

/** @type {WeaponData[]} */
export const weapons = [
  {
    "id": "good-boys-grand-adventure",
    "slug": "good-boys-grand-adventure",
    "name": "Good Boy's Grand Adventure",
    "rarity": "S",
    "type": "Gas",
    "quote": "What do you see? A winged white wolf? An adorable white dog? Or perhaps...?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 474
    },
    "subStat": {
      "type": "ATK%",
      "value": "45%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increase Charge Efficiency by 18%. Increase Team ATK by 10% for 20s after the wearer casts an Ultimate. Increase Team ATK by an additional 6% if enemies are controlled by the Ultimate. Effects with the same name do not stack."
      },
      {
        "rank": 2,
        "effect": "Increase Charge Efficiency by 21%. Increase Team ATK by 11.5% for 20s after the wearer casts an Ultimate. Increase Team ATK by an additional 7% if enemies are controlled by the Ultimate. Effects with the same name do not stack."
      },
      {
        "rank": 3,
        "effect": "Increase Charge Efficiency by 24%. Increase Team ATK by 13% for 20s after the wearer casts an Ultimate. Increase Team ATK by an additional 8% if enemies are controlled by the Ultimate. Effects with the same name do not stack."
      },
      {
        "rank": 4,
        "effect": "Increase Charge Efficiency by 27%. Increase Team ATK by 14.5% for 20s after the wearer casts an Ultimate. Increase Team ATK by an additional 9% if enemies are controlled by the Ultimate. Effects with the same name do not stack."
      },
      {
        "rank": 5,
        "effect": "Increase Charge Efficiency by 30%. Increase Team ATK by 16% for 20s after the wearer casts an Ultimate. Increase Team ATK by an additional 10% if enemies are controlled by the Ultimate. Effects with the same name do not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "ATK%",
        "subStatValue": "22.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "ATK%",
        "subStatValue": "27%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "ATK%",
        "subStatValue": "31.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "ATK%",
        "subStatValue": "36%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "ATK%",
        "subStatValue": "40.5%"
      },
      {
        "level": "70",
        "atk": 434,
        "subStatType": "ATK%",
        "subStatValue": "45%"
      },
      {
        "level": "80",
        "atk": 474,
        "subStatType": "ATK%",
        "subStatValue": "45%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "camellia-society",
    "slug": "camellia-society",
    "name": "Camellia Society",
    "rarity": "S",
    "type": "Bose",
    "quote": "Though I'm not supposed to let my composure slip onto the petals... that flower really cut deep.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 666
    },
    "subStat": {
      "type": "CRIT Rate",
      "value": "12%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases CRIT DMG by 12% for 5s when the wearer's HP is reduced without taking damage, up to 4 stacks. Unlocks Arc: Silent Garden. Consumes 5% of current HP and randomly performs one attack (CD 25s): Harsh Rebuke deals 5 instances of Incantation DMG of 24% ATK; Incessant Nagging deals 6 instances of Incantation DMG of 18% ATK; final instance deals double damage."
      },
      {
        "rank": 2,
        "effect": "Increases CRIT DMG by 14% for 5s; Harsh Rebuke 28% ATK; Incessant Nagging 21% ATK."
      },
      {
        "rank": 3,
        "effect": "Increases CRIT DMG by 16% for 5s; Harsh Rebuke 32% ATK; Incessant Nagging 24% ATK."
      },
      {
        "rank": 4,
        "effect": "Increases CRIT DMG by 18% for 5s; Harsh Rebuke 36% ATK; Incessant Nagging 27% ATK."
      },
      {
        "rank": 5,
        "effect": "Increases CRIT DMG by 20% for 5s; Harsh Rebuke 40% ATK; Incessant Nagging 30% ATK."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 43,
        "subStatType": "CRIT Rate",
        "subStatValue": "4.8%"
      },
      {
        "level": "10",
        "atk": 93,
        "subStatType": "CRIT Rate",
        "subStatValue": "4.8%"
      },
      {
        "level": "20",
        "atk": 178,
        "subStatType": "CRIT Rate",
        "subStatValue": "6%"
      },
      {
        "level": "30",
        "atk": 265,
        "subStatType": "CRIT Rate",
        "subStatValue": "7.2%"
      },
      {
        "level": "40",
        "atk": 351,
        "subStatType": "CRIT Rate",
        "subStatValue": "8.4%"
      },
      {
        "level": "50",
        "atk": 438,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.6%"
      },
      {
        "level": "60",
        "atk": 524,
        "subStatType": "CRIT Rate",
        "subStatValue": "10.8%"
      },
      {
        "level": "70",
        "atk": 611,
        "subStatType": "CRIT Rate",
        "subStatValue": "12%"
      },
      {
        "level": "80",
        "atk": 666,
        "subStatType": "CRIT Rate",
        "subStatValue": "12%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "day-off",
    "slug": "day-off",
    "name": "Day Off",
    "rarity": "S",
    "type": "Solid",
    "quote": "Eclipse said, 'Let there be double days off.' And thus, the double days off came into being (Eclipse Exclusive Edition).",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "Charge Efficiency",
      "value": "33%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's ATK by 30%. Unlocks Arc: Eclipse. Arc: Eclipse creates a 40s Eclipse. During the Eclipse, each enemy defeated restores 6 Ultimate Energy, up to 5 times. Cooldown: 300s."
      },
      {
        "rank": 2,
        "effect": "Increases wearer's ATK by 35%. Enemy defeated restores 7 Ultimate Energy."
      },
      {
        "rank": 3,
        "effect": "Increases wearer's ATK by 40%. Enemy defeated restores 8 Ultimate Energy."
      },
      {
        "rank": 4,
        "effect": "Increases wearer's ATK by 45%. Enemy defeated restores 9 Ultimate Energy."
      },
      {
        "rank": 5,
        "effect": "Increases wearer's ATK by 50%. Enemy defeated restores 10 Ultimate Energy."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "Charge Efficiency",
        "subStatValue": "13.2%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "Charge Efficiency",
        "subStatValue": "13.2%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "Charge Efficiency",
        "subStatValue": "16.5%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "Charge Efficiency",
        "subStatValue": "19.8%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "Charge Efficiency",
        "subStatValue": "23.1%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "Charge Efficiency",
        "subStatValue": "26.4%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "Charge Efficiency",
        "subStatValue": "29.7%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "Charge Efficiency",
        "subStatValue": "33%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "Charge Efficiency",
        "subStatValue": "33%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "ready-ready",
    "slug": "ready-ready",
    "name": "Ready-Ready",
    "rarity": "S",
    "type": "Plasma",
    "quote": "Hold me close, embrace the courage and resolve that transcends the fallen—I salute you, great Tiger warriors.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 570
    },
    "subStat": {
      "type": "CRIT Rate",
      "value": "24%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 15%. Increases Basic Attack and Critical Riposte damage by 15% for 15s when casting a Redirect Skill or Ultimate, up to 2 stacks. Grants Left/Right Tiger Talisman; unlocks Commander Tiger Talisman if the other talisman is gained within 15s. Commander Tiger Talisman increases damage to Bosses by 10% for 10s."
      },
      {
        "rank": 2,
        "effect": "Increases ATK and Basic/Critical Riposte damage by 18.8%; boss damage 12.5%."
      },
      {
        "rank": 3,
        "effect": "Increases ATK and Basic/Critical Riposte damage by 22.5%; boss damage 15%."
      },
      {
        "rank": 4,
        "effect": "Increases ATK and Basic/Critical Riposte damage by 26.2%; boss damage 17.5%."
      },
      {
        "rank": 5,
        "effect": "Increases ATK and Basic/Critical Riposte damage by 30%; boss damage 20%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 37,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.6%"
      },
      {
        "level": "10",
        "atk": 80,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.6%"
      },
      {
        "level": "20",
        "atk": 154,
        "subStatType": "CRIT Rate",
        "subStatValue": "12%"
      },
      {
        "level": "30",
        "atk": 227,
        "subStatType": "CRIT Rate",
        "subStatValue": "14.4%"
      },
      {
        "level": "40",
        "atk": 301,
        "subStatType": "CRIT Rate",
        "subStatValue": "16.8%"
      },
      {
        "level": "50",
        "atk": 374,
        "subStatType": "CRIT Rate",
        "subStatValue": "19.2%"
      },
      {
        "level": "60",
        "atk": 448,
        "subStatType": "CRIT Rate",
        "subStatValue": "21.6%"
      },
      {
        "level": "70",
        "atk": 522,
        "subStatType": "CRIT Rate",
        "subStatValue": "24%"
      },
      {
        "level": "80",
        "atk": 570,
        "subStatType": "CRIT Rate",
        "subStatValue": "24%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "raging-flames",
    "slug": "raging-flames",
    "name": "Raging Flames",
    "rarity": "S",
    "type": "Plasma",
    "quote": "The desire for speed flows through my veins, the roar of engines thunders in my chest! Come on, let's go! Step onto this racetrack where we pledge our souls!",
    "shortDescription": "Growth table screenshot shows '-' for sub-stat levels; lv80 metric still shows CRIT DMG 24%.",
    "mainStat": {
      "type": "ATK",
      "value": 481
    },
    "subStat": {
      "type": "CRIT DMG",
      "value": "24%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's Redirect Skill DMG by 22.5% for 10s after casting Ultimate. Increases wearer's Redirect Skill DMG by 15% per cast while active, up to 2 stacks."
      },
      {
        "rank": 2,
        "effect": "Increases Redirect Skill DMG by 26.2%; per cast bonus 17.5%."
      },
      {
        "rank": 3,
        "effect": "Increases Redirect Skill DMG by 30%; per cast bonus 20%."
      },
      {
        "rank": 4,
        "effect": "Increases Redirect Skill DMG by 33.8%; per cast bonus 22.5%."
      },
      {
        "rank": 5,
        "effect": "Increases Redirect Skill DMG by 37.5%; per cast bonus 25%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 43,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "10",
        "atk": 93,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "20",
        "atk": 148,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "30",
        "atk": 204,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "40",
        "atk": 259,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "50",
        "atk": 315,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "60",
        "atk": 370,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "70",
        "atk": 426,
        "subStatType": "CRIT DMG",
        "subStatValue": ""
      },
      {
        "level": "80",
        "atk": 481,
        "subStatType": "CRIT DMG",
        "subStatValue": "24%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "blow-up-the-crowd",
    "slug": "blow-up-the-crowd",
    "name": "Blow up the Crowd",
    "rarity": "S",
    "type": "Solid",
    "quote": "Shh... It's coming, it's coming! IT'S COMING!!!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases the active character's ATK by 10% while the wearer is off-field, and by 2% when the wearer deals damage, up to 4 stacks, triggering at most once every 2s. Resets when the wearer becomes active. Increases Psyche DMG by 12% while the wearer is active, and Psyche DMG by 2% when dealing Psyche DMG with a Basic Attack, up to 10 stacks. Triggers at most once every 0.3s. Resets when switching characters."
      },
      {
        "rank": 2,
        "effect": "Active character ATK 11%; stack ATK/Psyche DMG 2.3%; Psyche DMG 14%."
      },
      {
        "rank": 3,
        "effect": "Active character ATK 12%; stack ATK/Psyche DMG 2.6%; Psyche DMG 16%."
      },
      {
        "rank": 4,
        "effect": "Active character ATK 13%; stack ATK/Psyche DMG 2.9%; Psyche DMG 18%."
      },
      {
        "rank": 5,
        "effect": "Active character ATK 14%; stack ATK/Psyche DMG 3.2%; Psyche DMG 20%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "youthful-fantasy",
    "slug": "youthful-fantasy",
    "name": "Youthful Fantasy",
    "rarity": "S",
    "type": "Liquid",
    "quote": "Secret ... The moment it was recorded, it was already known by everyone.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 570
    },
    "subStat": {
      "type": "ATK%",
      "value": "30%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Break Intensity by 60. Seals Arc: Black Tome with two chains by default. Unleashes 1 chain each time any character on the team casts a Support Skill. Makes Arc: Black Tome available when all two chains are unleashed. Arc: Black Tome summons Black Tome for 20s, designates an enemy every 5s, increases wearer's Chaos DMG dealt to designated enemies by 20%, and deals Chaos DMG equal to 200% of wearer's ATK to designated enemies when they take Break Damage."
      },
      {
        "rank": 2,
        "effect": "Break Intensity 67; Chaos DMG 24%; Chaos hit 230% ATK."
      },
      {
        "rank": 3,
        "effect": "Break Intensity 74; Chaos DMG 28%; Chaos hit 260% ATK."
      },
      {
        "rank": 4,
        "effect": "Break Intensity 81; Chaos DMG 32%; Chaos hit 290% ATK."
      },
      {
        "rank": 5,
        "effect": "Break Intensity 88; Chaos DMG 36%; Chaos hit 320% ATK."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 37,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "10",
        "atk": 80,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "20",
        "atk": 154,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "30",
        "atk": 227,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "40",
        "atk": 301,
        "subStatType": "ATK%",
        "subStatValue": "21%"
      },
      {
        "level": "50",
        "atk": 374,
        "subStatType": "ATK%",
        "subStatValue": "24%"
      },
      {
        "level": "60",
        "atk": 448,
        "subStatType": "ATK%",
        "subStatValue": "27%"
      },
      {
        "level": "70",
        "atk": 522,
        "subStatType": "ATK%",
        "subStatValue": "30%"
      },
      {
        "level": "80",
        "atk": 570,
        "subStatType": "ATK%",
        "subStatValue": "30%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "eternal-waltz",
    "slug": "eternal-waltz",
    "name": "Eternal Waltz",
    "rarity": "S",
    "type": "Bose",
    "quote": "Dance to the beat, feel the dizzying sensation as if the world is ending, until forever!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 424
    },
    "subStat": {
      "type": "HP%",
      "value": "41.2%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Max HP by 20%. Increases Mental DMG dealt by 10% for 10s after the wearer casts an Ultimate."
      },
      {
        "rank": 2,
        "effect": "Increases Max HP by 23%. Mental DMG 12%."
      },
      {
        "rank": 3,
        "effect": "Increases Max HP by 26%. Mental DMG 14%."
      },
      {
        "rank": 4,
        "effect": "Increases Max HP by 29%. Mental DMG 16%."
      },
      {
        "rank": 5,
        "effect": "Increases Max HP by 32%. Mental DMG 18%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 28,
        "subStatType": "HP%",
        "subStatValue": "16.5%"
      },
      {
        "level": "10",
        "atk": 60,
        "subStatType": "HP%",
        "subStatValue": "16.5%"
      },
      {
        "level": "20",
        "atk": 114,
        "subStatType": "HP%",
        "subStatValue": "20.6%"
      },
      {
        "level": "30",
        "atk": 168,
        "subStatType": "HP%",
        "subStatValue": "24.8%"
      },
      {
        "level": "40",
        "atk": 223,
        "subStatType": "HP%",
        "subStatValue": "28.9%"
      },
      {
        "level": "50",
        "atk": 278,
        "subStatType": "HP%",
        "subStatValue": "33%"
      },
      {
        "level": "60",
        "atk": 333,
        "subStatType": "HP%",
        "subStatValue": "37.1%"
      },
      {
        "level": "70",
        "atk": 388,
        "subStatType": "HP%",
        "subStatValue": "41.2%"
      },
      {
        "level": "80",
        "atk": 424,
        "subStatType": "HP%",
        "subStatValue": "41.2%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "contemplative-cat",
    "slug": "contemplative-cat",
    "name": "Contemplative Cat",
    "rarity": "S",
    "type": "Gas",
    "quote": "The meaning of life... the reason for existence... the answer to the universe is... 4... balls of yarn!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "CRIT DMG",
      "value": "44%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Cosmos DMG by 2.5% for every 100000 Fons the wearer holds, up to 10 stacks."
      },
      {
        "rank": 2,
        "effect": "Increases Cosmos DMG by 3% per 100000 Fons."
      },
      {
        "rank": 3,
        "effect": "Increases Cosmos DMG by 3.5% per 100000 Fons."
      },
      {
        "rank": 4,
        "effect": "Increases Cosmos DMG by 4% per 100000 Fons."
      },
      {
        "rank": 5,
        "effect": "Increases Cosmos DMG by 4.5% per 100000 Fons."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "CRIT DMG",
        "subStatValue": "17.6%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "CRIT DMG",
        "subStatValue": "17.6%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "CRIT DMG",
        "subStatValue": "22%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "CRIT DMG",
        "subStatValue": "26.4%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "CRIT DMG",
        "subStatValue": "30.8%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "CRIT DMG",
        "subStatValue": "35.2%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "CRIT DMG",
        "subStatValue": "39.6%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "CRIT DMG",
        "subStatValue": "44%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "CRIT DMG",
        "subStatValue": "44%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "hethereaus-keeper",
    "slug": "hethereaus-keeper",
    "name": "Hethereau's Keeper",
    "rarity": "S",
    "type": "Solid",
    "quote": "Once again, another day has passed peacefully. Hats off to Officer Whisker!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 15%. Increases damage dealt to Bosses by 15%. Unlocks Arc: Officer Whisker. Officer Whisker summons Officer Whisker to assist in combat; Officer Whisker continuously attacks enemies, dealing 100% of wearer's ATK as damage per hit. Lasts 30s. Cooldown: 60s."
      },
      {
        "rank": 2,
        "effect": "ATK 17.5%; Boss damage 17.5%; Officer Whisker 125% ATK."
      },
      {
        "rank": 3,
        "effect": "ATK 20%; Boss damage 20%; Officer Whisker 150% ATK."
      },
      {
        "rank": 4,
        "effect": "ATK 22.5%; Boss damage 22.5%; Officer Whisker 175% ATK."
      },
      {
        "rank": 5,
        "effect": "ATK 25%; Boss damage 25%; Officer Whisker 200% ATK."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "your-happiness-is-priceless",
    "slug": "your-happiness-is-priceless",
    "name": "Your Happiness is Priceless",
    "rarity": "S",
    "type": "Solid",
    "quote": "Mm, mm-hmm, mm-hmm-hmm-hmm-hmm-hmm! (Give me Fons — You'll be happy, and I'll be happy too!)",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "DEF%",
      "value": "38.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases HP by 24%. Grants one random effect when wearer casts an Ultimate: 1) recovers 20% Max HP for the team member with the lowest HP percentage; 2) grants a shield equal to 20% of wearer's Max HP for 15s; 3) recovers 10% HP for all team members. Triggers once every 30s."
      },
      {
        "rank": 2,
        "effect": "HP 28%; recover/shield 25%; team HP recovery 12.5%."
      },
      {
        "rank": 3,
        "effect": "HP 32%; recover/shield 30%; team HP recovery 15%."
      },
      {
        "rank": 4,
        "effect": "HP 36%; recover/shield 35%; team HP recovery 17.5%."
      },
      {
        "rank": 5,
        "effect": "HP 40%; recover/shield 40%; team HP recovery 20%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "DEF%",
        "subStatValue": "15.4%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "DEF%",
        "subStatValue": "15.4%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "DEF%",
        "subStatValue": "19.2%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "DEF%",
        "subStatValue": "23.1%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "DEF%",
        "subStatValue": "27%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "DEF%",
        "subStatValue": "30.8%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "DEF%",
        "subStatValue": "34.6%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "DEF%",
        "subStatValue": "38.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "DEF%",
        "subStatValue": "38.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "fluff-of-fortitude",
    "slug": "fluff-of-fortitude",
    "name": "Fluff of Fortitude",
    "rarity": "S",
    "type": "Plasma",
    "quote": "Hunter Guild Commemorative Arc: So fluffy!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases the wearer's DMG by 22%. Increases this effect to 28% against enemies with HP below 50%."
      },
      {
        "rank": 2,
        "effect": "Wearer's DMG 26%; below-50% effect 34%."
      },
      {
        "rank": 3,
        "effect": "Wearer's DMG 30%; below-50% effect 40%."
      },
      {
        "rank": 4,
        "effect": "Wearer's DMG 34%; below-50% effect 46%."
      },
      {
        "rank": 5,
        "effect": "Wearer's DMG 38%; below-50% effect 52%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "fluff-of-ferocity",
    "slug": "fluff-of-ferocity",
    "name": "Fluff of Ferocity",
    "rarity": "S",
    "type": "Bose",
    "quote": "Hunter Guild Commemorative Arc: Discard all that is useless...",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's CRIT DMG by 4% for 10s after landing a critical hit, up to 10 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 2,
        "effect": "Increases wearer's CRIT DMG by 4.8% for 10s after landing a critical hit, up to 10 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 3,
        "effect": "Increases wearer's CRIT DMG by 5.6% for 10s after landing a critical hit, up to 10 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 4,
        "effect": "Increases wearer's CRIT DMG by 6.4% for 10s after landing a critical hit, up to 10 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 5,
        "effect": "Increases wearer's CRIT DMG by 7.2% for 10s after landing a critical hit, up to 10 stacks. Resets the duration when triggered again."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "fluff-of-finesse",
    "slug": "fluff-of-finesse",
    "name": "Fluff of Finesse",
    "rarity": "S",
    "type": "Gas",
    "quote": "Hunter Guild Commemorative Arc: Not every encounter is a pleasant one...",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's damage by 8% for 10s after performing a Critical Dodge, up to 3 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 2,
        "effect": "Increases wearer's damage by 9.6% for 10s after performing a Critical Dodge, up to 3 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 3,
        "effect": "Increases wearer's damage by 11.2% for 10s after performing a Critical Dodge, up to 3 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 4,
        "effect": "Increases wearer's damage by 12.8% for 10s after performing a Critical Dodge, up to 3 stacks. Resets the duration when triggered again."
      },
      {
        "rank": 5,
        "effect": "Increases wearer's damage by 14.4% for 10s after performing a Critical Dodge, up to 3 stacks. Resets the duration when triggered again."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "fluff-of-fleetness",
    "slug": "fluff-of-fleetness",
    "name": "Fluff of Fleetness",
    "rarity": "S",
    "type": "Liquid",
    "quote": "Hunter Guild Commemorative Arc: MAD FLUFF!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "CRIT DMG",
      "value": "44%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases 5% ATK every 1s while the wearer is the active character, up to 5 stacks. Resets when the wearer leaves the field."
      },
      {
        "rank": 2,
        "effect": "Increases 6% ATK every 1s while the wearer is the active character, up to 5 stacks. Resets when the wearer leaves the field."
      },
      {
        "rank": 3,
        "effect": "Increases 7% ATK every 1s while the wearer is the active character, up to 5 stacks. Resets when the wearer leaves the field."
      },
      {
        "rank": 4,
        "effect": "Increases 8% ATK every 1s while the wearer is the active character, up to 5 stacks. Resets when the wearer leaves the field."
      },
      {
        "rank": 5,
        "effect": "Increases 9% ATK every 1s while the wearer is the active character, up to 5 stacks. Resets when the wearer leaves the field."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "CRIT DMG",
        "subStatValue": "17.6%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "CRIT DMG",
        "subStatValue": "17.6%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "CRIT DMG",
        "subStatValue": "22%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "CRIT DMG",
        "subStatValue": "26.4%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "CRIT DMG",
        "subStatValue": "30.8%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "CRIT DMG",
        "subStatValue": "35.2%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "CRIT DMG",
        "subStatValue": "39.6%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "CRIT DMG",
        "subStatValue": "44%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "CRIT DMG",
        "subStatValue": "44%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "fluff-of-fearlessness",
    "slug": "fluff-of-fearlessness",
    "name": "Fluff of Fearlessness",
    "rarity": "S",
    "type": "Solid",
    "quote": "Hunter Guild Commemorative Arc: Cool fluffs don't look at explosions.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "CRIT Rate",
      "value": "22%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 25% for 10s after the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 30% for 10s after the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 35% for 10s after the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 40% for 10s after the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 45% for 10s after the wearer casts an Ultimate. Effect does not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "CRIT Rate",
        "subStatValue": "8.8%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "CRIT Rate",
        "subStatValue": "8.8%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "CRIT Rate",
        "subStatValue": "11%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "CRIT Rate",
        "subStatValue": "13.2%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "CRIT Rate",
        "subStatValue": "15.4%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "CRIT Rate",
        "subStatValue": "17.6%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "CRIT Rate",
        "subStatValue": "19.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "CRIT Rate",
        "subStatValue": "22%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "CRIT Rate",
        "subStatValue": "22%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "reality-refuge",
    "slug": "reality-refuge",
    "name": "Reality Refuge",
    "rarity": "S",
    "type": "Solid",
    "quote": "She told me that I was only ever a butterfly.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 570
    },
    "subStat": {
      "type": "ATK%",
      "value": "30%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Anima DMG by 15%. Increases the wearer's Attachment DMG by 10%. Increases the Attachment DMG bonus to 20% for 6s when the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 2,
        "effect": "Increases Anima DMG by 17.5%. Increases the wearer's Attachment DMG by 11.2%. Increases the Attachment DMG bonus to 22.5% for 6s when the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 3,
        "effect": "Increases Anima DMG by 20%. Increases the wearer's Attachment DMG by 12.5%. Increases the Attachment DMG bonus to 25% for 6s when the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 4,
        "effect": "Increases Anima DMG by 22.5%. Increases the wearer's Attachment DMG by 13.8%. Increases the Attachment DMG bonus to 27.5% for 6s when the wearer casts an Ultimate. Effect does not stack."
      },
      {
        "rank": 5,
        "effect": "Increases Anima DMG by 25%. Increases the wearer's Attachment DMG by 15%. Increases the Attachment DMG bonus to 30% for 6s when the wearer casts an Ultimate. Effect does not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 37,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "10",
        "atk": 80,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "20",
        "atk": 154,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "30",
        "atk": 227,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "40",
        "atk": 301,
        "subStatType": "ATK%",
        "subStatValue": "21%"
      },
      {
        "level": "50",
        "atk": 374,
        "subStatType": "ATK%",
        "subStatValue": "24%"
      },
      {
        "level": "60",
        "atk": 448,
        "subStatType": "ATK%",
        "subStatValue": "27%"
      },
      {
        "level": "70",
        "atk": 522,
        "subStatType": "ATK%",
        "subStatValue": "30%"
      },
      {
        "level": "80",
        "atk": 570,
        "subStatType": "ATK%",
        "subStatValue": "30%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "tears-beneath-the-mask",
    "slug": "tears-beneath-the-mask",
    "name": "Tears Beneath the Mask",
    "rarity": "S",
    "type": "Gas",
    "quote": "Who stole my child? Was it you? Was it him? Or was it...",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Applies Warning Gaze on enemies hit by the wearer's Ultimate. Marked enemies deal 18% reduced damage for 20s. Effect does not stack."
      },
      {
        "rank": 2,
        "effect": "Applies Warning Gaze on enemies hit by the wearer's Ultimate. Marked enemies deal 21% reduced damage for 20s. Effect does not stack."
      },
      {
        "rank": 3,
        "effect": "Inflicts Warning Gaze on enemies hit by the wearer's Ultimate. Marked enemies deal 24% reduced damage for 20s. Effect does not stack."
      },
      {
        "rank": 4,
        "effect": "Applies Warning Gaze on enemies hit by the wearer's Ultimate. Marked enemies deal 27% reduced damage for 20s. Effect does not stack."
      },
      {
        "rank": 5,
        "effect": "Applies Warning Gaze on enemies hit by the wearer's Ultimate. Marked enemies deal 30% reduced damage for 20s. Effect does not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "song-of-the-whale",
    "slug": "song-of-the-whale",
    "name": "Song of the Whale",
    "rarity": "S",
    "type": "Plasma",
    "quote": "The surging tide is its final farewell.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 512
    },
    "subStat": {
      "type": "ATK%",
      "value": "27.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 12%. Increases the wearer's damage to Broken enemies by 12%. Restores 30% HP to the wearer if a Broken enemy is defeated. Triggers at most once every 30s."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 14%. Increases the wearer's damage to Broken enemies by 14%. Restores 30% HP to the wearer if a Broken enemy is defeated. Triggers at most once every 30s."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 16%. Increases the wearer's damage to Broken enemies by 16%. Restores 30% HP to the wearer if a Broken enemy is defeated. Triggers at most once every 30s."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 18%. Increases the wearer's damage to Broken enemies by 18%. Restores 30% HP to the wearer if a Broken enemy is defeated. Triggers at most once every 30s."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 20%. Increases the wearer's damage to Broken enemies by 20%. Restores 30% HP to the wearer if a Broken enemy is defeated. Triggers at most once every 30s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 33,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "10",
        "atk": 73,
        "subStatType": "ATK%",
        "subStatValue": "11%"
      },
      {
        "level": "20",
        "atk": 137,
        "subStatType": "ATK%",
        "subStatValue": "13.8%"
      },
      {
        "level": "30",
        "atk": 203,
        "subStatType": "ATK%",
        "subStatValue": "16.5%"
      },
      {
        "level": "40",
        "atk": 269,
        "subStatType": "ATK%",
        "subStatValue": "19.2%"
      },
      {
        "level": "50",
        "atk": 336,
        "subStatType": "ATK%",
        "subStatValue": "22%"
      },
      {
        "level": "60",
        "atk": 402,
        "subStatType": "ATK%",
        "subStatValue": "24.8%"
      },
      {
        "level": "70",
        "atk": 469,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      },
      {
        "level": "80",
        "atk": 512,
        "subStatType": "ATK%",
        "subStatValue": "27.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "marching-beyond-time",
    "slug": "marching-beyond-time",
    "name": "Marching Beyond Time",
    "rarity": "S",
    "type": "Solid",
    "quote": "We press on, lest we rust away to nothing.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 570
    },
    "subStat": {
      "type": "CRIT Rate",
      "value": "24%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 16%. Grants 1 stack of Hourglass per second, up to 15 stacks, after casting a Redirect Skill. Consumes all Hourglass stacks when casting an Ultimate and dealing Cosmos DMG. Increases the wearer's Ultimate CRIT DMG by 3% per stack. Grants an additional 12% DEF Ignore for 3s when 15 stacks are consumed at once."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 20%. Grants 1 stack of Hourglass per second, up to 15 stacks, after casting a Redirect Skill. Consumes all Hourglass stacks when casting an Ultimate and dealing Cosmos DMG. Increases the wearer's Ultimate CRIT DMG by 3.8% per stack. Grants an additional 15% DEF Ignore for 3s when 15 stacks are consumed at once."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 24%. Grants 1 stack of Hourglass per second, up to 15 stacks, after casting a Redirect Skill. Consumes all Hourglass stacks when casting an Ultimate and dealing Cosmos DMG. Increases the wearer's Ultimate CRIT DMG by 4.5% per stack. Grants an additional 18% DEF Ignore for 3s when 15 stacks are consumed at once."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 28%. Grants 1 stack of Hourglass per second, up to 15 stacks, after casting a Redirect Skill. Consumes all Hourglass stacks when casting an Ultimate and dealing Cosmos DMG. Increases the wearer's Ultimate CRIT DMG by 5.2% per stack. Grants an additional 21% DEF Ignore for 3s when 15 stacks are consumed at once."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 32%. Grants 1 stack of Hourglass per second, up to 15 stacks, after casting a Redirect Skill. Consumes all Hourglass stacks when casting an Ultimate and dealing Cosmos DMG. Increases the wearer's Ultimate CRIT DMG by 6% per stack. Grants an additional 24% DEF Ignore for 3s when 15 stacks are consumed at once."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 37,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.6%"
      },
      {
        "level": "10",
        "atk": 80,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.6%"
      },
      {
        "level": "20",
        "atk": 154,
        "subStatType": "CRIT Rate",
        "subStatValue": "12%"
      },
      {
        "level": "30",
        "atk": 227,
        "subStatType": "CRIT Rate",
        "subStatValue": "14.4%"
      },
      {
        "level": "40",
        "atk": 301,
        "subStatType": "CRIT Rate",
        "subStatValue": "16.8%"
      },
      {
        "level": "50",
        "atk": 374,
        "subStatType": "CRIT Rate",
        "subStatValue": "19.2%"
      },
      {
        "level": "60",
        "atk": 448,
        "subStatType": "CRIT Rate",
        "subStatValue": "21.6%"
      },
      {
        "level": "70",
        "atk": 522,
        "subStatType": "CRIT Rate",
        "subStatValue": "24%"
      },
      {
        "level": "80",
        "atk": 570,
        "subStatType": "CRIT Rate",
        "subStatValue": "24%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "the-last-rose",
    "slug": "the-last-rose",
    "name": "The Last Rose",
    "rarity": "S",
    "type": "Liquid",
    "quote": "On the water's surface, the last rose blooms alone. She waits... for a dear friend, or perhaps for a boundless dream.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 570
    },
    "subStat": {
      "type": "CRIT Rate",
      "value": "24%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 14%. Grants 1 stack of Chaos Thorn each time the wearer deals DoT. Increases CRIT DMG by 6% per stack for 3s. Triggers at most once every 0.3s, up to 10 stacks and refreshes the duration when retriggered. Grants 10 stacks of Chaos Thorn immediately when the wearer casts a Redirect Skill. Extends the Broken state of a Broken enemy by 3s when the wearer deals damage to them (triggers at most once per Break Effect)."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 17.5%. Grants 1 stack of Chaos Thorn each time the wearer deals DoT. Increases CRIT DMG by 7.5% per stack for 3s. Triggers at most once every 0.3s, up to 10 stacks and refreshes the duration when retriggered. Grants 10 stacks of Chaos Thorn immediately when the wearer casts a Redirect Skill. Extends the Broken state of a Broken enemy by 3s when the wearer deals damage to them (triggers at most once per Break Effect)."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 21%. Grants 1 stack of Chaos Thorn each time the wearer deals DoT. Increases CRIT DMG by 9% per stack for 3s. Triggers at most once every 0.3s, up to 10 stacks and refreshes the duration when retriggered. Grants 10 stacks of Chaos Thorn immediately when the wearer casts a Redirect Skill. Extends the Broken state of a Broken enemy by 3s when the wearer deals damage to them (triggers at most once per Break Effect)."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 24.5%. Grants 1 stack of Chaos Thorn each time the wearer deals DoT. Increases CRIT DMG by 10.5% per stack for 3s. Triggers at most once every 0.3s, up to 10 stacks and refreshes the duration when retriggered. Grants 10 stacks of Chaos Thorn immediately when the wearer casts a Redirect Skill. Extends the Broken state of a Broken enemy by 3s when the wearer deals damage to them (triggers at most once per Break Effect)."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 28%. Grants 1 stack of Chaos Thorn each time the wearer deals DoT. Increases CRIT DMG by 12% per stack for 3s. Triggers at most once every 0.3s, up to 10 stacks and refreshes the duration when retriggered. Grants 10 stacks of Chaos Thorn immediately when the wearer casts a Redirect Skill. Extends the Broken state of a Broken enemy by 3s when the wearer deals damage to them (triggers at most once per Break Effect)."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 37,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.5%"
      },
      {
        "level": "10",
        "atk": 80,
        "subStatType": "CRIT Rate",
        "subStatValue": "9.5%"
      },
      {
        "level": "20",
        "atk": 154,
        "subStatType": "CRIT Rate",
        "subStatValue": "12%"
      },
      {
        "level": "30",
        "atk": 227,
        "subStatType": "CRIT Rate",
        "subStatValue": "14.4%"
      },
      {
        "level": "40",
        "atk": 301,
        "subStatType": "CRIT Rate",
        "subStatValue": "16.8%"
      },
      {
        "level": "50",
        "atk": 374,
        "subStatType": "CRIT Rate",
        "subStatValue": "19.2%"
      },
      {
        "level": "60",
        "atk": 448,
        "subStatType": "CRIT Rate",
        "subStatValue": "21.6%"
      },
      {
        "level": "70",
        "atk": 522,
        "subStatType": "CRIT Rate",
        "subStatValue": "24%"
      },
      {
        "level": "80",
        "atk": 570,
        "subStatType": "CRIT Rate",
        "subStatValue": "24%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "umbrella",
    "slug": "umbrella",
    "name": "Umbrella",
    "rarity": "A",
    "type": "Bose",
    "quote": "Remember to get enough sleep and check the weather forecast; remember to eat your meals and take an umbrella when going out.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 395
    },
    "subStat": {
      "type": "DEF",
      "value": "52.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases HP by 10%. Strengthens shields by 10% while the wearer's HP is above 50%."
      },
      {
        "rank": 2,
        "effect": "Increases HP by 12%. Strengthens shields by 12% while the wearer's HP is above 50%."
      },
      {
        "rank": 3,
        "effect": "Increases HP by 14%. Strengthens shields by 14% while the wearer's HP is above 50%."
      },
      {
        "rank": 4,
        "effect": "Increases HP by 16%. Strengthens shields by 16% while the wearer's HP is above 50%."
      },
      {
        "rank": 5,
        "effect": "Increases HP by 18%. Strengthens shields by 18% while the wearer's HP is above 50%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 25,
        "subStatType": "DEF",
        "subStatValue": "21%"
      },
      {
        "level": "10",
        "atk": 55,
        "subStatType": "DEF",
        "subStatValue": "21%"
      },
      {
        "level": "20",
        "atk": 106,
        "subStatType": "DEF",
        "subStatValue": "26.2%"
      },
      {
        "level": "30",
        "atk": 157,
        "subStatType": "DEF",
        "subStatValue": "31.5%"
      },
      {
        "level": "40",
        "atk": 208,
        "subStatType": "DEF",
        "subStatValue": "36.8%"
      },
      {
        "level": "50",
        "atk": 259,
        "subStatType": "DEF",
        "subStatValue": "42%"
      },
      {
        "level": "60",
        "atk": 310,
        "subStatType": "DEF",
        "subStatValue": "47.2%"
      },
      {
        "level": "70",
        "atk": 362,
        "subStatType": "DEF",
        "subStatValue": "52.5%"
      },
      {
        "level": "80",
        "atk": 395,
        "subStatType": "DEF",
        "subStatValue": "52.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "cosmos-daze-wild-reverie",
    "slug": "cosmos-daze-wild-reverie",
    "name": "Cosmos Daze, Wild Reverie",
    "rarity": "A",
    "type": "Gas",
    "quote": "Masterpiece from Pop Re-Creator!",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "ATK%",
      "value": "25%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's damage dealt by 18% for 10s after casting Support Skill. Triggers at most once every 20s."
      },
      {
        "rank": 2,
        "effect": "Increases wearer's damage dealt by 21% for 10s after casting Support Skill. Triggers at most once every 20s."
      },
      {
        "rank": 3,
        "effect": "Increases wearer's damage dealt by 24% for 10s after casting Support Skill. Triggers at most once every 20s."
      },
      {
        "rank": 4,
        "effect": "Increases wearer's damage dealt by 27% for 10s after casting Support Skill. Triggers at most once every 20s."
      },
      {
        "rank": 5,
        "effect": "Increases wearer's damage dealt by 30% for 10s after casting Support Skill. Triggers at most once every 20s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "ATK%",
        "subStatValue": "12.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "ATK%",
        "subStatValue": "17.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "ATK%",
        "subStatValue": "22.5%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "ATK%",
        "subStatValue": "25%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "ATK%",
        "subStatValue": "25%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "shiny-days",
    "slug": "shiny-days",
    "name": "Shiny Days",
    "rarity": "A",
    "type": "Liquid",
    "quote": "Capturing these radiant moments, even in dreams they must go on. Regret was never beautiful, and you were never alone.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "ATK%",
      "value": "25%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Break Intensity by 48. Increases DMG by 10% against Broken units."
      },
      {
        "rank": 2,
        "effect": "Increases Break Intensity by 57. Increases DMG by 12% against Broken units."
      },
      {
        "rank": 3,
        "effect": "Increases Break Intensity by 66. Increases DMG by 14% against Broken units."
      },
      {
        "rank": 4,
        "effect": "Increases Break Intensity by 75. Increases DMG by 16% against Broken units."
      },
      {
        "rank": 5,
        "effect": "Increases Break Intensity by 84. Increases DMG by 18% against Broken units."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "ATK%",
        "subStatValue": "12.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "ATK%",
        "subStatValue": "17.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "ATK%",
        "subStatValue": "22.5%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "ATK%",
        "subStatValue": "25%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "ATK%",
        "subStatValue": "25%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "the-forgotten",
    "slug": "the-forgotten",
    "name": "The Forgotten",
    "rarity": "A",
    "type": "Solid",
    "quote": "Even if I'm just a complement to those masterpieces... I'm still beautiful too, right?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "HP",
      "value": "25%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 20% when the wearer's HP is above 50%; increases DEF by 20% when HP is below 50%."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 24% when the wearer's HP is above 50%; increases DEF by 24% when HP is below 50%."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 28% when the wearer's HP is above 50%; increases DEF by 28% when HP is below 50%."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 32% when the wearer's HP is above 50%; increases DEF by 32% when HP is below 50%."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 36% when the wearer's HP is above 50%; increases DEF by 36% when HP is below 50%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "HP",
        "subStatValue": "10%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "HP",
        "subStatValue": "10%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "HP",
        "subStatValue": "12.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "HP",
        "subStatValue": "15%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "HP",
        "subStatValue": "17.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "HP",
        "subStatValue": "20%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "HP",
        "subStatValue": "22.5%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "HP",
        "subStatValue": "25%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "HP",
        "subStatValue": "25%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "oraora",
    "slug": "oraora",
    "name": "Oraora!",
    "rarity": "A",
    "type": "Plasma",
    "quote": "It's said that in a faraway place, Ora Puncher has a cousin, Muda Puncher.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 395
    },
    "subStat": {
      "type": "ATK%",
      "value": "37.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases the wearer's Basic Attack damage by 2% for 10s each time a Basic Attack is used, up to 10 stacks. Tracks the duration of each stack independently."
      },
      {
        "rank": 2,
        "effect": "Increases the wearer's Basic Attack damage by 2.4% for 10s each time a Basic Attack is used, up to 10 stacks. Tracks the duration of each stack independently."
      },
      {
        "rank": 3,
        "effect": "Increases the wearer's Basic Attack damage by 2.8% for 10s each time a Basic Attack is used, up to 10 stacks. Tracks the duration of each stack independently."
      },
      {
        "rank": 4,
        "effect": "Increases the wearer's Basic Attack damage by 3.2% for 10s each time a Basic Attack is used, up to 10 stacks. Tracks the duration of each stack independently."
      },
      {
        "rank": 5,
        "effect": "Increases the wearer's Basic Attack damage by 3.6% for 10s each time a Basic Attack is used, up to 10 stacks. Tracks the duration of each stack independently."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 25,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "10",
        "atk": 55,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "20",
        "atk": 106,
        "subStatType": "ATK%",
        "subStatValue": "18.8%"
      },
      {
        "level": "30",
        "atk": 157,
        "subStatType": "ATK%",
        "subStatValue": "22.5%"
      },
      {
        "level": "40",
        "atk": 208,
        "subStatType": "ATK%",
        "subStatValue": "26.2%"
      },
      {
        "level": "50",
        "atk": 259,
        "subStatType": "ATK%",
        "subStatValue": "30%"
      },
      {
        "level": "60",
        "atk": 310,
        "subStatType": "ATK%",
        "subStatValue": "33.8%"
      },
      {
        "level": "70",
        "atk": 362,
        "subStatType": "ATK%",
        "subStatValue": "37.5%"
      },
      {
        "level": "80",
        "atk": 395,
        "subStatType": "ATK%",
        "subStatValue": "37.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "mind-royale",
    "slug": "mind-royale",
    "name": "Mind Royale",
    "rarity": "A",
    "type": "Liquid",
    "quote": "Inspiration is like potato chips—crunching and crackling, leaving scattered crumbs everywhere, without rhyme or reason.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 555
    },
    "subStat": {
      "type": "Break Intensity",
      "value": "60"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Grants the wearer 10 Ultimate Energy when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 2,
        "effect": "Grants the wearer 12 Ultimate Energy when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 3,
        "effect": "Grants the wearer 14 Ultimate Energy when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 4,
        "effect": "Grants the wearer 16 Ultimate Energy when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 5,
        "effect": "Grants the wearer 18 Ultimate Energy when casting a Redirect Skill. Triggers up to once every 20s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 36,
        "subStatType": "Break Intensity",
        "subStatValue": "24"
      },
      {
        "level": "10",
        "atk": 78,
        "subStatType": "Break Intensity",
        "subStatValue": "24"
      },
      {
        "level": "20",
        "atk": 149,
        "subStatType": "Break Intensity",
        "subStatValue": "30"
      },
      {
        "level": "30",
        "atk": 222,
        "subStatType": "Break Intensity",
        "subStatValue": "36"
      },
      {
        "level": "40",
        "atk": 293,
        "subStatType": "Break Intensity",
        "subStatValue": "42"
      },
      {
        "level": "50",
        "atk": 365,
        "subStatType": "Break Intensity",
        "subStatValue": "48"
      },
      {
        "level": "60",
        "atk": 437,
        "subStatType": "Break Intensity",
        "subStatValue": "54"
      },
      {
        "level": "70",
        "atk": 509,
        "subStatType": "Break Intensity",
        "subStatValue": "60"
      },
      {
        "level": "80",
        "atk": 555,
        "subStatType": "Break Intensity",
        "subStatValue": "60"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "the-good-the-bad-the-bitter",
    "slug": "the-good-the-bad-the-bitter",
    "name": "The Good, The Bad, The Bitter",
    "rarity": "A",
    "type": "Bose",
    "quote": "A touch of bitterness, but it'll still put you in a good mood, won't it?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "HP",
      "value": "25%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases the wearer's DEF by 26% for 10s when taking damage. Triggers at most once every 20s."
      },
      {
        "rank": 2,
        "effect": "Increases the wearer's DEF by 31% for 10s when taking damage. Triggers at most once every 20s."
      },
      {
        "rank": 3,
        "effect": "Increases the wearer's DEF by 36% for 10s when taking damage. Triggers at most once every 20s."
      },
      {
        "rank": 4,
        "effect": "Increases the wearer's DEF by 41% for 10s when taking damage. Triggers at most once every 20s."
      },
      {
        "rank": 5,
        "effect": "Increases the wearer's DEF by 46% for 10s when taking damage. Triggers at most once every 20s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "HP",
        "subStatValue": "10%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "HP",
        "subStatValue": "10%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "HP",
        "subStatValue": "12.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "HP",
        "subStatValue": "15%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "HP",
        "subStatValue": "17.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "HP",
        "subStatValue": "20%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "HP",
        "subStatValue": "22.5%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "HP",
        "subStatValue": "25%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "HP",
        "subStatValue": "25%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "the-great-thief",
    "slug": "the-great-thief",
    "name": "The Great Thief",
    "rarity": "A",
    "type": "Bose",
    "quote": "The moment I saw you, I was captivated. Your soft fur, that mischievous look on your face—I was mesmerized for so long that it wasn't until you left that I realized... where are my grilled skewers?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "Break Intensity",
      "value": "120"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Break Intensity by 70 for all characters of the same Esper Type as the wearer (including the wearer) when the team has 3 or more such characters. This effect does not stack."
      },
      {
        "rank": 2,
        "effect": "Increases Break Intensity by 84 for all characters of the same Esper Type as the wearer (including the wearer) when the team has 3 or more such characters. This effect does not stack."
      },
      {
        "rank": 3,
        "effect": "Increases Break Intensity by 98 for all characters of the same Esper Type as the wearer (including the wearer) when the team has 3 or more such characters. This effect does not stack."
      },
      {
        "rank": 4,
        "effect": "Increases Break Intensity by 112 for all characters of the same Esper Type as the wearer (including the wearer) when the team has 3 or more such characters. This effect does not stack."
      },
      {
        "rank": 5,
        "effect": "Increases Break Intensity by 126 for all characters of the same Esper Type as the wearer (including the wearer) when the team has 3 or more such characters. This effect does not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "Break Intensity",
        "subStatValue": "48"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "Break Intensity",
        "subStatValue": "48"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "Break Intensity",
        "subStatValue": "60"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "Break Intensity",
        "subStatValue": "72"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "Break Intensity",
        "subStatValue": "84"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "Break Intensity",
        "subStatValue": "96"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "Break Intensity",
        "subStatValue": "108"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "Break Intensity",
        "subStatValue": "120"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "Break Intensity",
        "subStatValue": "120"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "watch-your-heads",
    "slug": "watch-your-heads",
    "name": "Watch Your Heads!",
    "rarity": "A",
    "type": "Gas",
    "quote": "Hehehe... Don't be scared, it's just a laughing kite...",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "CRIT DMG",
      "value": "40%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 10% and Lakshana DMG to targets affected by Remora and Stain by 10% for 15s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 12% and Lakshana DMG to targets affected by Remora and Stain by 12% for 15s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 14% and Lakshana DMG to targets affected by Remora and Stain by 14% for 15s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 16% and Lakshana DMG to targets affected by Remora and Stain by 16% for 15s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 18% and Lakshana DMG to targets affected by Remora and Stain by 18% for 15s after the wearer casts a Redirect Skill. Effect does not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "CRIT DMG",
        "subStatValue": "16%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "CRIT DMG",
        "subStatValue": "16%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "CRIT DMG",
        "subStatValue": "20%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "CRIT DMG",
        "subStatValue": "24%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "CRIT DMG",
        "subStatValue": "28%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "CRIT DMG",
        "subStatValue": "32%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "CRIT DMG",
        "subStatValue": "36%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "CRIT DMG",
        "subStatValue": "40%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "CRIT DMG",
        "subStatValue": "40%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "clear-skies",
    "slug": "clear-skies",
    "name": "Clear Skies",
    "rarity": "A",
    "type": "Liquid",
    "quote": "Formation complete, securing air superiority.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "ATK%",
      "value": "25%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Anima DMG dealt by the wearer's Redirect Skill and Ultimate by 20%."
      },
      {
        "rank": 2,
        "effect": "Increases Anima DMG dealt by the wearer's Redirect Skill and Ultimate by 23.8%."
      },
      {
        "rank": 3,
        "effect": "Increases Anima DMG dealt by the wearer's Redirect Skill and Ultimate by 27.5%."
      },
      {
        "rank": 4,
        "effect": "Increases Anima DMG dealt by the wearer's Redirect Skill and Ultimate by 31.2%."
      },
      {
        "rank": 5,
        "effect": "Increases Anima DMG dealt by the wearer's Redirect Skill and Ultimate by 35%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "ATK%",
        "subStatValue": "12.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "ATK%",
        "subStatValue": "17.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "ATK%",
        "subStatValue": "22.5%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "ATK%",
        "subStatValue": "25%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "ATK%",
        "subStatValue": "25%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "failing-you-heavy-in-my-heart",
    "slug": "failing-you-heavy-in-my-heart",
    "name": "Failing You, Heavy In My Heart",
    "rarity": "A",
    "type": "Gas",
    "quote": "When you see red reflected in your teacher's eyes, that usually means you're about to fail the class.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "Break Intensity",
      "value": "120"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Grants the wearer 1 stack of Spider Knowledge when dealing damage with Basic Attacks, up to 8 stacks (up to 1 stack every 0.5s). All stacks are consumed when casting Ultimate. Increases the entire team's ATK by 1% for 10s per stack consumed. Increases ATK by an additional 2% when 8 stacks are consumed."
      },
      {
        "rank": 2,
        "effect": "Grants the wearer 1 stack of Spider Knowledge when dealing damage with Basic Attacks, up to 8 stacks (up to 1 stack every 0.5s). All stacks are consumed when casting Ultimate. Increases the entire team's ATK by 1.1% for 10s per stack consumed. Increases ATK by an additional 2.3% when 8 stacks are consumed."
      },
      {
        "rank": 3,
        "effect": "Grants the wearer 1 stack of Spider Knowledge when dealing damage with Basic Attacks, up to 8 stacks (up to 1 stack every 0.5s). All stacks are consumed when casting Ultimate. Increases the entire team's ATK by 1.3% for 10s per stack consumed. Increases ATK by an additional 2.6% when 8 stacks are consumed."
      },
      {
        "rank": 4,
        "effect": "Grants the wearer 1 stack of Spider Knowledge when dealing damage with Basic Attacks, up to 8 stacks (up to 1 stack every 0.5s). All stacks are consumed when casting Ultimate. Increases the entire team's ATK by 1.5% for 10s per stack consumed. Increases ATK by an additional 2.9% when 8 stacks are consumed."
      },
      {
        "rank": 5,
        "effect": "Grants the wearer 1 stack of Spider Knowledge when dealing damage with Basic Attacks, up to 8 stacks (up to 1 stack every 0.5s). All stacks are consumed when casting Ultimate. Increases the entire team's ATK by 1.6% for 10s per stack consumed. Increases ATK by an additional 3.2% when 8 stacks are consumed."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "Break Intensity",
        "subStatValue": "48"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "Break Intensity",
        "subStatValue": "48"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "Break Intensity",
        "subStatValue": "60"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "Break Intensity",
        "subStatValue": "72"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "Break Intensity",
        "subStatValue": "84"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "Break Intensity",
        "subStatValue": "96"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "Break Intensity",
        "subStatValue": "108"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "Break Intensity",
        "subStatValue": "120"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "Break Intensity",
        "subStatValue": "120"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "drawn-blade",
    "slug": "drawn-blade",
    "name": "Drawn Blade",
    "rarity": "A",
    "type": "Plasma",
    "quote": "Lone moon, dark clouds. Blade drawn, soul departs. Form fades, blade weeps.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 395
    },
    "subStat": {
      "type": "ATK%",
      "value": "37.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Deals additional Incantation DMG equal to 200% of ATK when the wearer triggers a Parry Attack."
      },
      {
        "rank": 2,
        "effect": "Deals additional Incantation DMG equal to 230% of ATK when the wearer triggers a Parry Attack."
      },
      {
        "rank": 3,
        "effect": "Deals additional Incantation DMG equal to 260% of ATK when the wearer triggers a Parry Attack."
      },
      {
        "rank": 4,
        "effect": "Deals additional Incantation DMG equal to 290% of ATK when the wearer triggers a Parry Attack."
      },
      {
        "rank": 5,
        "effect": "Deals additional Incantation DMG equal to 320% of ATK when the wearer triggers a Parry Attack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 25,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "10",
        "atk": 55,
        "subStatType": "ATK%",
        "subStatValue": "15%"
      },
      {
        "level": "20",
        "atk": 106,
        "subStatType": "ATK%",
        "subStatValue": "18.8%"
      },
      {
        "level": "30",
        "atk": 157,
        "subStatType": "ATK%",
        "subStatValue": "22.5%"
      },
      {
        "level": "40",
        "atk": 208,
        "subStatType": "ATK%",
        "subStatValue": "26.2%"
      },
      {
        "level": "50",
        "atk": 259,
        "subStatType": "ATK%",
        "subStatValue": "30%"
      },
      {
        "level": "60",
        "atk": 310,
        "subStatType": "ATK%",
        "subStatValue": "33.8%"
      },
      {
        "level": "70",
        "atk": 362,
        "subStatType": "ATK%",
        "subStatValue": "37.5%"
      },
      {
        "level": "80",
        "atk": 395,
        "subStatType": "ATK%",
        "subStatValue": "37.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "a-time-will-come",
    "slug": "a-time-will-come",
    "name": "A Time Will Come",
    "rarity": "A",
    "type": "Bose",
    "quote": "Descending from the heavens, returning to the heavens. Believing in that destined day, we leap into this endless migration with no visible end.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "CRIT Rate",
      "value": "20%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Grants the wearer 10% ATK, 10% DEF, and 10% HP when the team has at least 3 different Esper Types."
      },
      {
        "rank": 2,
        "effect": "Grants the wearer 12% ATK, 12% DEF, and 12% HP when the team has at least 3 different Esper Types."
      },
      {
        "rank": 3,
        "effect": "Grants the wearer 14% ATK, 14% DEF, and 14% HP when the team has at least 3 different Esper Types."
      },
      {
        "rank": 4,
        "effect": "Grants the wearer 16% ATK, 16% DEF, and 16% HP when the team has at least 3 different Esper Types."
      },
      {
        "rank": 5,
        "effect": "Grants the wearer 18% ATK, 18% DEF, and 18% HP when the team has at least 3 different Esper Types."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "CRIT Rate",
        "subStatValue": "8%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "CRIT Rate",
        "subStatValue": "8%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "CRIT Rate",
        "subStatValue": "10%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "CRIT Rate",
        "subStatValue": "12%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "CRIT Rate",
        "subStatValue": "14%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "CRIT Rate",
        "subStatValue": "16%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "CRIT Rate",
        "subStatValue": "18%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "CRIT Rate",
        "subStatValue": "20%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "CRIT Rate",
        "subStatValue": "20%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "the-fools-spring",
    "slug": "the-fools-spring",
    "name": "The Fools' Spring",
    "rarity": "A",
    "type": "Bose",
    "quote": "If I were a cicada, I'd still sing with my raspy voice.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 395
    },
    "subStat": {
      "type": "DEF",
      "value": "52.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases ATK by 18% while the wearer has a Shield."
      },
      {
        "rank": 2,
        "effect": "Increases ATK by 21% while the wearer has a Shield."
      },
      {
        "rank": 3,
        "effect": "Increases ATK by 24% while the wearer has a Shield."
      },
      {
        "rank": 4,
        "effect": "Increases ATK by 27% while the wearer has a Shield."
      },
      {
        "rank": 5,
        "effect": "Increases ATK by 30% while the wearer has a Shield."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 25,
        "subStatType": "DEF",
        "subStatValue": "21%"
      },
      {
        "level": "10",
        "atk": 55,
        "subStatType": "DEF",
        "subStatValue": "21%"
      },
      {
        "level": "20",
        "atk": 106,
        "subStatType": "DEF",
        "subStatValue": "26.2%"
      },
      {
        "level": "30",
        "atk": 157,
        "subStatType": "DEF",
        "subStatValue": "31.5%"
      },
      {
        "level": "40",
        "atk": 208,
        "subStatType": "DEF",
        "subStatValue": "36.8%"
      },
      {
        "level": "50",
        "atk": 259,
        "subStatType": "DEF",
        "subStatValue": "42%"
      },
      {
        "level": "60",
        "atk": 310,
        "subStatType": "DEF",
        "subStatValue": "47.2%"
      },
      {
        "level": "70",
        "atk": 362,
        "subStatType": "DEF",
        "subStatValue": "52.5%"
      },
      {
        "level": "80",
        "atk": 395,
        "subStatType": "DEF",
        "subStatValue": "52.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "time-bandit",
    "slug": "time-bandit",
    "name": "Time Bandit",
    "rarity": "A",
    "type": "Solid",
    "quote": "Time is like water next to a sponge. Look away for only a second, and it vanishes.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 475
    },
    "subStat": {
      "type": "HP",
      "value": "25%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Break Intensity by 90 for 10s after the wearer casts a Redirect Skill. Effect does not stack. Unlocks Arc: Picky. Arc: Picky — Summons Picky to unlock all nearby lockable objects."
      },
      {
        "rank": 2,
        "effect": "Increases Break Intensity by 108 for 10s after the wearer casts a Redirect Skill. Effect does not stack. Unlocks Arc: Picky. Arc: Picky — Summons Picky to unlock all nearby lockable objects."
      },
      {
        "rank": 3,
        "effect": "Increases Break Intensity by 126 for 10s after the wearer casts a Redirect Skill. Effect does not stack. Unlocks Arc: Picky. Arc: Picky — Summons Picky to unlock all nearby lockable objects."
      },
      {
        "rank": 4,
        "effect": "Increases Break Intensity by 144 for 10s after the wearer casts a Redirect Skill. Effect does not stack. Unlocks Arc: Picky. Arc: Picky — Summons Picky to unlock all nearby lockable objects."
      },
      {
        "rank": 5,
        "effect": "Increases Break Intensity by 162 for 10s after the wearer casts a Redirect Skill. Effect does not stack. Unlocks Arc: Picky. Arc: Picky — Summons Picky to unlock all nearby lockable objects."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 31,
        "subStatType": "HP",
        "subStatValue": "10%"
      },
      {
        "level": "10",
        "atk": 68,
        "subStatType": "HP",
        "subStatValue": "10%"
      },
      {
        "level": "20",
        "atk": 129,
        "subStatType": "HP",
        "subStatValue": "12.5%"
      },
      {
        "level": "30",
        "atk": 190,
        "subStatType": "HP",
        "subStatValue": "15%"
      },
      {
        "level": "40",
        "atk": 251,
        "subStatType": "HP",
        "subStatValue": "17.5%"
      },
      {
        "level": "50",
        "atk": 312,
        "subStatType": "HP",
        "subStatValue": "20%"
      },
      {
        "level": "60",
        "atk": 373,
        "subStatType": "HP",
        "subStatValue": "22.5%"
      },
      {
        "level": "70",
        "atk": 435,
        "subStatType": "HP",
        "subStatValue": "25%"
      },
      {
        "level": "80",
        "atk": 475,
        "subStatType": "HP",
        "subStatValue": "25%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "call-of-the-twisted-city",
    "slug": "call-of-the-twisted-city",
    "name": "Call of the Twisted City",
    "rarity": "A",
    "type": "Liquid",
    "quote": "When the world begins to warp, crying out in ways no one can understand, who among us can hold on to their sanity?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 395
    },
    "subStat": {
      "type": "HP",
      "value": "37.5%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases Healing Bonus by 12% for 10s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 2,
        "effect": "Increases Healing Bonus by 14% for 10s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 3,
        "effect": "Increases Healing Bonus by 16% for 10s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 4,
        "effect": "Increases Healing Bonus by 18% for 10s after the wearer casts a Redirect Skill. Effect does not stack."
      },
      {
        "rank": 5,
        "effect": "Increases Healing Bonus by 20% for 10s after the wearer casts a Redirect Skill. Effect does not stack."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 25,
        "subStatType": "HP",
        "subStatValue": "15%"
      },
      {
        "level": "10",
        "atk": 55,
        "subStatType": "HP",
        "subStatValue": "15%"
      },
      {
        "level": "20",
        "atk": 106,
        "subStatType": "HP",
        "subStatValue": "18.8%"
      },
      {
        "level": "30",
        "atk": 157,
        "subStatType": "HP",
        "subStatValue": "22.5%"
      },
      {
        "level": "40",
        "atk": 208,
        "subStatType": "HP",
        "subStatValue": "26.2%"
      },
      {
        "level": "50",
        "atk": 259,
        "subStatType": "HP",
        "subStatValue": "30%"
      },
      {
        "level": "60",
        "atk": 310,
        "subStatType": "HP",
        "subStatValue": "33.8%"
      },
      {
        "level": "70",
        "atk": 362,
        "subStatType": "HP",
        "subStatValue": "37.5%"
      },
      {
        "level": "80",
        "atk": 395,
        "subStatType": "HP",
        "subStatValue": "37.5%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "dangerous-game",
    "slug": "dangerous-game",
    "name": "Dangerous Game",
    "rarity": "B",
    "type": "Bose",
    "quote": "Let's make a bet. Loser goes broke.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 380
    },
    "subStat": {
      "type": "Break Intensity",
      "value": "96"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's Break Intensity by 60 for 10s when reducing Break. Triggers at most once every 20s."
      },
      {
        "rank": 2,
        "effect": "Increases wearer's Break Intensity by 66 for 10s when reducing Break. Triggers at most once every 20s."
      },
      {
        "rank": 3,
        "effect": "Increases wearer's Break Intensity by 72 for 10s when reducing Break. Triggers at most once every 20s."
      },
      {
        "rank": 4,
        "effect": "Increases wearer's Break Intensity by 78 for 10s when reducing Break. Triggers at most once every 20s."
      },
      {
        "rank": 5,
        "effect": "Increases wearer's Break Intensity by 84 for 10s when reducing Break. Triggers at most once every 20s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 24,
        "subStatType": "Break Intensity",
        "subStatValue": "38"
      },
      {
        "level": "10",
        "atk": 53,
        "subStatType": "Break Intensity",
        "subStatValue": "38"
      },
      {
        "level": "20",
        "atk": 101,
        "subStatType": "Break Intensity",
        "subStatValue": "48"
      },
      {
        "level": "30",
        "atk": 151,
        "subStatType": "Break Intensity",
        "subStatValue": "58"
      },
      {
        "level": "40",
        "atk": 200,
        "subStatType": "Break Intensity",
        "subStatValue": "67"
      },
      {
        "level": "50",
        "atk": 250,
        "subStatType": "Break Intensity",
        "subStatValue": "77"
      },
      {
        "level": "60",
        "atk": 299,
        "subStatType": "Break Intensity",
        "subStatValue": "86"
      },
      {
        "level": "70",
        "atk": 349,
        "subStatType": "Break Intensity",
        "subStatValue": "96"
      },
      {
        "level": "80",
        "atk": 380,
        "subStatType": "Break Intensity",
        "subStatValue": "96"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "first-step-to-success",
    "slug": "first-step-to-success",
    "name": "First Step to Success",
    "rarity": "B",
    "type": "Solid",
    "quote": "Good self-control is the first step on the road to success.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 380
    },
    "subStat": {
      "type": "ATK%",
      "value": "20%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases wearer's ATK by 12% for 10s when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 2,
        "effect": "Increases wearer's ATK by 13% for 10s when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 3,
        "effect": "Increases wearer's ATK by 14% for 10s when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 4,
        "effect": "Increases wearer's ATK by 15% for 10s when casting a Redirect Skill. Triggers up to once every 20s."
      },
      {
        "rank": 5,
        "effect": "Increases wearer's ATK by 16% for 10s when casting a Redirect Skill. Triggers up to once every 20s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 24,
        "subStatType": "ATK%",
        "subStatValue": "8%"
      },
      {
        "level": "10",
        "atk": 53,
        "subStatType": "ATK%",
        "subStatValue": "8%"
      },
      {
        "level": "20",
        "atk": 101,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "30",
        "atk": 151,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "40",
        "atk": 200,
        "subStatType": "ATK%",
        "subStatValue": "14%"
      },
      {
        "level": "50",
        "atk": 250,
        "subStatType": "ATK%",
        "subStatValue": "16%"
      },
      {
        "level": "60",
        "atk": 299,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "70",
        "atk": 349,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      },
      {
        "level": "80",
        "atk": 380,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "be-happy",
    "slug": "be-happy",
    "name": "Be Happy",
    "rarity": "B",
    "type": "Gas",
    "quote": "Hm? Why aren't you laughing?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 316
    },
    "subStat": {
      "type": "HP",
      "value": "30%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Restores wearer's HP by 12% upon defeating an enemy. Triggers at most once every 20s."
      },
      {
        "rank": 2,
        "effect": "Restores wearer's HP by 14% upon defeating an enemy. Triggers at most once every 20s."
      },
      {
        "rank": 3,
        "effect": "Restores wearer's HP by 16% upon defeating an enemy. Triggers at most once every 20s."
      },
      {
        "rank": 4,
        "effect": "Restores wearer's HP by 18% upon defeating an enemy. Triggers at most once every 20s."
      },
      {
        "rank": 5,
        "effect": "Restores wearer's HP by 20% upon defeating an enemy. Triggers at most once every 20s."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 21,
        "subStatType": "HP",
        "subStatValue": "12%"
      },
      {
        "level": "10",
        "atk": 45,
        "subStatType": "HP",
        "subStatValue": "12%"
      },
      {
        "level": "20",
        "atk": 86,
        "subStatType": "HP",
        "subStatValue": "15%"
      },
      {
        "level": "30",
        "atk": 126,
        "subStatType": "HP",
        "subStatValue": "18%"
      },
      {
        "level": "40",
        "atk": 167,
        "subStatType": "HP",
        "subStatValue": "21%"
      },
      {
        "level": "50",
        "atk": 208,
        "subStatType": "HP",
        "subStatValue": "24%"
      },
      {
        "level": "60",
        "atk": 248,
        "subStatType": "HP",
        "subStatValue": "27%"
      },
      {
        "level": "70",
        "atk": 289,
        "subStatType": "HP",
        "subStatValue": "30%"
      },
      {
        "level": "80",
        "atk": 316,
        "subStatType": "HP",
        "subStatValue": "30%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "us",
    "slug": "us",
    "name": "Us.",
    "rarity": "B",
    "type": "Plasma",
    "quote": "I am... you... are... you, are... it, is... me... no, I... am... us.",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 380
    },
    "subStat": {
      "type": "ATK%",
      "value": "20%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Increases the wearer's Basic Attack damage by 12%."
      },
      {
        "rank": 2,
        "effect": "Increases the wearer's Basic Attack damage by 13%."
      },
      {
        "rank": 3,
        "effect": "Increases the wearer's Basic Attack damage by 14%."
      },
      {
        "rank": 4,
        "effect": "Increases the wearer's Basic Attack damage by 15%."
      },
      {
        "rank": 5,
        "effect": "Increases the wearer's Basic Attack damage by 16%."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 24,
        "subStatType": "ATK%",
        "subStatValue": "8%"
      },
      {
        "level": "10",
        "atk": 53,
        "subStatType": "ATK%",
        "subStatValue": "8%"
      },
      {
        "level": "20",
        "atk": 101,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "30",
        "atk": 151,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "40",
        "atk": 200,
        "subStatType": "ATK%",
        "subStatValue": "14%"
      },
      {
        "level": "50",
        "atk": 250,
        "subStatType": "ATK%",
        "subStatValue": "16%"
      },
      {
        "level": "60",
        "atk": 299,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "70",
        "atk": 349,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      },
      {
        "level": "80",
        "atk": 380,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  },
  {
    "id": "real-music",
    "slug": "real-music",
    "name": "\"Real Music\"",
    "rarity": "B",
    "type": "Liquid",
    "quote": "Waddaya mean ya prefer \"real music\"? Is this not \"real\" enough for yer taste?",
    "shortDescription": "Detailed page captured.",
    "mainStat": {
      "type": "ATK",
      "value": 380
    },
    "subStat": {
      "type": "ATK%",
      "value": "20%"
    },
    "refinements": [
      {
        "rank": 1,
        "effect": "Grants the wearer a 12% Redirect Skill DMG bonus."
      },
      {
        "rank": 2,
        "effect": "Grants the wearer a 13% Redirect Skill DMG bonus."
      },
      {
        "rank": 3,
        "effect": "Grants the wearer a 14% Redirect Skill DMG bonus."
      },
      {
        "rank": 4,
        "effect": "Grants the wearer a 15% Redirect Skill DMG bonus."
      },
      {
        "rank": 5,
        "effect": "Grants the wearer a 16% Redirect Skill DMG bonus."
      }
    ],
    "growthScaling": [
      {
        "level": "1",
        "atk": 24,
        "subStatType": "ATK%",
        "subStatValue": "8%"
      },
      {
        "level": "10",
        "atk": 53,
        "subStatType": "ATK%",
        "subStatValue": "8%"
      },
      {
        "level": "20",
        "atk": 101,
        "subStatType": "ATK%",
        "subStatValue": "10%"
      },
      {
        "level": "30",
        "atk": 151,
        "subStatType": "ATK%",
        "subStatValue": "12%"
      },
      {
        "level": "40",
        "atk": 200,
        "subStatType": "ATK%",
        "subStatValue": "14%"
      },
      {
        "level": "50",
        "atk": 250,
        "subStatType": "ATK%",
        "subStatValue": "16%"
      },
      {
        "level": "60",
        "atk": 299,
        "subStatType": "ATK%",
        "subStatValue": "18%"
      },
      {
        "level": "70",
        "atk": 349,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      },
      {
        "level": "80",
        "atk": 380,
        "subStatType": "ATK%",
        "subStatValue": "20%"
      }
    ],
    "image": "",
    "icon": "",
    "recommendedCharacters": [],
    "tags": []
  }
]

export function getWeaponById(id) {
  return weapons.find((weapon) => weapon.id === id) || null
}

export function getWeaponBySlug(slug) {
  return weapons.find((weapon) => weapon.slug === slug || weapon.id === slug) || null
}

function comparableName(value) {
  return String(value || '').toLowerCase().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function getWeaponByName(name) {
  const target = comparableName(name)
  if (!target) return null
  return weapons.find((weapon) => comparableName(weapon.name) === target || weapon.id === target || weapon.slug === target) || null
}

export function getWeaponsByRarity(rarity) {
  return weapons.filter((weapon) => weapon.rarity === rarity)
}

export function getWeaponsByType(type) {
  return weapons.filter((weapon) => weapon.type === type)
}

export function getWeaponsBySubStat(stat) {
  return weapons.filter((weapon) => weapon.subStat?.type === stat)
}

export function getWeaponsByIds(ids = []) {
  return ids.map((id) => getWeaponById(id)).filter(Boolean)
}
