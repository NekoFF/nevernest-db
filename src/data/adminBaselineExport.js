// Generated from C:/Users/melln/Downloads/nte-admin-data-2026-05-21.json5 on 2026-05-21.
// Admin-approved local/dev source-data baseline; do not edit by hand.

export const adminBaselineExport = {
  "version": 2,
  "exportedAt": "2026-05-21T01:27:04.383Z",
  "storage": {
    "mode": "localStorage",
    "backendConnected": false,
    "lastSavedAt": "2026-05-21T01:26:20.694Z",
    "keys": {
      "version": "nte.admin.version",
      "meta": "nte.admin.meta",
      "characters": "nte.admin.characters",
      "weapons": "nte.admin.weapons",
      "cartridges": "nte.admin.cartridges",
      "moduleShapes": "nte.admin.moduleShapes",
      "vehicles": "nte.admin.vehicles",
      "news": "nte.admin.news",
      "codes": "nte.admin.codes",
      "tierList": "nte.admin.tierList"
    }
  },
  "characters": {
    "entries": {
      "nanally": {
        "overview": {
          "blocks": [
            {
              "id": "at-a-glance",
              "type": "text",
              "title": "At a glance",
              "enabled": true,
              "content": "The Ichi-daime of the Coluccis — currently seeking new recruits!"
            },
            {
              "id": "strengths",
              "type": "list",
              "title": "Strengths",
              "enabled": true,
              "items": [
                "Strong follow-up attack damage once Ichi-daime's Authority and Underboss are active.",
                "Straightforward rotation that is easy to understand.",
                "Useful exploration utility through wall-walking.",
                "Can boost Blossom output through her passive."
              ]
            },
            {
              "id": "tradeoffs",
              "type": "list",
              "title": "Tradeoffs",
              "enabled": true,
              "items": [
                "Wants uninterrupted field time.",
                "Loses a significant part of her burst window if forced off-field.",
                "Ichi-daime's Authority does not persist after switching out."
              ]
            },
            {
              "id": "recommended-playstyle",
              "type": "text",
              "title": "Recommended playstyle",
              "enabled": true,
              "content": "Use Skill to enter Ichi-daime's Authority, then use Ultimate to summon Underboss. Stay on-field and use normal attacks to trigger follow-up damage."
            }
          ]
        },
        "skills": [
          {
            "id": "colucci-secret-skill",
            "name": "Colucci Secret Skill",
            "type": "Basic Attack",
            "icon": "BA",
            "enabled": true,
            "descriptionBlocks": [
              {
                "id": "colucci-secret-skill-1",
                "title": "Basic Attack: Colucci Secret Skill",
                "content": "Bares her fangs and brandishes her claws, performing up to 5 consecutive attacks, dealing Anima DMG. Dodging does not interrupt the combo."
              },
              {
                "id": "colucci-secret-skill-2",
                "title": "Basic Attack: Heavy Hitter!",
                "content": "Triggers by holding Basic Attack. Performs up to 3 powerful attacks, dealing Anima DMG. Chains after Critical Riposte and the 1st, 2nd, 3rd, and 4th attacks of Colucci Secret Skill. Dodging does not interrupt the combo."
              },
              {
                "id": "colucci-secret-skill-3",
                "title": "Basic Attack: Colucci Secret Gundo",
                "content": "Enters aim mode, dealing 1 instance of single-target Anima DMG to the enemy in the crosshair."
              },
              {
                "id": "colucci-secret-skill-4",
                "title": "Basic Attack: Grand Entrance!",
                "content": "Swings her claws in the air and plunges, dealing 1 instance of Anima DMG to an area upon impact. Increases DMG based on fall height, up to 200%."
              },
              {
                "id": "colucci-secret-skill-5",
                "title": "Critical Riposte: Can't Touch This!",
                "content": "Triggers when using Colucci Secret Skill after a Critical Dodge. Charges toward the target at full speed, planting one hand on the ground, delivering a roundhouse kick that deals 1 instance of Anima DMG to an area, and reducing Break."
              }
            ],
            "quote": "Said to be a secret combat technique passed down in the Coluccis, though it clearly incorporates many street-fighting elements from Hetherau."
          },
          {
            "id": "colucci-howling-technique",
            "name": "Colucci Howling Technique",
            "type": "Skill",
            "icon": "SK",
            "enabled": true,
            "descriptionBlocks": [
              {
                "id": "colucci-howling-technique-1",
                "title": "Colucci Howling Technique",
                "content": "Hehe, surprise time! Deals 5 instances of Anima DMG to surrounding enemies and wraps herself in Anima Esper Ability, gaining the Ichi-daime's Authority effect. Lasts 12s or until Nanally is switched out. Ends Ichi-daime's Authority early when recast."
              }
            ],
            "quote": "Mint tried to learn this move from Nanally, but the moment she saw that Nanally's hair went rough, curved, split, and knotted, she gave up the idea. Adler is not with her in the Bureau of Anomaly Control to take care of her hair, after all."
          },
          {
            "id": "colucci-ultimate-technique",
            "name": "Colucci Ultimate Technique",
            "type": "Ultimate",
            "icon": "UL",
            "enabled": true,
            "descriptionBlocks": [
              {
                "id": "colucci-ultimate-technique-1",
                "title": "Colucci Ultimate Technique",
                "content": "I'm way stronger than them! Deals 7 instances of Anima DMG immediately to surrounding enemies and summons Underboss to fight alongside her. Creates a small pull effect on surrounding enemies with Nanally's attacks while Underboss is active, and coordinates with all of Nanally's attacks to launch strikes, dealing Anima DMG that also counts as follow-up attack damage."
              }
            ],
            "quote": "A proper gang leader will give her goons some room to shine in the spotlight... I can't fight without my goons?! Ahem, are you having doubts about my strength?"
          },
          {
            "id": "justice-from-above",
            "name": "Justice from Above",
            "type": "Other",
            "icon": "SP",
            "enabled": true,
            "descriptionBlocks": [
              {
                "id": "justice-from-above-1",
                "title": "Justice from Above",
                "content": "Time to get serious! Charges with a spinning motion, delivering a kick and dealing 1 instance of Anima DMG to an area."
              }
            ],
            "quote": "Got a problem? Come find Nanally - I've got you covered!"
          }
        ],
        "materials": {
          "title": "Character Ascension Materials",
          "notes": "",
          "items": [
            {
              "id": "character-material-1778757048754-mayfc",
              "name": "New material",
              "amount": 0,
              "image": "",
              "sources": [
                "Data coming soon"
              ]
            }
          ],
          "currencyCost": 0
        },
        "console": {
          "title": "Type II Specialization",
          "description": "Increases CRIT Rate by 6% for each Type II Module equipped.",
          "mainCartridgeId": "fireflies-and-the-forest",
          "mainCartridgeName": "Fireflies and the Forest",
          "arcId": "ready-ready",
          "arcName": "Ready-Ready",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": "Increases CRIT Rate by 6% for each Type II Module equipped."
          },
          "cartridgeBonuses": [
            {
              "pieces": 2,
              "text": "Anima DMG +10%"
            },
            {
              "pieces": 4,
              "text": "Increases wearer's CRIT DMG by 8% when a nearby enemy takes Anima DMG from the Team, up to 7 stacks. Each stack lasts 10s. Effect remains active when the character is off-field."
            }
          ],
          "requiredPieces": [
            {
              "id": "piece-1",
              "label": "Piece A",
              "moduleShapeId": "type-ii-horizontal",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-2",
              "label": "Piece B",
              "moduleShapeId": "type-ii-vertical",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-3",
              "label": "Piece C",
              "moduleShapeId": "type-iii-horizontal",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-4",
              "label": "Piece D",
              "moduleShapeId": "type-iii-vertical",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            }
          ],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                1,
                0
              ],
              [
                2,
                0
              ],
              [
                3,
                0
              ],
              [
                5,
                0
              ],
              [
                4,
                0
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                5,
                6
              ],
              [
                4,
                6
              ],
              [
                3,
                6
              ],
              [
                2,
                6
              ],
              [
                1,
                6
              ],
              [
                0,
                6
              ],
              [
                0,
                5
              ],
              [
                0,
                4
              ],
              [
                0,
                3
              ],
              [
                0,
                2
              ],
              [
                0,
                1
              ],
              [
                1,
                1
              ],
              [
                1,
                2
              ],
              [
                1,
                3
              ],
              [
                1,
                4
              ],
              [
                1,
                5
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326010794",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326013572",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326017042",
                "modulePieceId": "module-a-type-iv-z-right",
                "moduleShapeId": "type-iv-z-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326022767",
                "modulePieceId": "module-a-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326025830",
                "modulePieceId": "module-b-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326027510",
                "modulePieceId": "module-b-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326035349",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326037850",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Prioritize Type II module count first to scale Nanally's Crit Rate through her console trait.",
            "Recommended layout follows the current reference image with the former green placeholders replaced by real S, A, and B rarity modules."
          ]
        },
        "name": "Nanally",
        "rarity": "S",
        "element": "anima",
        "arcType": "plasma",
        "weaponType": null,
        "faction": "Elbon Antique Shop",
        "birthday": "August 20",
        "roles": [
          "Damage",
          "Main DPS",
          "Follow-up Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/40/5a/17/405a170d05df4de50e01e8c5cd2a7250.jpg"
      },
      "aurelia": {
        "overview": {
          "blocks": [
            {
              "id": "at-a-glance",
              "type": "text",
              "title": "At a glance",
              "enabled": true,
              "content": "Data coming soon"
            },
            {
              "id": "strengths",
              "type": "list",
              "title": "Strengths",
              "enabled": true,
              "items": [
                "Data coming soon"
              ]
            },
            {
              "id": "tradeoffs",
              "type": "list",
              "title": "Tradeoffs",
              "enabled": true,
              "items": [
                "Data coming soon"
              ]
            },
            {
              "id": "recommended-playstyle",
              "type": "text",
              "title": "Recommended playstyle",
              "enabled": true,
              "content": "Data coming soon"
            }
          ]
        },
        "skills": [
          {
            "id": "skill-1778755189395-0sfip",
            "name": "New skill",
            "type": "Life Skill",
            "icon": "",
            "enabled": true,
            "descriptionBlocks": [
              {
                "id": "skill-1778755189395-0sfip-1",
                "title": "Description",
                "content": ""
              }
            ],
            "quote": "dasd"
          }
        ],
        "name": "Aurelia",
        "rarity": "A",
        "element": "psyche",
        "arcType": "plasma",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/b9/c3/bf/b9c3bf51fd9fcff825f55f182ff51f08.jpg",
        "build": {
          "recommendedWeapons": [],
          "recommendedWeaponIds": [],
          "cartridges": [],
          "mainStats": [
            {
              "id": "build-stat-1778775855827-hvjmc",
              "statId": "atk_percent",
              "label": "",
              "note": "",
              "priority": 1,
              "enabled": true
            },
            {
              "id": "build-stat-1778775884297-bg6s5",
              "statId": "def_percent",
              "label": "",
              "note": "",
              "priority": 2,
              "enabled": true
            },
            {
              "id": "build-stat-1778775889365-dz7ss",
              "statId": "dmg_bonus",
              "label": "",
              "note": "",
              "priority": 3,
              "enabled": true
            }
          ],
          "subStats": [],
          "endgameStats": [],
          "skillPriority": [],
          "notes": []
        },
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                1,
                5
              ],
              [
                2,
                5
              ],
              [
                3,
                3
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326420981",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326428209",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326432516",
                "modulePieceId": "module-a-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326435270",
                "modulePieceId": "module-a-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326438693",
                "modulePieceId": "module-b-type-iv-z-right",
                "moduleShapeId": "type-iv-z-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326442247",
                "modulePieceId": "module-b-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326446949",
                "modulePieceId": "module-s-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "sakiri": {
        "name": "Sakiri",
        "rarity": "S",
        "element": "incantation",
        "arcType": "gas",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Defense"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/47/39/3f/47393f8faff9f6e3591c1ceb1ab0237d.jpg",
        "console": {
          "title": "Type III Specialization",
          "description": "Increases Incantation DMG Bonus by 9% for each Type III Module equipped.",
          "mainCartridgeId": "speedy-hedgehog",
          "mainCartridgeName": "Speedy Hedgehog",
          "arcId": "good-boys-grand-adventure",
          "arcName": "Good Boy's Grand Adventure",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Type III Specialization",
            "description": "Incantation DMG Bonus +9% for each Type III Module equipped."
          },
          "cartridgeBonuses": [
            {
              "pieces": 2,
              "text": "Charge Efficiency +12%"
            },
            {
              "pieces": 4,
              "text": "Increases all allies' ATK by 15% for 20s after the wearer casts Ultimate. Effect does not stack."
            }
          ],
          "requiredPieces": [
            {
              "id": "piece-1",
              "label": "Piece A",
              "moduleShapeId": "type-ii-horizontal",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-2",
              "label": "Piece B",
              "moduleShapeId": "type-ii-vertical",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-3",
              "label": "Piece C",
              "moduleShapeId": "type-iii-horizontal",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-4",
              "label": "Piece D",
              "moduleShapeId": "type-iii-vertical",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            }
          ],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                3
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                4,
                5
              ],
              [
                5,
                5
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326072344",
                "modulePieceId": "module-s-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326075469",
                "modulePieceId": "module-s-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326079800",
                "modulePieceId": "module-s-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326081004",
                "modulePieceId": "module-s-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326084899",
                "modulePieceId": "module-b-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326089121",
                "modulePieceId": "module-a-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326092712",
                "modulePieceId": "module-s-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 2,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Prioritize Type III modules to scale Sakiri's Incantation DMG Bonus console trait.",
            "Use Speedy Hedgehog for Charge Efficiency and the team ATK window after Ultimate."
          ]
        }
      },
      "hotori": {
        "name": "Hotori",
        "rarity": "S",
        "element": "cosmos",
        "arcType": "solid",
        "weaponType": null,
        "faction": "Bureau of Anomaly Control",
        "birthday": null,
        "roles": [
          "Support"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/b8/ae/2a/b8ae2ac06a1ea240a16e7ef05eda8e10.jpg",
        "build": {
          "recommendedWeapons": [
            {
              "id": "recommended-weapon-1778783080085-teqvv",
              "weaponId": "song-of-the-whale",
              "label": "Best in Slot",
              "note": "",
              "priority": 1,
              "enabled": true
            }
          ],
          "recommendedWeaponIds": [
            "song-of-the-whale"
          ],
          "recommendedCartridges": [
            {
              "id": "recommended-cartridge-1778783049360-9f9dx",
              "cartridgeId": "lost-radiance",
              "rarity": "S",
              "label": "Best in Slot",
              "note": "",
              "priority": 1,
              "enabled": true
            }
          ],
          "mainStats": [
            {
              "id": "build-stat-1778774806187-ubonk",
              "statId": "def",
              "label": "",
              "note": "",
              "priority": 1,
              "enabled": true
            },
            {
              "id": "build-stat-1778774846319-j2i9v",
              "statId": "dmg_bonus",
              "label": "",
              "note": "",
              "priority": 2,
              "enabled": true
            },
            {
              "id": "build-stat-1778774854221-ita7n",
              "statId": "atk",
              "label": "",
              "note": "",
              "priority": 3,
              "enabled": true
            }
          ],
          "subStats": [
            {
              "id": "build-stat-1778774816669-bbyib",
              "statId": "crit_rate",
              "label": "",
              "note": "",
              "priority": 1,
              "enabled": true
            },
            {
              "id": "build-stat-1778774816810-80t1p",
              "statId": "atk",
              "label": "",
              "note": "",
              "priority": 2,
              "enabled": true
            }
          ],
          "endgameStats": [],
          "skillPriority": [],
          "notes": []
        },
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "lost-radiance",
          "mainCartridgeName": "Lost Radiance",
          "arcId": "marching-beyond-time",
          "arcName": "Marching Beyond Time",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [
            {
              "pieces": 2,
              "text": "Cosmos DMG +10%.",
              "description": "Cosmos DMG +10%.",
              "effects": [
                {
                  "type": "stat",
                  "stat": "cosmosDmg",
                  "operation": "add",
                  "value": 10,
                  "valueType": "percent",
                  "condition": null,
                  "autoApply": true
                }
              ],
              "structured": true
            },
            {
              "pieces": 4,
              "text": "Ignores 25% of enemies' DEF for 20s after the wearer casts Ultimate. Effect does not stack.",
              "description": "Ignores 25% of enemies' DEF for 20s after the wearer casts Ultimate. Effect does not stack.",
              "effects": [
                {
                  "autoApply": false,
                  "effectKey": "enemy_def_ignore",
                  "value": 25,
                  "valueType": "percent",
                  "condition": {
                    "trigger": "after_wearer_casts_ultimate",
                    "durationSeconds": 20,
                    "stacks": false,
                    "effectStacks": false
                  },
                  "type": "conditional"
                }
              ],
              "structured": true
            }
          ],
          "requiredPieces": [
            {
              "id": "piece-1",
              "label": "Piece A",
              "moduleShapeId": "type-ii-horizontal",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-2",
              "label": "Piece B",
              "moduleShapeId": "type-ii-vertical",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-3",
              "label": "Piece C",
              "moduleShapeId": "type-iii-horizontal",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-4",
              "label": "Piece D",
              "moduleShapeId": "type-iii-vertical",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            }
          ],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                4
              ],
              [
                0,
                3
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                3
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                4,
                5
              ],
              [
                5,
                5
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325867765",
                "modulePieceId": "module-a-type-iv-horizontal",
                "moduleShapeId": "type-iv-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325878709",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325883054",
                "modulePieceId": "module-b-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325892341",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325895223",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325904175",
                "modulePieceId": "module-b-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325907578",
                "modulePieceId": "module-s-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "zero-female": {
        "name": "Zero Female",
        "rarity": "S",
        "element": "cosmos",
        "arcType": "solid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/92/89/e3/9289e384a7d4270fc43fc5babe3800ee.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                1,
                5
              ],
              [
                2,
                5
              ],
              [
                0,
                4
              ],
              [
                0,
                3
              ],
              [
                0,
                2
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                6,
                2
              ],
              [
                6,
                4
              ],
              [
                6,
                3
              ],
              [
                3,
                3
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326192799",
                "modulePieceId": "module-s-type-iv-vertical",
                "moduleShapeId": "type-iv-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326198146",
                "modulePieceId": "module-a-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326207734",
                "modulePieceId": "module-b-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326214178",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326231215",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "group-blue",
                "visualColor": "group-blue",
                "colorKey": "group-blue",
                "visualGroup": "group-blue",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326236679",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326241408",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "zero-male": {
        "name": "Zero Male",
        "rarity": "S",
        "element": "cosmos",
        "arcType": "solid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/33/71/90/337190073bac515777e7062ab0500974.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                1,
                5
              ],
              [
                2,
                5
              ],
              [
                3,
                3
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326296513",
                "modulePieceId": "module-s-type-iv-vertical",
                "moduleShapeId": "type-iv-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326301075",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326302867",
                "modulePieceId": "module-b-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326304332",
                "modulePieceId": "module-b-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326309100",
                "modulePieceId": "module-a-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326313756",
                "modulePieceId": "module-s-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326316375",
                "modulePieceId": "module-s-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 2,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "skia": {
        "name": "Skia",
        "rarity": "A",
        "element": "lakshana",
        "arcType": "plasma",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Support"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/76/2a/12/762a12150b5542a28cab99d66bc6df98.jpg",
        "console": {
          "title": "Type III Specialization",
          "description": "Increases ATK by 10% for each Type III Module equipped.",
          "mainCartridgeId": "street-boxer",
          "mainCartridgeName": "Street Boxer",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": "Increases ATK by 10% for each Type III Module equipped."
          },
          "cartridgeBonuses": [
            {
              "pieces": 2,
              "text": "Lakshana DMG +10%"
            },
            {
              "pieces": 4,
              "text": "CRIT Rate +14%; can reach 28% for 20s when team triggers Remora or Stain. Exact wording needs verification."
            }
          ],
          "requiredPieces": [
            {
              "id": "piece-1",
              "label": "Piece A",
              "moduleShapeId": "type-ii-horizontal",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-2",
              "label": "Piece B",
              "moduleShapeId": "type-ii-vertical",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-3",
              "label": "Piece C",
              "moduleShapeId": "type-iii-horizontal",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-4",
              "label": "Piece D",
              "moduleShapeId": "type-iii-vertical",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            }
          ],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                4
              ],
              [
                1,
                1
              ],
              [
                0,
                3
              ],
              [
                6,
                4
              ],
              [
                6,
                3
              ],
              [
                6,
                2
              ],
              [
                5,
                5
              ],
              [
                4,
                3
              ],
              [
                4,
                4
              ],
              [
                3,
                4
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326750358",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326754768",
                "modulePieceId": "module-s-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326757298",
                "modulePieceId": "module-a-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326758761",
                "modulePieceId": "module-a-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326763531",
                "modulePieceId": "module-b-type-iv-z-left",
                "moduleShapeId": "type-iv-z-left",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326770039",
                "modulePieceId": "module-s-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326779749",
                "modulePieceId": "module-b-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 5,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Exact grid placement was not forced; the workbook says screenshots show a recommended pattern that should be configured manually.",
            "Use Type III modules to scale the source-pending ATK console trait."
          ]
        }
      },
      "chiz": {
        "name": "Chiz",
        "rarity": "S",
        "element": "cosmos",
        "arcType": "gas",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/06/e7/2c/06e72c60fc431f3251d64f2fa1a5c955.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                4,
                4
              ],
              [
                4,
                3
              ],
              [
                3,
                4
              ],
              [
                1,
                1
              ],
              [
                5,
                5
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325451452",
                "modulePieceId": "module-s-type-iv-vertical",
                "moduleShapeId": "type-iv-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325456843",
                "modulePieceId": "module-s-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325463156",
                "modulePieceId": "module-a-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325466564",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325471624",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-pink",
                "visualColor": "group-pink",
                "colorKey": "group-pink",
                "visualGroup": "group-pink",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325476607",
                "modulePieceId": "module-s-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325487750",
                "modulePieceId": "module-s-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "jiuyuan": {
        "name": "Jiuyuan",
        "rarity": "S",
        "element": "anima",
        "arcType": "solid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/22/ab/9a/22ab9ab1d5da6d9af4cfe59b8b105032.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                1
              ],
              [
                1,
                2
              ],
              [
                1,
                3
              ],
              [
                1,
                4
              ],
              [
                1,
                5
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325947627",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325949679",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325952763",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325954738",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325959983",
                "modulePieceId": "module-b-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325967891",
                "modulePieceId": "module-b-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325975259",
                "modulePieceId": "module-s-type-iv-z-right",
                "moduleShapeId": "type-iv-z-right",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325978051",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 2,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "fadia": {
        "name": "Fadia",
        "rarity": "S",
        "element": "psyche",
        "arcType": "bose",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/29/de/61/29de612f12d5f7972c9fe1cb4d2d30b9.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                5
              ],
              [
                2,
                5
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                3,
                3
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325685270",
                "modulePieceId": "module-s-type-iv-horizontal",
                "moduleShapeId": "type-iv-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325688665",
                "modulePieceId": "module-s-type-iv-z-left",
                "moduleShapeId": "type-iv-z-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325700048",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325703721",
                "modulePieceId": "module-a-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325708916",
                "modulePieceId": "module-b-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325711534",
                "modulePieceId": "module-b-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325721992",
                "modulePieceId": "module-a-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325726220",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "lacrimosa": {
        "name": "Lacrimosa",
        "rarity": "S",
        "element": "chaos",
        "arcType": "liquid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Special"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/b1/db/f8/b1dbf81cf992470786df6359847d23c4.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779147053622",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "moduleType": "Type II",
                "rarity": "S",
                "colorKey": "s",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779147054670",
                "modulePieceId": "module-s-type-iv-z-left",
                "moduleShapeId": "type-iv-z-left",
                "moduleType": "Type IV",
                "rarity": "S",
                "colorKey": "s",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779147197456",
                "modulePieceId": "module-s-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "S",
                "colorKey": "helper-2",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "hathor": {
        "name": "Hathor",
        "rarity": "S",
        "element": "lakshana",
        "arcType": "plasma",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Support"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/89/e8/c1/89e8c10dd7f99a72d95980dfbd867724.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                4
              ],
              [
                0,
                3
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                5
              ],
              [
                2,
                5
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                3,
                3
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325759508",
                "modulePieceId": "module-s-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325762715",
                "modulePieceId": "module-s-type-iv-z-left",
                "moduleShapeId": "type-iv-z-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325780555",
                "modulePieceId": "module-a-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325783132",
                "modulePieceId": "module-b-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325787261",
                "modulePieceId": "module-a-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325794875",
                "modulePieceId": "module-s-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325797375",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "baicang": {
        "name": "Baicang",
        "rarity": "S",
        "element": "incantation",
        "arcType": "bose",
        "weaponType": null,
        "faction": "Veilwalker-aligned operative",
        "birthday": null,
        "roles": [
          "Special"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/0c/d5/9e/0cd59eb2031148336c1178340639b473.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                4
              ],
              [
                0,
                3
              ],
              [
                6,
                2
              ],
              [
                6,
                4
              ],
              [
                6,
                3
              ],
              [
                1,
                1
              ],
              [
                5,
                5
              ],
              [
                4,
                3
              ],
              [
                3,
                4
              ],
              [
                4,
                4
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325336210",
                "modulePieceId": "module-s-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325342695",
                "modulePieceId": "module-a-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325361162",
                "modulePieceId": "module-b-type-iv-z-left",
                "moduleShapeId": "type-iv-z-left",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325367592",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325387218",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-blue",
                "visualColor": "group-blue",
                "colorKey": "group-blue",
                "visualGroup": "group-blue",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325401051",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325405968",
                "modulePieceId": "module-a-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "daffodil": {
        "name": "Daffodil",
        "rarity": "S",
        "element": "chaos",
        "arcType": "liquid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Support"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/68/55/90/685590025648878a80bb123709fc7a21.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                4
              ],
              [
                0,
                3
              ],
              [
                0,
                2
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                5
              ],
              [
                2,
                5
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                3,
                3
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779325532007",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325538582",
                "modulePieceId": "module-s-type-iv-horizontal",
                "moduleShapeId": "type-iv-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325546927",
                "modulePieceId": "module-a-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325552976",
                "modulePieceId": "module-a-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325569782",
                "modulePieceId": "module-b-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325576039",
                "modulePieceId": "module-b-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779325578970",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 3,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "adler": {
        "name": "Adler",
        "rarity": "A",
        "element": "incantation",
        "arcType": "bose",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/0b/f4/28/0bf428c5dd36d3c2ff3a1cf94b6915fb.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                0,
                2
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                4,
                5
              ],
              [
                5,
                5
              ],
              [
                1,
                3
              ],
              [
                2,
                3
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326351701",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326367587",
                "modulePieceId": "module-s-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326370924",
                "modulePieceId": "module-a-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326373771",
                "modulePieceId": "module-a-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326382674",
                "modulePieceId": "module-b-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326386174",
                "modulePieceId": "module-s-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326389757",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "group-blue",
                "visualColor": "group-blue",
                "colorKey": "group-blue",
                "visualGroup": "group-blue",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 4,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "mint": {
        "name": "Mint",
        "rarity": "A",
        "element": "anima",
        "arcType": "solid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Support"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/3a/97/46/3a9746ed8c2b16f00047f756f0c7e221.jpg",
        "console": {
          "title": "Type III Specialization",
          "description": "Increases CRIT Rate by 8% for each Type III Module equipped.",
          "mainCartridgeId": "fireflies-and-the-forest",
          "mainCartridgeName": "Fireflies and the Forest",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": "Increases CRIT Rate by 8% for each Type III Module equipped."
          },
          "cartridgeBonuses": [
            {
              "pieces": 2,
              "text": "Anima DMG +10%"
            },
            {
              "pieces": 4,
              "text": "Increases wearer's CRIT DMG by 8% when a nearby enemy takes Anima DMG from the team, up to 7 stacks. Each stack lasts 10s. Effect remains active when the character is off-field."
            }
          ],
          "requiredPieces": [
            {
              "id": "piece-1",
              "label": "Piece A",
              "moduleShapeId": "type-ii-horizontal",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-2",
              "label": "Piece B",
              "moduleShapeId": "type-ii-vertical",
              "moduleType": "Type II",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-3",
              "label": "Piece C",
              "moduleShapeId": "type-iii-horizontal",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            },
            {
              "id": "piece-4",
              "label": "Piece D",
              "moduleShapeId": "type-iii-vertical",
              "moduleType": "Type III",
              "preferredRarity": "S",
              "pieceColor": "s",
              "visualColor": "s",
              "colorKey": "s",
              "visualGroup": "s"
            }
          ],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                5,
                5
              ],
              [
                4,
                4
              ],
              [
                3,
                4
              ],
              [
                4,
                3
              ],
              [
                1,
                1
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326671420",
                "modulePieceId": "module-a-type-iv-z-right",
                "moduleShapeId": "type-iv-z-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type IV",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326681228",
                "modulePieceId": "module-a-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326685309",
                "modulePieceId": "module-b-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326691274",
                "modulePieceId": "module-s-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326712768",
                "modulePieceId": "module-b-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326723973",
                "modulePieceId": "module-s-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326725935",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Exact grid placement was not forced; final placement can be adjusted manually in local development tooling.",
            "Use Type III modules to scale the source-pending CRIT Rate console trait."
          ]
        }
      },
      "edgar": {
        "name": "Edgar",
        "rarity": "A",
        "element": "cosmos",
        "arcType": "liquid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Defense"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/6e/2a/8b/6e2a8bb1fac9f55d33f854fda8b217e8.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                1,
                1
              ],
              [
                0,
                2
              ],
              [
                1,
                2
              ],
              [
                0,
                3
              ],
              [
                1,
                3
              ],
              [
                0,
                4
              ],
              [
                1,
                4
              ],
              [
                1,
                5
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326475737",
                "modulePieceId": "module-s-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326482564",
                "modulePieceId": "module-s-type-iii-vertical",
                "moduleShapeId": "type-iii-vertical",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 5,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326491071",
                "modulePieceId": "module-a-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326502001",
                "modulePieceId": "module-b-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326516985",
                "modulePieceId": "module-s-type-iii-horizontal",
                "moduleShapeId": "type-iii-horizontal",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 5,
                "col": 2,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326525342",
                "modulePieceId": "module-a-type-ii-horizontal",
                "moduleShapeId": "type-ii-horizontal",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326530388",
                "modulePieceId": "module-s-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 1,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      },
      "hanizel": {
        "name": "Hanizel",
        "rarity": "A",
        "element": "psyche",
        "arcType": "solid",
        "weaponType": null,
        "faction": "Independent",
        "birthday": null,
        "roles": [
          "Attack"
        ],
        "portraitImageUrl": "https://i.pinimg.com/736x/fc/a2/36/fca2366e2f14569bba52c37696bca2b4.jpg",
        "console": {
          "title": "Console Setup",
          "description": "",
          "mainCartridgeId": "",
          "mainCartridgeName": "",
          "arcId": "",
          "arcName": "",
          "rarityPriority": "S > A > B",
          "trait": {
            "title": "Console Trait",
            "description": ""
          },
          "cartridgeBonuses": [],
          "requiredPieces": [],
          "grid": {
            "rows": 7,
            "cols": 7,
            "blockedCells": [
              [
                0,
                0
              ],
              [
                0,
                1
              ],
              [
                0,
                5
              ],
              [
                0,
                6
              ],
              [
                1,
                0
              ],
              [
                1,
                6
              ],
              [
                2,
                0
              ],
              [
                2,
                6
              ],
              [
                3,
                0
              ],
              [
                3,
                6
              ],
              [
                4,
                0
              ],
              [
                4,
                6
              ],
              [
                5,
                0
              ],
              [
                5,
                6
              ],
              [
                6,
                0
              ],
              [
                6,
                1
              ],
              [
                6,
                5
              ],
              [
                6,
                6
              ],
              [
                0,
                2
              ],
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                6,
                2
              ],
              [
                6,
                3
              ],
              [
                6,
                4
              ],
              [
                1,
                3
              ],
              [
                2,
                3
              ],
              [
                4,
                1
              ],
              [
                5,
                1
              ],
              [
                4,
                5
              ],
              [
                5,
                5
              ]
            ],
            "placements": [
              {
                "id": "layout-piece-1779326576197",
                "modulePieceId": "module-s-type-iii-l-bottom-left",
                "moduleShapeId": "type-iii-l-bottom-left",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326577954",
                "modulePieceId": "module-s-type-iii-l-top-right",
                "moduleShapeId": "type-iii-l-top-right",
                "rarity": "S",
                "pieceColor": "s",
                "visualColor": "s",
                "colorKey": "s",
                "visualGroup": "s",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 1,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326583114",
                "modulePieceId": "module-a-type-iii-l-top-left",
                "moduleShapeId": "type-iii-l-top-left",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326585759",
                "modulePieceId": "module-a-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "A",
                "pieceColor": "a",
                "visualColor": "a",
                "colorKey": "a",
                "visualGroup": "a",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 2,
                "col": 1,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326591995",
                "modulePieceId": "module-b-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "B",
                "pieceColor": "b",
                "visualColor": "b",
                "colorKey": "b",
                "visualGroup": "b",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 3,
                "col": 3,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326598752",
                "modulePieceId": "module-s-type-ii-vertical",
                "moduleShapeId": "type-ii-vertical",
                "rarity": "S",
                "pieceColor": "group-purple",
                "visualColor": "group-purple",
                "colorKey": "group-purple",
                "visualGroup": "group-purple",
                "moduleType": "Type II",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 4,
                "rotation": 0
              },
              {
                "id": "layout-piece-1779326601787",
                "modulePieceId": "module-s-type-iii-l-bottom-right",
                "moduleShapeId": "type-iii-l-bottom-right",
                "rarity": "S",
                "pieceColor": "group-green",
                "visualColor": "group-green",
                "colorKey": "group-green",
                "visualGroup": "group-green",
                "moduleType": "Type III",
                "fixedMainStats": [
                  "atk",
                  "hp"
                ],
                "subStats": [],
                "row": 4,
                "col": 2,
                "rotation": 0
              }
            ]
          },
          "notes": [
            "Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options."
          ]
        }
      }
    },
    "created": [],
    "deleted": []
  },
  "weapons": {
    "entries": {},
    "created": [],
    "deleted": []
  },
  "cartridges": {
    "lost-radiance": {
      "name": "Lost Radiance",
      "theme": "Cosmos",
      "element": "Cosmos",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Cosmos DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Ignores 25% of enemies' DEF for 20s after the wearer casts Ultimate. Effect does not stack."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-horizontal",
        "type-iii-l-bottom-right",
        "type-iii-l-bottom-left",
        "type-iv-vertical"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-vertical"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-horizontal",
        "type-iii-l-bottom-right",
        "type-iii-l-bottom-left",
        "type-iv-vertical"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-vertical"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:12:10.702Z"
    },
    "fireflies-and-the-forest": {
      "name": "Fireflies and the Forest",
      "theme": "Anima",
      "element": "Anima",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Anima DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's CRIT DMG by 8% when a nearby enemy takes Anima DMG from the Team, up to 7 stacks. Each stack lasts 10s. Effect remains active when the character is off-field."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-vertical",
        "type-iii-vertical",
        "type-iii-l-bottom-right",
        "type-iv-z-right"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-vertical",
        "type-iii-vertical",
        "type-iii-l-bottom-right",
        "type-iv-z-right"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:11:29.113Z"
    },
    "crimson-twin-butterflies": {
      "name": "Crimson: Twin Butterflies",
      "theme": "Incantation",
      "element": "Incantation",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Incantation DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's ATK by 6% when a nearby enemy takes Incantation DMG from the Team, up to 6 stacks. Each stack lasts 10s. Effect remains active when the character is off-field."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-vertical",
        "type-iii-horizontal",
        "type-iii-l-top-left",
        "type-iv-z-left"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-top-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-left"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-vertical",
        "type-iii-horizontal",
        "type-iii-l-top-left",
        "type-iv-z-left"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-top-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-left"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:08:16.969Z"
    },
    "devils-blood-curse": {
      "name": "Devil's Blood: Curse",
      "theme": "Psyche",
      "element": "Psyche",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Psyche DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's DMG by 18%. The bonus becomes 36% against units affected by Nova or Stain."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-vertical",
        "type-iii-vertical",
        "type-iii-l-top-right",
        "type-iv-z-right"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-top-right"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-vertical",
        "type-iii-vertical",
        "type-iii-l-top-right",
        "type-iv-z-right"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-top-right"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:08:58.431Z"
    },
    "diabolos": {
      "name": "Diabolos",
      "theme": "Chaos",
      "element": "Chaos",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Chaos DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Ignores 12% of enemies' Chaos RES. Ignores 24% of enemies' Chaos RES for 20s after the wearer participates in Nova or Scorch reactions."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-horizontal",
        "type-iii-l-top-right",
        "type-iii-l-top-left",
        "type-iv-horizontal"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-l-top-right"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-top-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-horizontal"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-horizontal",
        "type-iii-l-top-right",
        "type-iii-l-top-left",
        "type-iv-horizontal"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-l-top-right"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-top-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-horizontal"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:10:43.661Z"
    },
    "kingdoms-guard": {
      "name": "Kingdom's Guard",
      "theme": "DEF",
      "element": "",
      "bonusCategory": "defense",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "DEF +15%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's shields by 20%."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-iii-horizontal",
        "type-iii-vertical",
        "type-iii-l-bottom-left",
        "type-iii-l-top-left"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iii-l-top-left"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-iii-horizontal",
        "type-iii-vertical",
        "type-iii-l-bottom-left",
        "type-iii-l-top-left"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iii-l-top-left"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:12:59.538Z"
    },
    "quiet-manor": {
      "name": "Quiet Manor",
      "theme": "Mental DMG",
      "element": "Cognitive",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Mental DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Grants wearer a 12% Mental DMG Bonus per Basic Attack, up to 3 stacks. Each stack lasts 6s."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-horizontal",
        "type-ii-vertical",
        "type-iv-vertical",
        "type-iv-z-right"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iv-vertical"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-horizontal",
        "type-ii-vertical",
        "type-iv-vertical",
        "type-iv-z-right"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iv-vertical"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:13:29.778Z"
    },
    "shadow-creed": {
      "name": "Shadow Creed",
      "theme": "ATK",
      "element": "",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "ATK +10%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's ATK by 25% for 20s after casting a Skill."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-horizontal",
        "type-ii-vertical",
        "type-iv-horizontal",
        "type-iv-z-right"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iv-horizontal"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-horizontal",
        "type-ii-vertical",
        "type-iv-horizontal",
        "type-iv-z-right"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iv-horizontal"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-right"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:25:35.640Z"
    },
    "street-boxer": {
      "name": "Street Boxer",
      "theme": "Lakshana",
      "element": "Lakshana",
      "bonusCategory": "damage",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Lakshana DMG +10%."
        },
        {
          "pieces": 4,
          "text": "Increases Crit Chance by 14%. Team triggering Remora or Stain increases the bonus to 14% for 20s."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-horizontal",
        "type-iii-horizontal",
        "type-iii-l-bottom-left",
        "type-iv-z-left"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-left"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-horizontal",
        "type-iii-horizontal",
        "type-iii-l-bottom-left",
        "type-iv-z-left"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-left"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:14:50.637Z"
    },
    "speedy-hedgehog": {
      "name": "Speedy Hedgehog",
      "theme": "Charge Efficiency",
      "element": "",
      "bonusCategory": "utility",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "Charge Efficiency +12%."
        },
        {
          "pieces": 4,
          "text": "Increases all allies' ATK by 15% for 20s after the wearer casts Ultimate. Effect does not stack."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-iii-l-bottom-right",
        "type-iii-l-top-right",
        "type-iii-l-bottom-left",
        "type-iii-l-top-left"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-l-top-right"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iii-l-top-left"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-iii-l-bottom-right",
        "type-iii-l-top-right",
        "type-iii-l-bottom-left",
        "type-iii-l-top-left"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-l-top-right"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-left"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iii-l-top-left"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:32:18.429Z"
    },
    "theas-night-tavern": {
      "name": "Thea's Night Tavern",
      "theme": "HP",
      "element": "",
      "bonusCategory": "defense",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "HP +10%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's Healing Bonus by 20%."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-iii-horizontal",
        "type-iii-vertical",
        "type-iii-l-bottom-right",
        "type-iii-l-top-right"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iii-l-top-right"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-iii-horizontal",
        "type-iii-vertical",
        "type-iii-l-bottom-right",
        "type-iii-l-top-right"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-iii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-iii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iii-l-bottom-right"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iii-l-top-right"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:16:20.064Z"
    },
    "tiny-big-adventure": {
      "name": "Tiny Big Adventure",
      "theme": "HP",
      "element": "",
      "bonusCategory": "defense",
      "description": "Console Cartridge. Activate by pairing it to a Console.",
      "image": "",
      "icon": "",
      "availableRarities": [
        "B",
        "A",
        "S"
      ],
      "bonuses": [
        {
          "pieces": 2,
          "text": "HP +10%."
        },
        {
          "pieces": 4,
          "text": "Increases wearer's Max HP by 4% when taking damage, up to 10 stacks. Each stack lasts 10s. Casting Ultimate instantly grants 10 stacks."
        }
      ],
      "compatibleModuleShapeIds": [
        "type-ii-horizontal",
        "type-ii-vertical",
        "type-iv-horizontal",
        "type-iv-z-left"
      ],
      "compatibleModules": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iv-horizontal"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-left"
        }
      ],
      "requiredSetPieceShapeIds": [
        "type-ii-horizontal",
        "type-ii-vertical",
        "type-iv-horizontal",
        "type-iv-z-left"
      ],
      "requiredSetPieces": [
        {
          "slot": 1,
          "moduleShapeId": "type-ii-horizontal"
        },
        {
          "slot": 2,
          "moduleShapeId": "type-ii-vertical"
        },
        {
          "slot": 3,
          "moduleShapeId": "type-iv-horizontal"
        },
        {
          "slot": 4,
          "moduleShapeId": "type-iv-z-left"
        }
      ],
      "compatibleModulesVerified": true,
      "compatibleModulesSource": "admin-local-override",
      "dataStatus": "admin-verified-compatible-shapes",
      "adminUpdatedAt": "2026-05-15T22:16:48.724Z"
    }
  },
  "moduleShapes": {
    "entries": {},
    "created": [],
    "deleted": []
  },
  "vehicles": {
    "entries": {},
    "created": [],
    "deleted": []
  },
  "codes": {
    "entries": {},
    "created": [],
    "deleted": []
  },
  "news": {
    "entries": {},
    "created": [],
    "deleted": []
  },
  "tierList": null
}
