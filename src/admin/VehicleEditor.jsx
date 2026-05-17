import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const typeOptions = ['Car', 'Sports Car', 'Convertible Sports Car', 'Hypercar', 'Motorcycle', 'SUV', 'Scooter', 'Kart', 'Special']
const currencyOptions = ['fons', 'special', 'unknown']

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function emptyVehicle() {
  return {
    name: '',
    assetKey: '',
    type: 'Car',
    currency: 'fons',
    price: '',
    maxSpeed: 0,
    acceleration: 0,
    durability: 0,
    description: '',
    handling: { speedShifting: 0, suspensionHeight: 0, suspensionDamping: 0, handbrake: 0, brakingPower: 0 },
    sortOrder: 0,
  }
}

function cleanVehicle(draft) {
  return {
    ...draft,
    name: draft.name.trim(),
    assetKey: draft.assetKey?.trim() || draft.name.trim(),
    price: Number(draft.price) || draft.price || '',
    maxSpeed: Number(draft.maxSpeed) || 0,
    acceleration: Number(draft.acceleration) || 0,
    durability: Number(draft.durability) || 0,
    description: draft.description?.trim() || '',
    sortOrder: Number(draft.sortOrder) || 0,
    handling: Object.fromEntries(Object.entries(draft.handling || {}).map(([key, value]) => [key, Number(value) || 0])),
  }
}

export default function VehicleEditor({ vehicle, open, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(emptyVehicle())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setDraft({ ...emptyVehicle(), ...(vehicle || {}), handling: { ...emptyVehicle().handling, ...(vehicle?.handling || {}) } })
    setError('')
  }, [vehicle, open])

  if (!open) return null

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const updateHandling = (key, value) => update({ handling: { ...(draft.handling || {}), [key]: value } })
  const save = () => {
    if (!draft.name.trim()) {
      setError('Name is required.')
      return
    }
    onSave?.(cleanVehicle(draft))
    onClose?.()
  }
  const remove = () => {
    if (!vehicle?.id || !onDelete) return
    if (!window.confirm(`Delete ${vehicle.name || 'this vehicle'} from the local admin database?`)) return
    onDelete(vehicle.id)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close vehicle editor" onClick={onClose} />
      <div className="relative z-[121] flex max-h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">Admin Mode</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[#111111]">{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 sm:px-8">
          {error ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
          <section className="grid gap-3 rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4 sm:grid-cols-2">
            <label><FieldLabel>Name</FieldLabel><input value={draft.name} onChange={(event) => update({ name: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            <label><FieldLabel>Asset Key / Image Name</FieldLabel><input value={draft.assetKey || ''} onChange={(event) => update({ assetKey: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            <label><FieldLabel>Type</FieldLabel><select value={draft.type} onChange={(event) => update({ type: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm">{typeOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label><FieldLabel>Currency</FieldLabel><select value={draft.currency} onChange={(event) => update({ currency: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm">{currencyOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label><FieldLabel>Price / Acquisition</FieldLabel><input value={draft.price || ''} onChange={(event) => update({ price: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            <label><FieldLabel>Sort Order</FieldLabel><input value={draft.sortOrder || ''} onChange={(event) => update({ sortOrder: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
          </section>
          <section className="grid gap-3 rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4 sm:grid-cols-3">
            <label><FieldLabel>Max Speed</FieldLabel><input value={draft.maxSpeed || ''} onChange={(event) => update({ maxSpeed: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            <label><FieldLabel>Acceleration</FieldLabel><input value={draft.acceleration || ''} onChange={(event) => update({ acceleration: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
            <label><FieldLabel>Durability</FieldLabel><input value={draft.durability || ''} onChange={(event) => update({ durability: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm" /></label>
          </section>
          <section className="grid gap-3 rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4 sm:grid-cols-5">
            {[
              ['speedShifting', 'Speed Shifting'],
              ['suspensionHeight', 'Suspension Height'],
              ['suspensionDamping', 'Suspension Damping'],
              ['handbrake', 'Handbrake'],
              ['brakingPower', 'Braking Power'],
            ].map(([key, label]) => (
              <label key={key}><FieldLabel>{label}</FieldLabel><input value={draft.handling?.[key] || ''} onChange={(event) => updateHandling(key, event.target.value)} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm" /></label>
            ))}
          </section>
          <label className="block rounded-[22px] border border-black/[0.05] bg-[#fafafa] p-4"><FieldLabel>Description</FieldLabel><textarea value={draft.description || ''} onChange={(event) => update({ description: event.target.value })} rows={4} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-sm" /></label>
        </div>
        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          {vehicle && onDelete ? (
            <button type="button" onClick={remove} className="mr-auto rounded-full border border-rose-100 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Delete</button>
          ) : null}
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
