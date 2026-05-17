import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react'
import { SKILL_TYPES, normalizeSkills } from '../data/skillBlocks.js'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function makeSkill() {
  const id = makeId('skill')
  return {
    id,
    name: 'New skill',
    type: 'Skill',
    icon: '',
    enabled: true,
    descriptionBlocks: [{ id: `${id}-1`, title: 'Description', content: '' }],
    quote: '',
  }
}

function makeDescriptionBlock(skillId) {
  return { id: makeId(`${skillId}-block`), title: 'Description', content: '' }
}

function makeAttributeLevel() {
  return { level: 1, rows: [{ label: '', value: '' }] }
}

function makeMaterial() {
  return { id: makeId('material'), name: 'New material', amount: 0, image: '', sources: ['Data coming soon'] }
}

function cleanSkill(skill) {
  return {
    id: skill.id,
    name: skill.name.trim() || 'Untitled skill',
    type: SKILL_TYPES.includes(skill.type) ? skill.type : 'Other',
    icon: skill.icon.trim(),
    enabled: skill.enabled !== false,
    descriptionBlocks: (skill.descriptionBlocks || [])
      .map((block) => ({
        id: block.id,
        title: block.title.trim() || 'Description',
        content: block.content.trim(),
      }))
      .filter((block) => block.title || block.content),
    quote: skill.quote.trim(),
    attributeLevels: (skill.attributeLevels || [])
      .map((level) => ({
        level: Number(level.level) || 1,
        rows: (level.rows || [])
          .map((row) => ({ label: row.label.trim(), value: row.value.trim() }))
          .filter((row) => row.label || row.value),
      }))
      .filter((level) => level.rows.length),
    upgradeMaterials: (skill.upgradeMaterials || [])
      .map((material) => ({
        id: material.id,
        name: material.name.trim() || 'Untitled material',
        amount: Number(material.amount) || 0,
        image: material.image.trim(),
        sources: (material.sources || []).map((source) => source.trim()).filter(Boolean),
      }))
      .filter((material) => material.name || material.amount || material.image || material.sources.length),
    currencyCost: Number(skill.currencyCost) || 0,
  }
}

export default function SkillsEditor({ character, open, onClose, onSave }) {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    if (!open || !character) return
    setSkills(normalizeSkills(character.skills))
  }, [character, open])

  if (!open || !character) return null

  const updateSkill = (index, patch) => {
    setSkills((current) => current.map((skill, skillIndex) => (skillIndex === index ? { ...skill, ...patch } : skill)))
  }

  const moveSkill = (index, direction) => {
    setSkills((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      const [skill] = next.splice(index, 1)
      next.splice(nextIndex, 0, skill)
      return next
    })
  }

  const updateDescriptionBlock = (skillIndex, blockIndex, patch) => {
    setSkills((current) =>
      current.map((skill, currentSkillIndex) => {
        if (currentSkillIndex !== skillIndex) return skill
        return {
          ...skill,
          descriptionBlocks: (skill.descriptionBlocks || []).map((block, currentBlockIndex) =>
            currentBlockIndex === blockIndex ? { ...block, ...patch } : block,
          ),
        }
      }),
    )
  }

  const moveDescriptionBlock = (skillIndex, blockIndex, direction) => {
    setSkills((current) =>
      current.map((skill, currentSkillIndex) => {
        if (currentSkillIndex !== skillIndex) return skill
        const nextIndex = blockIndex + direction
        const blocks = [...(skill.descriptionBlocks || [])]
        if (nextIndex < 0 || nextIndex >= blocks.length) return skill
        const [block] = blocks.splice(blockIndex, 1)
        blocks.splice(nextIndex, 0, block)
        return { ...skill, descriptionBlocks: blocks }
      }),
    )
  }

  const updateAttributeLevel = (skillIndex, levelIndex, patch) => {
    setSkills((current) =>
      current.map((skill, currentSkillIndex) => {
        if (currentSkillIndex !== skillIndex) return skill
        return {
          ...skill,
          attributeLevels: (skill.attributeLevels || []).map((level, currentLevelIndex) =>
            currentLevelIndex === levelIndex ? { ...level, ...patch } : level,
          ),
        }
      }),
    )
  }

  const updateAttributeRow = (skillIndex, levelIndex, rowIndex, patch) => {
    setSkills((current) =>
      current.map((skill, currentSkillIndex) => {
        if (currentSkillIndex !== skillIndex) return skill
        return {
          ...skill,
          attributeLevels: (skill.attributeLevels || []).map((level, currentLevelIndex) => {
            if (currentLevelIndex !== levelIndex) return level
            return {
              ...level,
              rows: (level.rows || []).map((row, currentRowIndex) => (currentRowIndex === rowIndex ? { ...row, ...patch } : row)),
            }
          }),
        }
      }),
    )
  }

  const updateMaterial = (skillIndex, materialIndex, patch) => {
    setSkills((current) =>
      current.map((skill, currentSkillIndex) => {
        if (currentSkillIndex !== skillIndex) return skill
        return {
          ...skill,
          upgradeMaterials: (skill.upgradeMaterials || []).map((material, currentMaterialIndex) =>
            currentMaterialIndex === materialIndex ? { ...material, ...patch } : material,
          ),
        }
      }),
    )
  }

  const updateMaterialSource = (skillIndex, materialIndex, sourceIndex, value) => {
    setSkills((current) =>
      current.map((skill, currentSkillIndex) => {
        if (currentSkillIndex !== skillIndex) return skill
        return {
          ...skill,
          upgradeMaterials: (skill.upgradeMaterials || []).map((material, currentMaterialIndex) => {
            if (currentMaterialIndex !== materialIndex) return material
            const sources = [...(material.sources || [])]
            sources[sourceIndex] = value
            return { ...material, sources }
          }),
        }
      }),
    )
  }

  const save = () => {
    onSave?.(character.id, { skills: skills.map(cleanSkill) })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="skills-editor-title">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close skills editor" onClick={onClose} />

      <div className="relative z-[111] flex max-h-[min(88vh,840px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 id="skills-editor-title" className="text-lg font-semibold tracking-tight text-[#111111]">
              Edit Abilities
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">{character.name} ability list</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 sm:px-8">
          {skills.map((skill, skillIndex) => (
            <article key={skill.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid min-w-[220px] flex-1 gap-3 sm:grid-cols-[1fr_160px_140px]">
                  <label className="min-w-0">
                    <FieldLabel>Name</FieldLabel>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(event) => updateSkill(skillIndex, { name: event.target.value })}
                      className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white"
                    />
                  </label>
                  <label>
                    <FieldLabel>Type</FieldLabel>
                    <select
                      value={skill.type}
                      onChange={(event) => updateSkill(skillIndex, { type: event.target.value })}
                      className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                    >
                      {SKILL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <FieldLabel>Icon</FieldLabel>
                    <input
                      type="text"
                      value={skill.icon}
                      onChange={(event) => updateSkill(skillIndex, { icon: event.target.value })}
                      placeholder="BA or URL"
                      className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]">
                    <input
                      type="checkbox"
                      checked={skill.enabled !== false}
                      onChange={(event) => updateSkill(skillIndex, { enabled: event.target.checked })}
                      className="rounded border-black/[0.2]"
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    onClick={() => moveSkill(skillIndex, -1)}
                    disabled={skillIndex === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
                    aria-label="Move skill up"
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSkill(skillIndex, 1)}
                    disabled={skillIndex === skills.length - 1}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
                    aria-label="Move skill down"
                  >
                    <ArrowDown className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkills((current) => current.filter((_, currentIndex) => currentIndex !== skillIndex))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-[#b45309] transition hover:bg-amber-50"
                    aria-label="Delete skill"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <label className="mt-4 block">
                <FieldLabel>Quote</FieldLabel>
                <textarea
                  value={skill.quote}
                  onChange={(event) => updateSkill(skillIndex, { quote: event.target.value })}
                  rows={2}
                  className="mt-1.5 w-full resize-y rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white"
                />
              </label>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel>Description Blocks</FieldLabel>
                  <button
                    type="button"
                    onClick={() =>
                      updateSkill(skillIndex, {
                        descriptionBlocks: [...(skill.descriptionBlocks || []), makeDescriptionBlock(skill.id)],
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    Add Description Block
                  </button>
                </div>

                {(skill.descriptionBlocks || []).map((block, blockIndex) => (
                  <div key={block.id} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={block.title}
                        onChange={(event) => updateDescriptionBlock(skillIndex, blockIndex, { title: event.target.value })}
                        className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                      />
                      <button
                        type="button"
                        onClick={() => moveDescriptionBlock(skillIndex, blockIndex, -1)}
                        disabled={blockIndex === 0}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
                        aria-label="Move description block up"
                      >
                        <ArrowUp className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDescriptionBlock(skillIndex, blockIndex, 1)}
                        disabled={blockIndex === (skill.descriptionBlocks || []).length - 1}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
                        aria-label="Move description block down"
                      >
                        <ArrowDown className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSkill(skillIndex, {
                            descriptionBlocks: (skill.descriptionBlocks || []).filter((_, currentIndex) => currentIndex !== blockIndex),
                          })
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                        aria-label="Remove description block"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(event) => updateDescriptionBlock(skillIndex, blockIndex, { content: event.target.value })}
                      rows={3}
                      className="mt-2 w-full resize-y rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm leading-relaxed text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-black/[0.06] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel>Attribute Levels</FieldLabel>
                  <button
                    type="button"
                    onClick={() =>
                      updateSkill(skillIndex, {
                        attributeLevels: [...(skill.attributeLevels || []), makeAttributeLevel()],
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    Add Level
                  </button>
                </div>

                {(skill.attributeLevels || []).map((level, levelIndex) => (
                  <div key={`${skill.id}-level-${levelIndex}`} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <label className="w-28">
                        <FieldLabel>Level</FieldLabel>
                        <input
                          type="number"
                          min="1"
                          value={level.level}
                          onChange={(event) => updateAttributeLevel(skillIndex, levelIndex, { level: event.target.value })}
                          className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateSkill(skillIndex, {
                            attributeLevels: (skill.attributeLevels || []).filter((_, currentIndex) => currentIndex !== levelIndex),
                          })
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3 text-xs font-semibold text-[#6b7280] transition hover:text-[#111111]"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                        Remove Level
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {(level.rows || []).map((row, rowIndex) => (
                        <div key={`${skill.id}-level-${levelIndex}-row-${rowIndex}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                          <input
                            type="text"
                            value={row.label}
                            onChange={(event) => updateAttributeRow(skillIndex, levelIndex, rowIndex, { label: event.target.value })}
                            placeholder="Label"
                            className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                          />
                          <input
                            type="text"
                            value={row.value}
                            onChange={(event) => updateAttributeRow(skillIndex, levelIndex, rowIndex, { value: event.target.value })}
                            placeholder="Value"
                            className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const rows = (level.rows || []).filter((_, currentIndex) => currentIndex !== rowIndex)
                              updateAttributeLevel(skillIndex, levelIndex, { rows })
                            }}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                            aria-label="Remove attribute row"
                          >
                            <X className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateAttributeLevel(skillIndex, levelIndex, { rows: [...(level.rows || []), { label: '', value: '' }] })}
                        className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:text-[#111111]"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                        Add row
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-black/[0.06] pt-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label className="w-44">
                    <FieldLabel>Currency Cost</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={skill.currencyCost}
                      onChange={(event) => updateSkill(skillIndex, { currencyCost: event.target.value })}
                      className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateSkill(skillIndex, {
                        upgradeMaterials: [...(skill.upgradeMaterials || []), makeMaterial()],
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    Add Material
                  </button>
                </div>

                {(skill.upgradeMaterials || []).map((material, materialIndex) => (
                  <div key={material.id} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3">
                    <div className="grid gap-2 sm:grid-cols-[1fr_100px_1fr_auto]">
                      <input
                        type="text"
                        value={material.name}
                        onChange={(event) => updateMaterial(skillIndex, materialIndex, { name: event.target.value })}
                        placeholder="Material name"
                        className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                      />
                      <input
                        type="number"
                        min="0"
                        value={material.amount}
                        onChange={(event) => updateMaterial(skillIndex, materialIndex, { amount: event.target.value })}
                        placeholder="Amount"
                        className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                      />
                      <input
                        type="text"
                        value={material.image}
                        onChange={(event) => updateMaterial(skillIndex, materialIndex, { image: event.target.value })}
                        placeholder="Image path or URL"
                        className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateSkill(skillIndex, {
                            upgradeMaterials: (skill.upgradeMaterials || []).filter((_, currentIndex) => currentIndex !== materialIndex),
                          })
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                        aria-label="Remove material"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {(material.sources || []).map((source, sourceIndex) => (
                        <div key={`${material.id}-source-${sourceIndex}`} className="flex gap-2">
                          <input
                            type="text"
                            value={source}
                            onChange={(event) => updateMaterialSource(skillIndex, materialIndex, sourceIndex, event.target.value)}
                            placeholder="Source"
                            className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                          />
                          <button
                            type="button"
                            onClick={() => updateMaterial(skillIndex, materialIndex, { sources: (material.sources || []).filter((_, currentIndex) => currentIndex !== sourceIndex) })}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                            aria-label="Remove source"
                          >
                            <X className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateMaterial(skillIndex, materialIndex, { sources: [...(material.sources || []), ''] })}
                        className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:text-[#111111]"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                        Add source
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={() => setSkills((current) => [...current, makeSkill()])}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
            Add Skill
          </button>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-white"
          >
            Cancel
          </button>
          <button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
