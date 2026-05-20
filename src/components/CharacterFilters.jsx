import { arcTypesMeta, elementsMeta, getRarityMeta, rarityMeta } from '../data/gameMeta.jsx'
import { getElementIcon, getTypeIcon } from '../utils/assetHelpers.js'
import GameIconBadge from './ui/GameIconBadge.jsx'

const ROLE_OPTIONS = ['Main DPS', 'Sub DPS', 'Support', 'Defense', 'Shield', 'Healing', 'Buff', 'Control', 'Follow-up Attack', 'Damage']
const CHARACTER_RARITIES = rarityMeta.filter((meta) => meta.id === 'S' || meta.id === 'A')

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

function PillToggle({ active, children, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'filter-pill-compact inline-flex h-8 items-center justify-center rounded-full border px-3 text-xs font-semibold transition',
        active
          ? 'border-[#ff2f6d]/20 bg-[#fff7fa] text-[#be526b]'
          : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm',
        className,
      )}
    >
      {children}
    </button>
  )
}

export default function CharacterFilters({ filters, onUpdate, resultCount, sourceOptions = [] }) {
  const toggleIn = (key, value) => {
    const arr = filters[key]
    const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]
    onUpdate({ [key]: next })
  }

  const rarityStyle = (r) => {
    const active = filters.rarities.includes(r)
    const meta = getRarityMeta(r)
    return cn(
      'filter-pill-compact inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition',
      active
        ? meta?.chip || 'border-black/[0.08] bg-neutral-50 text-neutral-700 shadow-sm'
        : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm',
    )
  }

  return (
    <div className="surface-glass-strong rounded-[22px] p-3.5 sm:p-4">
      <div className="space-y-3">
        <FilterRow label="Element">
          <div className="flex flex-wrap items-center gap-2">
            <PillToggle active={filters.elements.length === 0} onClick={() => onUpdate({ elements: [] })}>
              All
            </PillToggle>
            {elementsMeta.map((meta) => {
              const Icon = meta.icon
              const assetIcon = getElementIcon(meta.label)
              const active = filters.elements.includes(meta.id)
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => toggleIn('elements', meta.id)}
                  title={meta.label}
                  className={cn(
                    'filter-pill-compact inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition ring-1 ring-transparent',
                    active ? `${meta.chip} ring-black/[0.04]` : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm',
                  )}
                >
                  <GameIconBadge kind="element" value={meta.id} label={meta.label} assetIcon={assetIcon} fallbackIcon={Icon} size="sm" />
                  <span className="hidden sm:inline">{meta.label}</span>
                </button>
              )
            })}
          </div>
        </FilterRow>

        <FilterRow label="Rarity">
          <div className="flex flex-wrap items-center gap-2">
            <PillToggle active={filters.rarities.length === 0} onClick={() => onUpdate({ rarities: [] })}>
              All
            </PillToggle>
            {CHARACTER_RARITIES.map((meta) => (
              <button key={meta.id} type="button" onClick={() => toggleIn('rarities', meta.id)} className={rarityStyle(meta.id)}>
                {meta.label}
              </button>
            ))}
          </div>
        </FilterRow>

        <FilterRow label="Arc Type">
          <div className="flex flex-wrap items-center gap-2">
            <PillToggle active={filters.arcs.length === 0} onClick={() => onUpdate({ arcs: [] })}>
              All
            </PillToggle>
            {arcTypesMeta.map((meta) => {
              const Icon = meta.icon
              const assetIcon = getTypeIcon(meta.label)
              const active = filters.arcs.includes(meta.id)
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => toggleIn('arcs', meta.id)}
                  title={meta.label}
                  className={cn(
                    'filter-pill-compact inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold text-[#6b7280] transition',
                    active
                      ? 'border-[#ff2f6d]/24 bg-[#fff1f5] text-[#be123c] shadow-[0_8px_20px_rgba(255,47,109,0.10)]'
                      : 'border-black/[0.06] bg-[#fafafa] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm',
                  )}
                >
                  <GameIconBadge kind="arc" value={meta.id} label={meta.label} assetIcon={assetIcon} fallbackIcon={Icon} size="sm" />
                  <span className="hidden sm:inline">{meta.label}</span>
                </button>
              )
            })}
          </div>
        </FilterRow>

        <FilterRow label="Role">
          <div className="flex flex-wrap items-center gap-2">
            <PillToggle active={filters.roles.length === 0} onClick={() => onUpdate({ roles: [] })}>
              All
            </PillToggle>
            {ROLE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => toggleIn('roles', r)}
                className={cn(
                  'filter-pill-compact inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition',
                  filters.roles.includes(r)
                    ? 'border-[#ff2f6d]/24 bg-[#fff1f5] text-[#be123c] shadow-[0_8px_20px_rgba(255,47,109,0.10)]'
                    : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </FilterRow>

        {sourceOptions.length ? (
          <FilterRow label="Source">
            <div className="flex flex-wrap items-center gap-2">
              <PillToggle active={(filters.sourceStatuses || []).length === 0} onClick={() => onUpdate({ sourceStatuses: [] })}>
                All
              </PillToggle>
              {sourceOptions.filter((item) => item.value !== 'All').map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleIn('sourceStatuses', item.value)}
                  className={cn(
                    'filter-pill-compact inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition',
                    (filters.sourceStatuses || []).includes(item.value)
                      ? 'border-[#ff2f6d]/24 bg-[#fff1f5] text-[#be123c] shadow-[0_8px_20px_rgba(255,47,109,0.10)]'
                      : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </FilterRow>
        ) : null}
      </div>
      <p className="mt-3 text-right text-xs font-bold text-[#9ca3af]"><span className="text-[#111111] tabular-nums">{resultCount}</span> results</p>
    </div>
  )
}

function FilterRow({ label, children }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <p className="w-20 shrink-0 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">{label}</p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
