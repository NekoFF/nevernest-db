// Generated from NTE_cartridges_stats_database.xlsx on 2026-05-14.
// Set bonuses are per cartridge set; rarity affects stat max values only.
import { getStatById, formatStatValue as formatRegistryStatValue } from './stats.js'
import { MODULE_SHAPE_BY_ID } from './moduleCatalog.js'

const workbookData = {
    "cartridges":  [
                       {
                           "id":  "lost-radiance",
                           "sourceId":  "lost_radiance",
                           "slug":  "lost-radiance",
                           "name":  "Lost Radiance",
                           "theme":  "Cosmos",
                           "bonusCategory":  "damage",
                           "element":  "Cosmos",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Cosmos DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Ignores 25% of enemies\u0027 DEF for 20s after the wearer casts Ultimate. Effect does not stack."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "fireflies-and-the-forest",
                           "sourceId":  "fireflies_and_the_forest",
                           "slug":  "fireflies-and-the-forest",
                           "name":  "Fireflies and the Forest",
                           "theme":  "Anima",
                           "bonusCategory":  "damage",
                           "element":  "Anima",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Anima DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s CRIT DMG by 8% when a nearby enemy takes Anima DMG from the Team, up to 7 stacks. Each stack lasts 10s. Effect remains active when the character is off-field."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "crimson-twin-butterflies",
                           "sourceId":  "crimson_twin_butterflies",
                           "slug":  "crimson-twin-butterflies",
                           "name":  "Crimson: Twin Butterflies",
                           "theme":  "Incantation",
                           "bonusCategory":  "damage",
                           "element":  "Incantation",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Incantation DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s ATK by 6% when a nearby enemy takes Incantation DMG from the Team, up to 6 stacks. Each stack lasts 10s. Effect remains active when the character is off-field."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "diabolos",
                           "sourceId":  "diabolos",
                           "slug":  "diabolos",
                           "name":  "Diabolos",
                           "theme":  "Chaos",
                           "bonusCategory":  "damage",
                           "element":  "Chaos",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Chaos DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Ignores 12% of enemies\u0027 Chaos RES. Ignores 24% of enemies\u0027 Chaos RES for 20s after the wearer participates in Nova or Scorch reactions."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "devils-blood-curse",
                           "sourceId":  "devils_blood_curse",
                           "slug":  "devils-blood-curse",
                           "name":  "Devil\u0027s Blood: Curse",
                           "theme":  "Psyche",
                           "bonusCategory":  "damage",
                           "element":  "Psyche",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Psyche DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s DMG by 18%. The bonus becomes 36% against units affected by Nova or Stain."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "street-boxer",
                           "sourceId":  "street_boxer",
                           "slug":  "street-boxer",
                           "name":  "Street Boxer",
                           "theme":  "Lakshana",
                           "bonusCategory":  "damage",
                           "element":  "Lakshana",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Lakshana DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases Crit Chance by 14%. Team triggering Remora or Stain increases the bonus to 14% for 20s."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact wording check: the 4-piece line looks suspicious/redundant on screenshot",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "kingdoms-guard",
                           "sourceId":  "kingdoms_guard",
                           "slug":  "kingdoms-guard",
                           "name":  "Kingdom\u0027s Guard",
                           "theme":  "DEF",
                           "bonusCategory":  "defense",
                           "element":  "",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "DEF +15%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s shields by 20%."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "shadow-creed",
                           "sourceId":  "shadow_creed",
                           "slug":  "shadow-creed",
                           "name":  "Shadow Creed",
                           "theme":  "ATK",
                           "bonusCategory":  "damage",
                           "element":  "",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "ATK +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s ATK by 25% for 20s after casting a Skill."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "theas-night-tavern",
                           "sourceId":  "theas_night_tavern",
                           "slug":  "theas-night-tavern",
                           "name":  "Thea\u0027s Night Tavern",
                           "theme":  "HP",
                           "bonusCategory":  "defense",
                           "element":  "",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "HP +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s Healing Bonus by 20%."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "tiny-big-adventure",
                           "sourceId":  "tiny_big_adventure",
                           "slug":  "tiny-big-adventure",
                           "name":  "Tiny Big Adventure",
                           "theme":  "HP",
                           "bonusCategory":  "defense",
                           "element":  "",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "HP +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases wearer\u0027s Max HP by 4% when taking damage, up to 10 stacks. Each stack lasts 10s. Casting Ultimate instantly grants 10 stacks."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "speedy-hedgehog",
                           "sourceId":  "speedy_hedgehog",
                           "slug":  "speedy-hedgehog",
                           "name":  "Speedy Hedgehog",
                           "theme":  "Charge Efficiency",
                           "bonusCategory":  "utility",
                           "element":  "",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Charge Efficiency +12%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Increases all allies\u0027 ATK by 15% for 20s after the wearer casts Ultimate. Effect does not stack."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       },
                       {
                           "id":  "quiet-manor",
                           "sourceId":  "quiet_manor",
                           "slug":  "quiet-manor",
                           "name":  "Quiet Manor",
                           "theme":  "Mental DMG",
                           "bonusCategory":  "damage",
                           "element":  "Cognitive",
                           "description":  "Console Cartridge. Activate by pairing it to a Console.",
                           "bonuses":  [
                                           {
                                               "pieces":  2,
                                               "text":  "Mental DMG +10%."
                                           },
                                           {
                                               "pieces":  4,
                                               "text":  "Grants wearer a 12% Mental DMG Bonus per Basic Attack, up to 3 stacks. Each stack lasts 6s."
                                           }
                                       ],
                           "compatibleModulesStatus":  "Needs exact shape IDs from image",
                           "dataStatus":  "missing-compatible-shapes",
                           "compatibleModules":  [
                                                     {
                                                         "slot":  1,
                                                         "moduleShapeId":  "type-ii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  2,
                                                         "moduleShapeId":  "type-ii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  3,
                                                         "moduleShapeId":  "type-iii-horizontal",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     },
                                                     {
                                                         "slot":  4,
                                                         "moduleShapeId":  "type-iii-vertical",
                                                         "shapeSignature":  "TBD exact grid/shape signature from screenshot",
                                                         "notes":  "image/ref pending"
                                                     }
                                                 ],
                           "notes":  "Captured from screenshots; same effects for B/A/S.",
                           "variants":  [
                                            {
                                                "rarity":  "B",
                                                "color":  "Blue",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "A",
                                                "color":  "Purple",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            },
                                            {
                                                "rarity":  "S",
                                                "color":  "Orange/Gold",
                                                "maxLevel":  20,
                                                "icon":  "",
                                                "assetStatus":  "icon pending"
                                            }
                                        ],
                           "availableRarities":  [
                                                     "B",
                                                     "A",
                                                     "S"
                                                 ],
                           "image":  "",
                           "icon":  ""
                       }
                   ],
    "statOptions":  [
                        {
                            "stat_id":  "atk_percent",
                            "stat_name_en":  "ATK%",
                            "stat_name_ru":  "????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "hp_percent",
                            "stat_name_en":  "HP%",
                            "stat_name_ru":  "?? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "def_percent",
                            "stat_name_en":  "DEF%",
                            "stat_name_ru":  "?????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "crit_rate",
                            "stat_name_en":  "CRIT Rate",
                            "stat_name_ru":  "???? ????. ????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "crit_dmg",
                            "stat_name_en":  "CRIT DMG",
                            "stat_name_ru":  "????. ???? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "healing_bonus",
                            "stat_name_en":  "Healing Bonus",
                            "stat_name_ru":  "????? ? ??????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "cosmos_dmg",
                            "stat_name_en":  "Cosmos DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ??????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "anima_dmg",
                            "stat_name_en":  "Anima DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "incantation_dmg",
                            "stat_name_en":  "Incantation DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ??? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "chaos_dmg",
                            "stat_name_en":  "Chaos DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "psyche_dmg",
                            "stat_name_en":  "Psyche DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ??????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "lakshana_dmg",
                            "stat_name_en":  "Lakshana DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ??????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "cognition_dmg",
                            "stat_name_en":  "Cognition DMG Bonus",
                            "stat_name_ru":  "????? ? ????? ????????????? %",
                            "value_type":  "percent",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "essence",
                            "stat_name_en":  "Essence",
                            "stat_name_ru":  "????????",
                            "value_type":  "flat",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "break_intensity",
                            "stat_name_en":  "Break Intensity",
                            "stat_name_ru":  "????????????? ??????????",
                            "value_type":  "flat",
                            "scope":  "main",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "atk_flat",
                            "stat_name_en":  "ATK",
                            "stat_name_ru":  "?????",
                            "value_type":  "flat",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "atk_percent",
                            "stat_name_en":  "ATK%",
                            "stat_name_ru":  "????? %",
                            "value_type":  "percent",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "hp_flat",
                            "stat_name_en":  "HP",
                            "stat_name_ru":  "??",
                            "value_type":  "flat",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "hp_percent",
                            "stat_name_en":  "HP%",
                            "stat_name_ru":  "?? %",
                            "value_type":  "percent",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "def_flat",
                            "stat_name_en":  "DEF",
                            "stat_name_ru":  "??????",
                            "value_type":  "flat",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "def_percent",
                            "stat_name_en":  "DEF%",
                            "stat_name_ru":  "?????? %",
                            "value_type":  "percent",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "crit_rate",
                            "stat_name_en":  "CRIT Rate",
                            "stat_name_ru":  "???? ????. ????? %",
                            "value_type":  "percent",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "crit_dmg",
                            "stat_name_en":  "CRIT DMG",
                            "stat_name_ru":  "????. ???? %",
                            "value_type":  "percent",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "dmg_bonus",
                            "stat_name_en":  "DMG Bonus",
                            "stat_name_ru":  "????? ? ????? %",
                            "value_type":  "percent",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "essence",
                            "stat_name_en":  "Essence",
                            "stat_name_ru":  "????????",
                            "value_type":  "flat",
                            "scope":  "sub",
                            "allowed":  "yes"
                        },
                        {
                            "stat_id":  "break_intensity",
                            "stat_name_en":  "Break Intensity",
                            "stat_name_ru":  "????????????? ??????????",
                            "value_type":  "flat",
                            "scope":  "sub",
                            "allowed":  "yes"
                        }
                    ],
    "statMaxValues":  [
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "atk_percent",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "hp_percent",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "def_percent",
                              "max_value":  "31.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "crit_rate",
                              "max_value":  "18",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "crit_dmg",
                              "max_value":  "36",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "healing_bonus",
                              "max_value":  "20.7",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "cosmos_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "anima_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "incantation_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "chaos_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "psyche_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "lakshana_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "cognition_dmg",
                              "max_value":  "22.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "essence",
                              "max_value":  "108",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "break_intensity",
                              "max_value":  "108",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "atk_flat",
                              "max_value":  "48",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "atk_percent",
                              "max_value":  "7.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "hp_flat",
                              "max_value":  "600",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "hp_percent",
                              "max_value":  "7.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "def_flat",
                              "max_value":  "48",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "def_percent",
                              "max_value":  "10.5",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "crit_rate",
                              "max_value":  "6",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "crit_dmg",
                              "max_value":  "12",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "dmg_bonus",
                              "max_value":  "6",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "essence",
                              "max_value":  "36",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "B",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "break_intensity",
                              "max_value":  "36",
                              "notes":  "transcribed from B-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "atk_percent",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "hp_percent",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "def_percent",
                              "max_value":  "42",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "crit_rate",
                              "max_value":  "24",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "crit_dmg",
                              "max_value":  "48",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "healing_bonus",
                              "max_value":  "27.6",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "cosmos_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "anima_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "incantation_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "chaos_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "psyche_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "lakshana_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "cognition_dmg",
                              "max_value":  "30",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "essence",
                              "max_value":  "144",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "break_intensity",
                              "max_value":  "144",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "atk_flat",
                              "max_value":  "64",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "atk_percent",
                              "max_value":  "10",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "hp_flat",
                              "max_value":  "800",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "hp_percent",
                              "max_value":  "10",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "def_flat",
                              "max_value":  "64",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "def_percent",
                              "max_value":  "14",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "crit_rate",
                              "max_value":  "8",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "crit_dmg",
                              "max_value":  "16",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "dmg_bonus",
                              "max_value":  "8",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "essence",
                              "max_value":  "48",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "A",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "break_intensity",
                              "max_value":  "48",
                              "notes":  "transcribed from A-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "atk_percent",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "hp_percent",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "def_percent",
                              "max_value":  "52.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "crit_rate",
                              "max_value":  "30",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "crit_dmg",
                              "max_value":  "60",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "healing_bonus",
                              "max_value":  "34.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "cosmos_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "anima_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "incantation_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "chaos_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "psyche_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "lakshana_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "cognition_dmg",
                              "max_value":  "37.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "essence",
                              "max_value":  "180",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "main",
                              "stat_id":  "break_intensity",
                              "max_value":  "180",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "atk_flat",
                              "max_value":  "80",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "atk_percent",
                              "max_value":  "12.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "hp_flat",
                              "max_value":  "1000",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "hp_percent",
                              "max_value":  "12.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "def_flat",
                              "max_value":  "80",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "def_percent",
                              "max_value":  "17.5",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "crit_rate",
                              "max_value":  "10",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "crit_dmg",
                              "max_value":  "20",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "dmg_bonus",
                              "max_value":  "10",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "essence",
                              "max_value":  "60",
                              "notes":  "transcribed from S-rank screenshots"
                          },
                          {
                              "rarity":  "S",
                              "level":  "20",
                              "scope":  "sub",
                              "stat_id":  "break_intensity",
                              "max_value":  "60",
                              "notes":  "transcribed from S-rank screenshots"
                          }
                      ]
}

const statIdAliases = {
  atk_flat: 'atk',
  hp_flat: 'hp',
  def_flat: 'def',
  cosmos_dmg: 'cosmos_dmg_bonus',
  anima_dmg: 'anima_dmg_bonus',
  incantation_dmg: 'incantation_dmg_bonus',
  chaos_dmg: 'chaos_dmg_bonus',
  psyche_dmg: 'psyche_dmg_bonus',
  lakshana_dmg: 'lakshana_dmg_bonus',
  cognition_dmg: 'cognitive_dmg_bonus',
  mental_dmg: 'cognitive_dmg_bonus',
  essence: 'essentia',
}

const placeholderShapeAliases = {
  module_shape_1: 'type-ii-horizontal',
  module_shape_2: 'type-ii-vertical',
  module_shape_3: 'type-iii-horizontal',
  module_shape_4: 'type-iii-vertical',
}

const warnedCartridgeShapeData = new Set()

function statEffect(stat, value, valueType = 'percent') {
  return {
    type: 'stat',
    stat,
    operation: 'add',
    value,
    valueType,
    condition: null,
    autoApply: true,
  }
}

function conditionalStatEffect(stat, value, condition, valueType = 'percent') {
  return {
    type: 'conditional',
    stat,
    operation: 'add',
    value,
    valueType,
    condition,
    autoApply: false,
  }
}

function conditionalEffect(effect) {
  return {
    autoApply: false,
    ...effect,
    type: effect.type || 'conditional',
  }
}

const structuredSetBonusEffects = {
  'lost-radiance': {
    twoPiece: [statEffect('cosmosDmg', 10)],
    fourPiece: [
      conditionalEffect({
        effectKey: 'enemy_def_ignore',
        value: 25,
        valueType: 'percent',
        condition: {
          trigger: 'after_wearer_casts_ultimate',
          durationSeconds: 20,
          stacks: false,
          effectStacks: false,
        },
      }),
    ],
  },
  'fireflies-and-the-forest': {
    twoPiece: [statEffect('animaDmg', 10)],
    fourPiece: [
      conditionalStatEffect('critDmg', 8, {
        trigger: 'nearby_enemy_takes_anima_dmg_from_team',
        maxStacks: 7,
        durationSeconds: 10,
        worksOffField: true,
      }),
    ],
  },
  'crimson-twin-butterflies': {
    twoPiece: [statEffect('incantationDmg', 10)],
    fourPiece: [
      conditionalStatEffect('atkPercent', 6, {
        trigger: 'nearby_enemy_takes_incantation_dmg_from_team',
        maxStacks: 6,
        durationSeconds: 10,
        worksOffField: true,
      }),
    ],
  },
  diabolos: {
    twoPiece: [statEffect('chaosDmg', 10)],
    fourPiece: [
      conditionalEffect({
        type: 'enemy_modifier',
        effectKey: 'chaos_res_ignore',
        value: 12,
        valueType: 'percent',
        condition: null,
        reason: 'Enemy resistance modifiers are not part of Preview Stats totals yet.',
      }),
      conditionalEffect({
        type: 'enemy_modifier',
        effectKey: 'chaos_res_ignore',
        value: 24,
        valueType: 'percent',
        condition: {
          trigger: 'wearer_participates_in_nova_or_scorch',
          durationSeconds: 20,
        },
        reason: 'Enemy resistance modifiers require battle-state support.',
      }),
    ],
  },
  'devils-blood-curse': {
    twoPiece: [statEffect('psycheDmg', 10)],
    fourPiece: [
      statEffect('damageBonus', 18),
      conditionalStatEffect('damageBonus', 18, {
        trigger: 'target_affected_by_nova_or_stain',
      }),
    ],
  },
  'street-boxer': {
    twoPiece: [statEffect('lakshanaDmg', 10)],
    fourPiece: [
      statEffect('critRate', 14),
      conditionalStatEffect('critRate', 0, {
        trigger: 'team_triggers_remora_or_stain',
        durationSeconds: 20,
        notes: 'Source text is flagged for wording verification; no extra stat is auto-applied.',
      }),
    ],
  },
  'kingdoms-guard': {
    twoPiece: [statEffect('defPercent', 15)],
    fourPiece: [statEffect('shieldBonus', 20)],
  },
  'shadow-creed': {
    twoPiece: [statEffect('atkPercent', 10)],
    fourPiece: [
      conditionalStatEffect('atkPercent', 25, {
        trigger: 'after_wearer_casts_skill',
        durationSeconds: 20,
      }),
    ],
  },
  'theas-night-tavern': {
    twoPiece: [statEffect('hpPercent', 10)],
    fourPiece: [statEffect('healingBonus', 20)],
  },
  'tiny-big-adventure': {
    twoPiece: [statEffect('hpPercent', 10)],
    fourPiece: [
      conditionalStatEffect('hpPercent', 4, {
        trigger: 'wearer_takes_damage',
        maxStacks: 10,
        durationSeconds: 10,
        instantMaxStacksTrigger: 'wearer_casts_ultimate',
      }),
    ],
  },
  'speedy-hedgehog': {
    twoPiece: [statEffect('chargeEfficiency', 12)],
    fourPiece: [
      conditionalEffect({
        type: 'team_stat',
        stat: 'atkPercent',
        operation: 'add',
        value: 15,
        valueType: 'percent',
        condition: {
          trigger: 'after_wearer_casts_ultimate',
          durationSeconds: 20,
          affects: 'all_allies',
          effectStacks: false,
        },
      }),
    ],
  },
  'quiet-manor': {
    twoPiece: [statEffect('cognitiveDmg', 10)],
    fourPiece: [
      conditionalStatEffect('cognitiveDmg', 12, {
        trigger: 'wearer_basic_attack',
        maxStacks: 3,
        durationSeconds: 6,
      }),
    ],
  },
}

function cloneEffects(effects = []) {
  return safeArray(effects).map((effect) => ({
    ...effect,
    condition: effect.condition ? { ...effect.condition } : null,
  }))
}

function bonusKeyForPieces(pieces) {
  if (Number(pieces) === 2) return 'twoPiece'
  if (Number(pieces) === 4) return 'fourPiece'
  return `${pieces}Piece`
}

export const cartridgeRarities = ['S', 'A', 'B']
export const baseCartridgeSets = workbookData.cartridges.map(normalizeCartridgeSet)
export const cartridgeSets = baseCartridgeSets
export const cartridges = cartridgeSets
export const cartridgeStatOptions = workbookData.statOptions.map((item) => ({
  statId: normalizeCartridgeStatId(item.stat_id),
  sourceStatId: item.stat_id,
  label: item.stat_name_en,
  ruName: item.stat_name_ru,
  valueType: item.value_type,
  scope: item.scope,
  allowed: String(item.allowed || '').toLowerCase() === 'yes',
}))

export const cartridgeStatValues = workbookData.statMaxValues.reduce((acc, row) => {
  const rarity = row.rarity
  const scope = row.scope
  const statId = normalizeCartridgeStatId(row.stat_id)
  if (!rarity || !scope || !statId) return acc
  acc[rarity] ||= { main: {}, sub: {} }
  acc[rarity][scope] ||= {}
  acc[rarity][scope][statId] = {
    value: Number(row.max_value),
    sourceStatId: row.stat_id,
    notes: row.notes || '',
  }
  return acc
}, {})

export function normalizeCartridgeStatId(statId) {
  const key = String(statId || '').trim()
  return statIdAliases[key] || key
}

function normalizeShapeIdForSet(cartridgeId, shapeId, slot) {
  const raw = String(shapeId || '').trim()
  const normalized = placeholderShapeAliases[raw.toLowerCase()] || raw
  return MODULE_SHAPE_BY_ID.has(normalized) ? normalized : ''
}

function getCartridgeShapeDataStatus(set, compatibleModules) {
  if (set.dataStatus) return set.dataStatus
  const status = String(set.compatibleModulesStatus || '')
  if (
    status.toLowerCase().includes('needs exact') ||
    compatibleModules.length < 4 ||
    compatibleModules.some((module) => !module.moduleShapeId)
  ) {
    return 'missing-compatible-shapes'
  }
  return 'complete'
}

function warnInvalidCartridgeShapeData(set, compatibleModules, dataStatus) {
  if (!import.meta.env?.DEV) return
  const key = set.id || set.slug || set.name || 'unknown-cartridge'
  if (warnedCartridgeShapeData.has(key)) return
  const invalidModules = compatibleModules.filter((module) => !module.moduleShapeId)
  if (dataStatus === 'missing-compatible-shapes' || invalidModules.length) {
    warnedCartridgeShapeData.add(key)
    console.warn(`[NTE] Cartridge "${set.name || key}" has incomplete or invalid compatible module shape data. Only resolvable shape IDs will count toward set bonuses.`, {
      cartridgeId: set.id || set.slug,
      dataStatus,
      invalidSlots: invalidModules.map((module) => module.slot),
      compatibleModuleShapeIds: compatibleModules.map((module) => module.moduleShapeId).filter(Boolean),
    })
  }
}

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeSetBonuses(value, set = {}) {
  const structured = structuredSetBonusEffects[set.id] || structuredSetBonusEffects[set.slug] || {}
  return safeArray(value)
    .map((bonus) => {
      if (!bonus || typeof bonus !== 'object') return null
      const pieces = Number(bonus.pieces)
      const bonusKey = bonusKeyForPieces(pieces)
      const effects = Array.isArray(bonus.effects)
        ? cloneEffects(bonus.effects)
        : cloneEffects(structured[bonusKey])
      return {
        ...bonus,
        pieces,
        text: String(bonus.text || bonus.description || ''),
        description: String(bonus.description || bonus.text || ''),
        effects,
        structured: effects.length > 0,
      }
    })
    .filter((bonus) => Number.isFinite(bonus.pieces))
}

function normalizeSetBonusesByKey(bonuses = []) {
  return bonuses.reduce((acc, bonus) => {
    const key = bonusKeyForPieces(bonus.pieces)
    acc[key] = {
      description: bonus.description || bonus.text || '',
      effects: cloneEffects(bonus.effects),
    }
    return acc
  }, {})
}

function normalizeCartridgeSet(set) {
  const sourceModules = safeArray(set.compatibleModules)
  const compatibleModules = sourceModules.map((module, index) => ({
    ...(module && typeof module === 'object' ? module : {}),
    slot: Number(module?.slot) || index + 1,
    moduleShapeId: normalizeShapeIdForSet(set.id, module?.moduleShapeId || module?.shapeId || module, Number(module?.slot) || index + 1),
  }))
  const dataStatus = getCartridgeShapeDataStatus(set, compatibleModules)
  warnInvalidCartridgeShapeData(set, compatibleModules, dataStatus)
  return {
    ...set,
    dataStatus,
    notes: Array.isArray(set.notes) ? set.notes : set.notes ? [set.notes] : [],
    bonuses: normalizeSetBonuses(set.bonuses, set),
    setBonuses: normalizeSetBonusesByKey(normalizeSetBonuses(set.bonuses, set)),
    compatibleModules,
    compatibleModuleShapeIds: compatibleModules.map((module) => module.moduleShapeId),
    requiredSetPieces: compatibleModules,
    requiredSetPieceShapeIds: compatibleModules.map((module) => module.moduleShapeId),
  }
}

export function mergeCartridgeSetsWithOverrides(baseSets = baseCartridgeSets, overrides = {}) {
  const deleted = new Set(Object.entries(overrides || {}).filter(([, patch]) => patch?.__deleted).map(([id]) => id))
  const created = Object.values(overrides || {}).filter((patch) => patch?.__created && !patch.__deleted).map((patch) => normalizeCartridgeSet(patch))
  return [
  ...baseSets.filter((set) => !deleted.has(set.id) && !deleted.has(set.slug)).map((set) => {
    const patch = overrides?.[set.id] || overrides?.[set.slug]
    if (!patch || typeof patch !== 'object') return set
    const compatibleModuleShapeIds = Array.isArray(patch.compatibleModuleShapeIds)
      ? patch.compatibleModuleShapeIds.slice(0, 4)
      : Array.isArray(patch.compatibleModules)
        ? patch.compatibleModules.map((module) => module?.moduleShapeId || module?.shapeId || module).slice(0, 4)
        : null
    const compatibleModules = compatibleModuleShapeIds
      ? compatibleModuleShapeIds.map((shapeId, index) => ({
          ...(set.compatibleModules?.[index] || {}),
          slot: index + 1,
          moduleShapeId: shapeId,
        }))
      : set.compatibleModules
    return normalizeCartridgeSet({
      ...set,
      ...patch,
      id: set.id,
      sourceId: set.sourceId,
      slug: patch.slug || set.slug,
      bonuses: patch.bonuses || set.bonuses,
      compatibleModules,
      availableRarities: patch.availableRarities || set.availableRarities,
      variants: patch.variants || set.variants,
    })
  }),
  ...created,
  ]
}

export function findCartridgeByIdInList(list, id) {
  const key = String(id || '').trim()
  return list.find((set) => set.id === key || set.slug === key || set.sourceId === key) || null
}

export function getCartridgeById(id) {
  const key = String(id || '').trim()
  return cartridgeSets.find((set) => set.id === key || set.slug === key || set.sourceId === key) || null
}

export function getCartridgeBySlug(slug) {
  const key = String(slug || '').trim()
  return cartridgeSets.find((set) => set.slug === key || set.id === key) || null
}

export function getCartridgeSetBonus(cartridgeId, pieces) {
  return normalizeSetBonuses(getCartridgeById(cartridgeId)?.bonuses).find((bonus) => Number(bonus.pieces) === Number(pieces)) || null
}

export function getCartridgeCompatibleModules(cartridgeId) {
  return safeArray(getCartridgeById(cartridgeId)?.compatibleModules)
}

export function getAvailableMainStatsForCartridge() {
  return cartridgeStatOptions.filter((item) => item.allowed && item.scope === 'main')
}

export function getAvailableSubStatsForCartridge() {
  return cartridgeStatOptions.filter((item) => item.allowed && item.scope === 'sub')
}

export function getCartridgeStatValue(rarity = 'S', slotType = 'main', statKey) {
  const statId = normalizeCartridgeStatId(statKey)
  return cartridgeStatValues[rarity]?.[slotType]?.[statId] || null
}

export function formatCartridgeStatValue(statKey, value) {
  return formatRegistryStatValue(normalizeCartridgeStatId(statKey), value)
}

export function getCartridgeStatRows(rarity = 'S', slotType = 'main') {
  const values = cartridgeStatValues[rarity]?.[slotType] || {}
  return Object.entries(values).map(([statId, entry]) => ({
    statId,
    stat: getStatById(statId),
    value: entry.value,
    formattedValue: formatCartridgeStatValue(statId, entry.value),
    notes: entry.notes,
  }))
}

export function resolveBuildCartridge(ref) {
  if (!ref) return { cartridge: null, rarity: 'S', note: '', label: '' }
  const cartridgeId = typeof ref === 'string' ? ref : ref.cartridgeId || ref.id || ref.slug
  return {
    ...(typeof ref === 'object' ? ref : {}),
    cartridgeId,
    rarity: ref.rarity || 'S',
    cartridge: getCartridgeById(cartridgeId),
  }
}
