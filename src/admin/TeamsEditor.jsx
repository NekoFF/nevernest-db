import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react'
import { useAdminMode } from './AdminModeContext.jsx'
import { normalizeTeams } from '../data/teamBlocks.js'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function makeSynergy() {
  return { id: makeId('synergy'), characterId: '', name: 'New synergy', roleLabel: '', notes: [''], enabled: true }
}

function makeMember() {
  return { id: makeId('member'), characterId: '', name: '', role: '', note: '' }
}

function makeTeam() {
  return {
    id: makeId('team'),
    title: 'New team',
    badge: '',
    tag: '',
    enabled: true,
    members: [makeMember()],
    description: '',
    rotation: [''],
    alternatives: [''],
  }
}

function cleanTeams(teams) {
  return {
    synergies: (teams.synergies || []).map((synergy) => ({
      id: synergy.id,
      characterId: synergy.characterId.trim(),
      name: synergy.name.trim(),
      roleLabel: synergy.roleLabel.trim(),
      notes: (synergy.notes || []).map((note) => note.trim()).filter(Boolean),
      enabled: synergy.enabled !== false,
    })),
    recommendedTeams: (teams.recommendedTeams || []).map((team) => ({
      id: team.id,
      title: team.title.trim() || 'Untitled team',
      badge: team.badge.trim(),
      tag: team.tag.trim(),
      enabled: team.enabled !== false,
      members: (team.members || []).map((member) => ({
        characterId: member.characterId.trim(),
        name: member.name.trim(),
        role: member.role.trim(),
        note: member.note.trim(),
      })),
      description: team.description.trim(),
      rotation: (team.rotation || []).map((step) => step.trim()).filter(Boolean),
      alternatives: (team.alternatives || []).map((item) => item.trim()).filter(Boolean),
    })),
  }
}

function CharacterSelect({ value, onChange }) {
  const { mergedCharacters } = useAdminMode()
  const options = useMemo(() => [...mergedCharacters].sort((a, b) => a.name.localeCompare(b.name)), [mergedCharacters])

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
    >
      <option value="">Manual / unknown</option>
      {options.map((character) => (
        <option key={character.id} value={character.id}>
          {character.name} ({character.id})
        </option>
      ))}
    </select>
  )
}

function moveItem(list, index, direction) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= list.length) return list
  const next = [...list]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

function TextListEditor({ items, onChange, addLabel, placeholder }) {
  const list = items || []
  return (
    <div className="space-y-2">
      {list.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(event) => onChange(list.map((current, currentIndex) => (currentIndex === index ? event.target.value : current)))}
            placeholder={placeholder}
            className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
          />
          <button
            type="button"
            onClick={() => onChange(moveItem(list, index, -1))}
            disabled={index === 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
            aria-label="Move item up"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onChange(moveItem(list, index, 1))}
            disabled={index === list.length - 1}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
            aria-label="Move item down"
          >
            <ArrowDown className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onChange(list.filter((_, currentIndex) => currentIndex !== index))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, ''])}
        className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        {addLabel}
      </button>
    </div>
  )
}

export default function TeamsEditor({ character, open, onClose, onSave }) {
  const [teams, setTeams] = useState({ synergies: [], recommendedTeams: [] })

  useEffect(() => {
    if (!open || !character) return
    setTeams(normalizeTeams(character))
  }, [character, open])

  if (!open || !character) return null

  const updateSynergy = (index, patch) => {
    setTeams((current) => ({
      ...current,
      synergies: current.synergies.map((synergy, synergyIndex) => (synergyIndex === index ? { ...synergy, ...patch } : synergy)),
    }))
  }

  const updateTeam = (index, patch) => {
    setTeams((current) => ({
      ...current,
      recommendedTeams: current.recommendedTeams.map((team, teamIndex) => (teamIndex === index ? { ...team, ...patch } : team)),
    }))
  }

  const updateMember = (teamIndex, memberIndex, patch) => {
    setTeams((current) => ({
      ...current,
      recommendedTeams: current.recommendedTeams.map((team, currentTeamIndex) => {
        if (currentTeamIndex !== teamIndex) return team
        return {
          ...team,
          members: team.members.map((member, currentMemberIndex) => (currentMemberIndex === memberIndex ? { ...member, ...patch } : member)),
        }
      }),
    }))
  }

  const save = () => {
    onSave?.(character.id, { teams: cleanTeams(teams) })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="teams-editor-title">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close teams editor" onClick={onClose} />

      <div className="relative z-[111] flex max-h-[min(90vh,860px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 id="teams-editor-title" className="text-lg font-semibold tracking-tight text-[#111111]">
              Edit Teams
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">{character.name} team data</p>
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

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 sm:px-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Synergies</h3>
              <button
                type="button"
                onClick={() => setTeams((current) => ({ ...current, synergies: [...current.synergies, makeSynergy()] }))}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
              >
                <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                Add Synergy
              </button>
            </div>

            {teams.synergies.map((synergy, index) => (
              <article key={synergy.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]">
                    <input type="checkbox" checked={synergy.enabled !== false} onChange={(event) => updateSynergy(index, { enabled: event.target.checked })} />
                    Enabled
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setTeams((current) => ({ ...current, synergies: moveItem(current.synergies, index, -1) }))} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] disabled:opacity-40" aria-label="Move synergy up"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setTeams((current) => ({ ...current, synergies: moveItem(current.synergies, index, 1) }))} disabled={index === teams.synergies.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] disabled:opacity-40" aria-label="Move synergy down"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setTeams((current) => ({ ...current, synergies: current.synergies.filter((_, currentIndex) => currentIndex !== index) }))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309] transition hover:bg-amber-50" aria-label="Delete synergy"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label>
                    <FieldLabel>Character</FieldLabel>
                    <div className="mt-1.5">
                      <CharacterSelect value={synergy.characterId} onChange={(value) => updateSynergy(index, { characterId: value })} />
                    </div>
                  </label>
                  <label>
                    <FieldLabel>Name</FieldLabel>
                    <input type="text" value={synergy.name} onChange={(event) => updateSynergy(index, { name: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25" />
                  </label>
                  <label className="sm:col-span-2">
                    <FieldLabel>Role Label</FieldLabel>
                    <input type="text" value={synergy.roleLabel} onChange={(event) => updateSynergy(index, { roleLabel: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25" />
                  </label>
                </div>
                <div className="mt-3">
                  <FieldLabel>Notes</FieldLabel>
                  <div className="mt-2">
                    <TextListEditor items={synergy.notes} onChange={(notes) => updateSynergy(index, { notes })} addLabel="Add note" placeholder="Synergy note" />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Recommended Teams</h3>
              <button
                type="button"
                onClick={() => setTeams((current) => ({ ...current, recommendedTeams: [...current.recommendedTeams, makeTeam()] }))}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
              >
                <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                Add Recommended Team
              </button>
            </div>

            {teams.recommendedTeams.map((team, teamIndex) => (
              <article key={team.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]">
                    <input type="checkbox" checked={team.enabled !== false} onChange={(event) => updateTeam(teamIndex, { enabled: event.target.checked })} />
                    Enabled
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setTeams((current) => ({ ...current, recommendedTeams: moveItem(current.recommendedTeams, teamIndex, -1) }))} disabled={teamIndex === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] disabled:opacity-40" aria-label="Move team up"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setTeams((current) => ({ ...current, recommendedTeams: moveItem(current.recommendedTeams, teamIndex, 1) }))} disabled={teamIndex === teams.recommendedTeams.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] disabled:opacity-40" aria-label="Move team down"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setTeams((current) => ({ ...current, recommendedTeams: current.recommendedTeams.filter((_, currentIndex) => currentIndex !== teamIndex) }))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309] transition hover:bg-amber-50" aria-label="Delete team"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <label>
                    <FieldLabel>Title</FieldLabel>
                    <input type="text" value={team.title} onChange={(event) => updateTeam(teamIndex, { title: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25" />
                  </label>
                  <label>
                    <FieldLabel>Badge</FieldLabel>
                    <input type="text" value={team.badge} onChange={(event) => updateTeam(teamIndex, { badge: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25" />
                  </label>
                  <label>
                    <FieldLabel>Tag</FieldLabel>
                    <input type="text" value={team.tag} onChange={(event) => updateTeam(teamIndex, { tag: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25" />
                  </label>
                </div>
                <label className="mt-3 block">
                  <FieldLabel>Description</FieldLabel>
                  <textarea value={team.description} onChange={(event) => updateTeam(teamIndex, { description: event.target.value })} rows={3} className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25" />
                </label>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel>Members</FieldLabel>
                    <button type="button" onClick={() => updateTeam(teamIndex, { members: [...team.members, makeMember()] })} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280]"><Plus className="h-3.5 w-3.5" />Add member</button>
                  </div>
                  {team.members.map((member, memberIndex) => (
                    <div key={member.id || memberIndex} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3">
                      <div className="grid gap-2 lg:grid-cols-[1.1fr_1fr_1fr_1.4fr_auto]">
                        <CharacterSelect value={member.characterId} onChange={(value) => updateMember(teamIndex, memberIndex, { characterId: value })} />
                        <input type="text" value={member.name} onChange={(event) => updateMember(teamIndex, memberIndex, { name: event.target.value })} placeholder="Name" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25" />
                        <input type="text" value={member.role} onChange={(event) => updateMember(teamIndex, memberIndex, { role: event.target.value })} placeholder="Role" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25" />
                        <input type="text" value={member.note} onChange={(event) => updateMember(teamIndex, memberIndex, { note: event.target.value })} placeholder="Note" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25" />
                        <div className="flex gap-1">
                          <button type="button" onClick={() => updateTeam(teamIndex, { members: moveItem(team.members, memberIndex, -1) })} disabled={memberIndex === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] disabled:opacity-40" aria-label="Move member up"><ArrowUp className="h-4 w-4" /></button>
                          <button type="button" onClick={() => updateTeam(teamIndex, { members: moveItem(team.members, memberIndex, 1) })} disabled={memberIndex === team.members.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] disabled:opacity-40" aria-label="Move member down"><ArrowDown className="h-4 w-4" /></button>
                          <button type="button" onClick={() => updateTeam(teamIndex, { members: team.members.filter((_, currentIndex) => currentIndex !== memberIndex) })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280]" aria-label="Remove member"><X className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <FieldLabel>Rotation</FieldLabel>
                    <div className="mt-2">
                      <TextListEditor items={team.rotation} onChange={(rotation) => updateTeam(teamIndex, { rotation })} addLabel="Add step" placeholder="Rotation step" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Alternatives</FieldLabel>
                    <div className="mt-2">
                      <TextListEditor items={team.alternatives} onChange={(alternatives) => updateTeam(teamIndex, { alternatives })} addLabel="Add alternative" placeholder="Alternative" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-white">
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
