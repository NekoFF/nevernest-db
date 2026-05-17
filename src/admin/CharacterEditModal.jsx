import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import {
  ADMIN_ARC_TYPE_OPTIONS,
  ADMIN_ELEMENT_OPTIONS,
  ADMIN_RARITY_OPTIONS,
  ADMIN_ROLE_OPTIONS,
} from '../data/constants.js'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function emptyCharacter() {
  return {
    id: '',
    name: '',
    rarity: 'A',
    element: 'anima',
    arcType: 'plasma',
    weaponType: '',
    faction: '',
    birthday: '',
    roles: [],
    tags: [],
    shortDescription: '',
    portraitImageUrl: '',
    statusBadge: { type: 'none', label: '' },
    stats: { hp: '', atk: '', def: '', critRate: '', critDmg: '', chargeEfficiency: '' },
    consoleTrait: { title: '', effect: '', trigger: '', statId: '', valuePerModule: '', moduleType: '' },
  }
}

export default function CharacterEditModal({ character, open, onClose, onSave, onCreate, onDelete, onResetOverride }) {
  const [name, setName] = useState('')
  const [rarity, setRarity] = useState('S')
  const [element, setElement] = useState('anima')
  const [arcType, setArcType] = useState('plasma')
  const [weaponType, setWeaponType] = useState('')
  const [faction, setFaction] = useState('')
  const [birthday, setBirthday] = useState('')
  const [roles, setRoles] = useState([])
  const [tagsText, setTagsText] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [portraitImageUrl, setPortraitImageUrl] = useState('')
  const [statusBadge, setStatusBadge] = useState(emptyCharacter().statusBadge)
  const [stats, setStats] = useState(emptyCharacter().stats)
  const [consoleTrait, setConsoleTrait] = useState(emptyCharacter().consoleTrait)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const next = character || emptyCharacter()
    setName(next.name ?? '')
    setRarity(next.rarity ?? 'S')
    setElement(next.element ?? 'anima')
    setArcType(next.arcType ?? 'plasma')
    setWeaponType(next.weaponType ?? '')
    setFaction(next.faction ?? '')
    setBirthday(next.birthday ?? '')
    setRoles(Array.isArray(next.roles) ? [...next.roles] : [])
    setTagsText((next.tags || []).join(', '))
    setShortDescription(next.shortDescription || next.profileText || '')
    setPortraitImageUrl(next.portraitImageUrl ?? '')
    setStats({ ...emptyCharacter().stats, ...(next.stats || {}) })
    setConsoleTrait({ ...emptyCharacter().consoleTrait, ...(next.consoleTrait || {}) })
    setStatusBadge({ ...emptyCharacter().statusBadge, ...(next.statusBadge || { type: next.showNewBadge === true ? 'new' : 'none', label: next.versionLabel || '' }) })
    setError('')
  }, [character, open])

  const roleSet = useMemo(() => new Set(roles), [roles])

  const toggleRole = (role) => {
    setRoles((prev) => {
      const s = new Set(prev)
      if (s.has(role)) s.delete(role)
      else s.add(role)
      return [...s]
    })
  }

  if (!open) return null

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    const payload = {
      name,
      rarity,
      element,
      arcType,
      weaponType: weaponType.trim() || null,
      faction: faction.trim() || null,
      birthday: birthday.trim() || null,
      roles,
      tags: tagsText.split(',').map((item) => item.trim()).filter(Boolean),
      shortDescription: shortDescription.trim(),
      portraitImageUrl: portraitImageUrl.trim(),
      stats,
      consoleTrait: consoleTrait.title || consoleTrait.effect ? consoleTrait : null,
      showNewBadge: statusBadge.type === 'new',
      statusBadge: statusBadge.type === 'none' ? null : statusBadge,
    }
    if (character?.id) onSave?.(character.id, payload)
    else onCreate?.(payload)
    onClose?.()
  }

  const handleReset = () => {
    if (character?.id) onResetOverride?.(character.id)
    onClose?.()
  }

  const handleDelete = () => {
    if (!character?.id || !onDelete) return
    if (!window.confirm(`Delete ${character.name || 'this character'} from the local admin database?`)) return
    onDelete(character.id)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="admin-edit-title">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close modal backdrop" onClick={onClose} />
      <div className="relative z-[101] w-full max-w-lg overflow-hidden rounded-[24px] border border-black/[0.08] bg-white/95 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.18)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="admin-edit-title" className="text-lg font-semibold tracking-tight text-[#111111]">
              {character ? 'Edit character' : 'Add character'}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Core profile (local override)</p>
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

        <div className="mt-6 max-h-[min(60vh,560px)] space-y-4 overflow-y-auto pr-1">
          {error ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
          <div>
            <FieldLabel>Name</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none ring-0 transition focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Rarity</FieldLabel>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
              >
                {ADMIN_RARITY_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Element</FieldLabel>
              <select
                value={element}
                onChange={(e) => setElement(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
              >
                {ADMIN_ELEMENT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel>Arc type</FieldLabel>
            <select
              value={arcType}
              onChange={(e) => setArcType(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
            >
              {ADMIN_ARC_TYPE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Weapon type</FieldLabel>
            <input
              type="text"
              value={weaponType}
              onChange={(e) => setWeaponType(e.target.value)}
              placeholder="e.g. Dual blades"
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Faction</FieldLabel>
            <input
              type="text"
              value={faction}
              onChange={(e) => setFaction(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Birthday</FieldLabel>
            <input
              type="text"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </div>

          <div>
            <FieldLabel>Roles</FieldLabel>
            <div className="mt-2 max-h-40 overflow-y-auto rounded-2xl border border-black/[0.08] bg-[#fafafa] p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ADMIN_ROLE_OPTIONS.map((role) => (
                  <label key={role} className="flex cursor-pointer items-center gap-2 text-sm text-[#111111]">
                    <input type="checkbox" checked={roleSet.has(role)} onChange={() => toggleRole(role)} className="rounded border-black/[0.2]" />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>Role Tags</FieldLabel>
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="comma separated" className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white" />
          </div>

          <div>
            <FieldLabel>Short Description</FieldLabel>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white" />
          </div>

          <div>
            <FieldLabel>Portrait image URL</FieldLabel>
            <input
              type="url"
              value={portraitImageUrl}
              onChange={(e) => setPortraitImageUrl(e.target.value)}
              placeholder="https://… (leave empty for gradient placeholder)"
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </div>

          <section className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-4">
            <FieldLabel>Status Badge</FieldLabel>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <select value={statusBadge.type || 'none'} onChange={(e) => setStatusBadge((current) => ({ ...current, type: e.target.value }))} className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm">
                <option value="none">None</option>
                <option value="new">New</option>
                <option value="coming soon">Coming Soon</option>
                <option value="unknown">Unknown Release</option>
                <option value="version">Version</option>
              </select>
              <input
                value={statusBadge.label || ''}
                onChange={(e) => setStatusBadge((current) => ({ ...current, label: e.target.value }))}
                disabled={statusBadge.type !== 'version'}
                placeholder="Version label, e.g. 1.1"
                className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm disabled:opacity-50"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-4">
            <FieldLabel>Base Stats</FieldLabel>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {Object.keys(stats).map((key) => (
                <input key={key} value={stats[key] || ''} onChange={(e) => setStats((current) => ({ ...current, [key]: e.target.value }))} placeholder={key} className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-4">
            <FieldLabel>Console Trait / Planner Passive</FieldLabel>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input value={consoleTrait.title || ''} onChange={(e) => setConsoleTrait((current) => ({ ...current, title: e.target.value }))} placeholder="Trait name" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
              <input value={consoleTrait.trigger || ''} onChange={(e) => setConsoleTrait((current) => ({ ...current, trigger: e.target.value }))} placeholder="Trigger" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
              <input value={consoleTrait.statId || ''} onChange={(e) => setConsoleTrait((current) => ({ ...current, statId: e.target.value }))} placeholder="Affected stat id, e.g. crit_rate" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
              <input value={consoleTrait.valuePerModule || ''} onChange={(e) => setConsoleTrait((current) => ({ ...current, valuePerModule: e.target.value }))} placeholder="Value per trigger" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
              <input value={consoleTrait.moduleType || ''} onChange={(e) => setConsoleTrait((current) => ({ ...current, moduleType: e.target.value }))} placeholder="Module type, e.g. II" className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
              <textarea value={consoleTrait.effect || ''} onChange={(e) => setConsoleTrait((current) => ({ ...current, effect: e.target.value }))} placeholder="Effect description" rows={2} className="rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm sm:col-span-2" />
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-6">
          {character ? <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-black/[0.1] bg-white px-4 py-2 text-sm font-semibold text-[#b45309] shadow-sm transition hover:bg-amber-50"
          >
            Reset character overrides
          </button> : <span />}
          <div className="flex flex-wrap gap-2">
            {character && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-100 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
