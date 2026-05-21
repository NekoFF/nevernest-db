import assert from 'node:assert/strict'
import test from 'node:test'
import { characters, getCharacterById } from './characters/index.js'
import { normalizeSkills } from './skillBlocks.js'

const FORBIDDEN_PUBLIC_TEXT = [
  /rawSourceText/i,
  /pdf-extract/i,
  /manual cleanup/i,
  /retained in rawSourceText/i,
  /source pending/i,
  /source unknown/i,
  /needs verification/i,
  /not available yet/i,
  /generated[\\/ ]file/i,
  /import notes/i,
  /developer notes/i,
  /conflict\/debug/i,
  /parser status/i,
]

function pushText(out, value) {
  if (value === null || value === undefined) return
  if (typeof value === 'string' || typeof value === 'number') out.push(String(value))
}

function publicCharacterStrings(character) {
  const out = []
  pushText(out, character.name)
  pushText(out, character.shortDescription)
  pushText(out, character.profileText)
  pushText(out, character.faction)
  pushText(out, character.birthday)
  ;(character.roles || []).forEach((role) => pushText(out, role))
  ;(character.tags || []).forEach((tag) => pushText(out, tag))
  ;(character.voiceActors || []).forEach((actor) => {
    pushText(out, actor.lang)
    pushText(out, actor.name)
  })

  ;(character.overview?.blocks || []).forEach((block) => {
    if (block.enabled === false) return
    pushText(out, block.title)
    pushText(out, block.content)
    ;(block.items || []).forEach((item) => pushText(out, item))
    ;(block.rows || []).forEach((row) => {
      pushText(out, row.label)
      pushText(out, row.value)
    })
  })

  normalizeSkills(character.skills).forEach((skill) => {
    pushText(out, skill.name)
    pushText(out, skill.type)
    pushText(out, skill.quote)
    ;(skill.descriptionBlocks || []).forEach((block) => {
      pushText(out, block.title)
      pushText(out, block.content)
    })
    ;(skill.attributeLevels || []).forEach((level) => {
      ;(level.rows || []).forEach((row) => {
        pushText(out, row.label)
        pushText(out, row.value)
      })
    })
    ;(skill.upgradeMaterials || []).forEach((material) => {
      pushText(out, material.name)
      ;(material.sources || []).forEach((source) => pushText(out, source))
    })
  })

  ;(character.build?.recommendedWeapons || []).forEach((item) => {
    pushText(out, item.label)
    pushText(out, item.note)
  })
  ;(character.build?.recommendedCartridges || []).forEach((item) => {
    pushText(out, item.label)
    pushText(out, item.note)
  })
  ;(character.build?.mainStats || []).forEach((item) => {
    pushText(out, item.label)
    pushText(out, item.note)
  })
  ;(character.build?.subStats || []).forEach((item) => {
    pushText(out, item.label)
    pushText(out, item.note)
  })
  ;(character.build?.endgameStats || []).forEach((item) => {
    pushText(out, item.label)
    pushText(out, item.value)
    pushText(out, item.targetValue)
    pushText(out, item.note)
  })
  ;(character.build?.skillPriority || []).forEach((item) => pushText(out, item))
  ;(character.build?.notes || []).forEach((note) => {
    if (note.enabled === false) return
    pushText(out, note.title)
    pushText(out, note.content)
    pushText(out, note.text)
  })

  const consoleSetup = character.consoleSetup || character.console
  if (consoleSetup) {
    pushText(out, consoleSetup.title)
    pushText(out, consoleSetup.description)
    pushText(out, consoleSetup.mainCartridge)
    pushText(out, consoleSetup.mainCartridgeName)
    pushText(out, consoleSetup.arc)
    pushText(out, consoleSetup.arcName)
    pushText(out, consoleSetup.trait?.title)
    pushText(out, consoleSetup.trait?.description)
    ;(consoleSetup.cartridgeEffects || []).forEach((effect) => pushText(out, effect))
    ;(consoleSetup.cartridgeBonuses || []).forEach((bonus) => pushText(out, bonus.text))
    ;(consoleSetup.notes || []).forEach((note) => pushText(out, note))
  }

  ;(character.teams || []).forEach((team) => {
    pushText(out, team.name)
    pushText(out, team.tag)
    pushText(out, team.type)
    pushText(out, team.description)
    ;(team.members || []).forEach((member) => {
      pushText(out, member.name)
      pushText(out, member.slot)
      pushText(out, member.note)
    })
  })

  ;(character.synergies || []).forEach((synergy) => {
    pushText(out, synergy.name)
    pushText(out, synergy.role)
    pushText(out, synergy.roleLabel)
    ;(synergy.notes || []).forEach((note) => pushText(out, note))
  })

  return out
}

test('public character data does not expose import/debug provenance', () => {
  for (const character of characters) {
    assert.ok(character?.id, 'character exists')
    const publicText = publicCharacterStrings(character)

    for (const text of publicText) {
      for (const pattern of FORBIDDEN_PUBLIC_TEXT) {
        assert.doesNotMatch(text, pattern, `${character.id} public text leaked forbidden phrase: ${text}`)
      }
    }
  }
})

test('Nanally unresolved PDF rows use clean empty values in public skill tables', () => {
  const nanally = getCharacterById('nanally')
  const skills = normalizeSkills(nanally.skills)
  const basic = skills.find((skill) => skill.id === 'colucci-secret-skill')
  const ultimate = skills.find((skill) => skill.id === 'colucci-ultimate-technique')

  for (const skill of [basic, ultimate]) {
    assert.equal(skill.attributeLevels.length, 13)
    for (const level of [5, 10, 12, 13]) {
      const row = skill.attributeLevels.find((entry) => entry.level === level)
      assert.ok(row, `${skill.name} Lv.${level} exists`)
      assert.ok(row.rows.length > 1, `${skill.name} Lv.${level} has attribute rows`)
      assert.ok(row.rows.every((entry) => entry.value === '—'), `${skill.name} Lv.${level} uses clean empty values`)
    }
  }
})
