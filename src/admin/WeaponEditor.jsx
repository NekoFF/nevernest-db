import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const rarityOptions = ['S', 'A', 'B']
const typeOptions = ['Bose', 'Gas', 'Liquid', 'Plasma', 'Solid', 'Synthesis']

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function emptyWeapon() {
  return {
    name: '',
    rarity: 'A',
    type: 'Plasma',
    image: '',
    icon: '',
    shortDescription: '',
    quote: '',
    mainStat: { type: 'ATK', value: 0 },
    subStat: { type: 'ATK%', value: '' },
    refinements: [{ rank: 1, effect: '' }],
    growthScaling: [],
    tags: [],
  }
}

function cleanWeapon(draft) {
  return {
    ...draft,
    name: draft.name.trim(),
    slug: draft.slug || undefined,
    rarity: draft.rarity || 'A',
    type: draft.type || 'Plasma',
    image: draft.image?.trim() || '',
    icon: draft.icon?.trim() || '',
    shortDescription: draft.shortDescription?.trim() || '',
    quote: draft.quote?.trim() || '',
    mainStat: { type: draft.mainStat?.type || 'ATK', value: Number(draft.mainStat?.value) || 0 },
    subStat: { type: draft.subStat?.type || 'ATK%', value: draft.subStat?.value || '' },
    refinements: (draft.refinements || []).map((item, index) => ({ rank: Number(item.rank) || index + 1, effect: item.effect || '' })),
    tags: String(draft.tagsText || '').split(',').map((item) => item.trim()).filter(Boolean),
  }
}

export default function WeaponEditor({ weapon, open, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(emptyWeapon())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const next = weapon ? { ...emptyWeapon(), ...weapon } : emptyWeapon()
    setDraft({ ...next, tagsText: (next.tags || []).join(', ') })
    setError('')
  }, [weapon, open])

  if (!open) return null

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const updateMainStat = (patch) => update({ mainStat: { ...(draft.mainStat || {}), ...patch } })
  const updateSubStat = (patch) => update({ subStat: { ...(draft.subStat || {}), ...patch } })

  const save = () => {
    if (!draft.name.trim()) {
      setError('Name is required.')
      return
    }
    onSave?.(cleanWeapon(draft))
    onClose?.()
  }
  const remove = () => {
    if (!weapon?.id || !onDelete) return
    if (!window.confirm(`Delete ${weapon.name || 'this weapon'} from the local admin database?`)) return
    onDelete(weapon.id)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close weapon editor" onClick={onClose} />
      <div className="relative z-[121] flex max-h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">Admin Mode</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[#111111]">{weapon ? 'Edit Weapon' : 'Add Weapon'}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 sm:px-8">
          {error ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
          <section className="rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-[#111111]">Identity</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label><FieldLabel>Name</FieldLabel><input value={draft.name} onChange={(event) => update({ name: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
              <label><FieldLabel>Rarity</FieldLabel><select value={draft.rarity} onChange={(event) => update({ rarity: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm">{rarityOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Arc Type</FieldLabel><select value={draft.type} onChange={(event) => update({ type: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm">{typeOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Tags</FieldLabel><input value={draft.tagsText || ''} onChange={(event) => update({ tagsText: event.target.value })} placeholder="comma separated" className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            </div>
          </section>
          <section className="rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-[#111111]">Visuals & Text</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label><FieldLabel>Image Path / URL</FieldLabel><input value={draft.image || ''} onChange={(event) => update({ image: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
              <label><FieldLabel>Icon Path / URL</FieldLabel><input value={draft.icon || ''} onChange={(event) => update({ icon: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            </div>
            <label className="mt-3 block"><FieldLabel>Short Description</FieldLabel><textarea value={draft.shortDescription || ''} onChange={(event) => update({ shortDescription: event.target.value })} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-sm" /></label>
            <label className="mt-3 block"><FieldLabel>Passive / Quote</FieldLabel><textarea value={draft.quote || ''} onChange={(event) => update({ quote: event.target.value })} rows={2} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-sm" /></label>
          </section>
          <section className="rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-[#111111]">Stats</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label><FieldLabel>Main Stat Type</FieldLabel><input value={draft.mainStat?.type || ''} onChange={(event) => updateMainStat({ type: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
              <label><FieldLabel>Main Stat Value</FieldLabel><input value={draft.mainStat?.value || ''} onChange={(event) => updateMainStat({ value: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
              <label><FieldLabel>Sub Stat Type</FieldLabel><input value={draft.subStat?.type || ''} onChange={(event) => updateSubStat({ type: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
              <label><FieldLabel>Sub Stat Value</FieldLabel><input value={draft.subStat?.value || ''} onChange={(event) => updateSubStat({ value: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          {weapon && onDelete ? (
            <button type="button" onClick={remove} className="mr-auto rounded-full border border-rose-100 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Delete</button>
          ) : null}
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
