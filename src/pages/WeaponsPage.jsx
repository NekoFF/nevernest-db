import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Atom,
  Droplets,
  Disc3,
  Hexagon,
  SlidersHorizontal,
  Sparkles,
  Wind,
  Zap,
} from 'lucide-react'
import WeaponCard from '../components/weapons/WeaponCard.jsx'
import { badgeClass, weaponInitials } from '../components/weapons/weaponStyle.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import WeaponEditor from '../admin/WeaponEditor.jsx'
import { getTypeIcon, getWeaponAsset } from '../utils/assetHelpers.js'
import SummaryCounters from '../components/ui/SummaryCounters.jsx'
import GameIconBadge from '../components/ui/GameIconBadge.jsx'
import FilterControlBar from '../components/ui/FilterControlBar.jsx'
import PageAdminActions, { AdminAddButton } from '../components/ui/PageAdminActions.jsx'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getWeapons } from '../repositories/unified/weaponsRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'
import { apiCountValue, apiFailureDescription } from '../utils/apiDisplay.js'
import { DISCOVERY_SOURCE_OPTIONS, matchesDiscoverySourceStatus } from '../utils/sourceStatusFilters.js'

const rarityOptions = ['All', 'S', 'A', 'B']
const typeOptions = ['All', 'Bose', 'Gas', 'Liquid', 'Plasma', 'Solid']
const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'type', label: 'Type' },
  { value: 'main-atk-desc', label: 'Main ATK High-Low' },
  { value: 'main-atk-asc', label: 'Main ATK Low-High' },
  { value: 'sub-stat', label: 'Sub stat' },
  { value: 'release', label: 'Release Date' },
]

const rarityOrder = { S: 0, A: 1, B: 2 }
const typeIcons = { Bose: Atom, Gas: Wind, Liquid: Droplets, Plasma: Zap, Solid: Hexagon }

export default function WeaponsPage({ topbarQuery = '', onOpenWeapon }) {
  const { isAdminMode, mergedWeapons, createWeaponOverride } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiWeapons, error, loading, reload } = useAsyncData(
    () => getWeapons(mergedWeapons),
    [apiMode, mergedWeapons],
    { enabled: apiMode, initialData: [] },
  )
  const weapons = apiMode ? apiWeapons || [] : mergedWeapons
  const effectiveAdminMode = isAdminMode && !apiMode
  const [editorOpen, setEditorOpen] = useState(false)
  const [rarity, setRarity] = useState(['All'])
  const [type, setType] = useState(['All'])
  const [mainStat, setMainStat] = useState(['All'])
  const [subStat, setSubStat] = useState(['All'])
  const [sourceStatus, setSourceStatus] = useState(['All'])
  const [sortBy, setSortBy] = useState('rarity')
  const [viewMode, setViewMode] = useState('grid')
  const [showMiniFilters, setShowMiniFilters] = useState(false)
  const filterRef = useRef(null)

  const subStatOptions = useMemo(() => makeOptions(weapons.map((weapon) => weapon.subStat?.type)), [weapons])
  const mainStatOptions = useMemo(() => makeOptions(weapons.map((weapon) => weapon.mainStat?.type)), [weapons])
  const counts = useMemo(() => ({
    total: weapons.length,
    S: weapons.filter((weapon) => weapon.rarity === 'S').length,
    A: weapons.filter((weapon) => weapon.rarity === 'A').length,
    B: weapons.filter((weapon) => weapon.rarity === 'B').length,
  }), [weapons])

  useEffect(() => {
    const node = filterRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniFilters(!entry.isIntersecting),
      { rootMargin: '-96px 0px 0px 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const filtered = useMemo(() => {
    const searchText = [topbarQuery].filter(Boolean).join(' ').trim().toLowerCase()
      const result = weapons.filter((weapon) => {
        if (!isAllSelected(rarity) && !rarity.includes(weapon.rarity)) return false
        if (!isAllSelected(type) && !type.includes(weapon.type)) return false
      if (!isAllSelected(mainStat) && !mainStat.includes(weapon.mainStat?.type)) return false
      if (!isAllSelected(subStat) && !subStat.includes(weapon.subStat?.type)) return false
      if (!isAllSelected(sourceStatus) && !sourceStatus.some((status) => matchesDiscoverySourceStatus(weapon.sourceStatus, status))) return false

      if (!searchText) return true
      const haystack = [
        weapon.name,
        weapon.id,
        weapon.slug,
        weapon.type,
        weapon.rarity,
        weapon.quote,
        weapon.shortDescription,
        weapon.mainStat?.type,
        weapon.mainStat?.value,
        weapon.subStat?.type,
        weapon.subStat?.value,
        ...(weapon.refinements || []).map((rank) => rank.effect),
        weapon.sourceStatus,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchText.split(/\s+/).every((token) => haystack.includes(token))
    })

    return sortWeapons(result, sortBy)
  }, [topbarQuery, rarity, type, mainStat, subStat, sourceStatus, sortBy, weapons])

  return (
    <div className="space-y-7 pb-6">
      <Seo title="Weapons" description="Browse NTE weapons and arcs by rarity, arc type, sub stat, stats, and refinement effects." />
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
            <Disc3 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            {apiMode && error ? 'API data unavailable' : apiMode && loading ? 'Loading API data' : `${weapons.length} arcs indexed`}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Weapons / Arcs Database</h1>
          <p className="text-base leading-relaxed text-[#6b7280] sm:text-lg">
            Browse all available arcs, compare rarity, type, stats, and refinement effects.
          </p>
        </div>
        <PageAdminActions className="lg:flex-col lg:items-end">
          <SummaryCounters
            items={[
              { label: 'Arcs', value: apiCountValue(apiMode, loading, error, counts.total) },
              { label: 'S', value: apiCountValue(apiMode, loading, error, counts.S), tone: 's' },
              { label: 'A', value: apiCountValue(apiMode, loading, error, counts.A), tone: 'a' },
              { label: 'B', value: apiCountValue(apiMode, loading, error, counts.B), tone: 'b' },
            ]}
          />
          {effectiveAdminMode ? <AdminAddButton label="Add Weapon" onClick={() => setEditorOpen(true)} /> : null}
        </PageAdminActions>
      </header>

      <div className="space-y-2.5">
        <FilterControlBar
          resultCount={filtered.length}
          sortValue={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClearAll={() => {
            setRarity(['All'])
            setType(['All'])
            setMainStat(['All'])
            setSubStat(['All'])
            setSourceStatus(['All'])
            setSortBy('rarity')
            setViewMode('grid')
          }}
        />

        <section ref={filterRef} className="surface-glass-strong rounded-[22px] p-3.5 sm:p-4">
          <div className="grid gap-3">
            <ChipGroup label="Rarity" value={rarity} onChange={setRarity} options={rarityOptions} kind="rarity" />
            <ChipGroup label="Type" value={type} onChange={setType} options={typeOptions} kind="type" icons={typeIcons} />
            <ChipGroup label="Main stat" value={mainStat} onChange={setMainStat} options={mainStatOptions} kind="stat" />
            <ChipGroup label="Sub stat" value={subStat} onChange={setSubStat} options={subStatOptions} kind="substat" />
            <ChipGroup label="Source" value={sourceStatus} onChange={setSourceStatus} options={DISCOVERY_SOURCE_OPTIONS.map((item) => item.label)} kind="source" valueMap={Object.fromEntries(DISCOVERY_SOURCE_OPTIONS.map((item) => [item.label, item.value]))} />
          </div>

          <div className="mt-3 flex justify-end text-xs font-bold text-[#9ca3af]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              <span><span className="text-[#111111] tabular-nums">{filtered.length}</span> result{filtered.length === 1 ? '' : 's'}</span>
            </div>
          </div>
        </section>
      </div>

      <WeaponMiniFilters show={showMiniFilters} rarity={rarity} setRarity={setRarity} type={type} setType={setType} />

      {loading ? (
        <EmptyState title="Loading weapons" description="Fetching weapon data from the local API." />
      ) : error ? (
        <EmptyState title="Weapons failed to load" description={apiFailureDescription(error, 'The local API did not return weapon data.')} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No weapons found" description="No weapons match your filters." />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="dense-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((weapon) => (
                <WeaponCard key={weapon.id} weapon={weapon} onOpenWeapon={onOpenWeapon} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((weapon) => (
                <CompactWeaponRow key={weapon.id} weapon={weapon} onOpenWeapon={onOpenWeapon} />
              ))}
            </div>
          )}
        </>
      )}
      {effectiveAdminMode ? <WeaponEditor open={editorOpen} onClose={() => setEditorOpen(false)} onSave={(weapon) => createWeaponOverride(weapon)} /> : null}
    </div>
  )
}

function isAllSelected(value) {
  return !Array.isArray(value) || value.includes('All') || value.length === 0
}

function toggleFilterValue(current, option) {
  if (option === 'All') return ['All']
  const set = new Set(Array.isArray(current) ? current.filter((item) => item !== 'All') : [])
  if (set.has(option)) set.delete(option)
  else set.add(option)
  return set.size ? [...set] : ['All']
}

function ChipGroup({ label, value, onChange, options, kind, icons = {}, valueMap = {} }) {
  return (
    <div className="grid gap-2 md:grid-cols-[94px_minmax(0,1fr)] md:items-start">
      <div className="pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const Icon = icons[option]
          const assetIcon = kind === 'type' && option !== 'All' ? getTypeIcon(option) : null
          const optionValue = valueMap[option] || option
          const active = Array.isArray(value) ? value.includes(optionValue) : value === optionValue
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(toggleFilterValue(value, optionValue))}
              className={chipClass(active, kind, option)}
            >
              {assetIcon || Icon ? <GameIconBadge kind="arc" value={option} label={option} assetIcon={assetIcon} fallbackIcon={Icon} size="sm" /> : null}
              <span>{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WeaponMiniFilters({ show, rarity, setRarity, type, setType }) {
  const toggleRarity = (rank) => setRarity(toggleFilterValue(rarity, rank))
  const toggleType = (nextType) => setType(toggleFilterValue(type, nextType))

  return (
    <div
      className={`fixed left-1/2 top-[92px] z-40 w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 transition duration-200 lg:left-[calc(50%+160px)] lg:max-w-[calc(100vw-24rem)] ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
      aria-hidden={!show}
    >
      <div className="floating-glass overflow-x-auto rounded-full px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-1.5 lg:mx-auto">
          {['S', 'A', 'B'].map((rank) => (
            <button
              key={rank}
              type="button"
              onClick={() => toggleRarity(rank)}
              className={`h-8 rounded-full border px-3 text-xs font-black transition ${
                rarity.includes(rank)
                  ? rank === 'S'
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : rank === 'A'
                      ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'
                      : 'border-sky-200 bg-sky-50 text-sky-700'
                  : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white'
              }`}
            >
              {rank}
            </button>
          ))}
          <MiniDivider />
          {typeOptions.filter((option) => option !== 'All').map((option) => {
            const Icon = typeIcons[option]
            return (
              <MiniIconButton key={option} active={type.includes(option)} title={option} onClick={() => toggleType(option)}>
                <GameIconBadge kind="arc" value={option} label={option} assetIcon={getTypeIcon(option)} fallbackIcon={Icon} size="sm" />
              </MiniIconButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MiniIconButton({ active, title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
        active ? 'border-[#ff2f6d]/25 bg-[#fff1f5] text-[#be123c]' : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white'
      }`}
    >
      {children}
    </button>
  )
}

function MiniDivider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-black/[0.08]" aria-hidden />
}

function chipClass(active, kind, option) {
  const base = 'filter-pill-compact inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition'
  if (!active) return `${base} border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm`
  if (option === 'All') return `${base} border-[#ff2f6d]/20 bg-[#fff7fa] text-[#be526b]`
  if (kind === 'rarity' && option === 'S') return `${base} border-[#f59e0b]/35 bg-[#fff7ed] text-[#b45309] shadow-[0_10px_26px_rgba(245,158,11,0.16)]`
  if (kind === 'rarity' && option === 'A') return `${base} border-[#a855f7]/35 bg-[#faf5ff] text-[#7e22ce] shadow-[0_10px_26px_rgba(168,85,247,0.14)]`
  if (kind === 'rarity' && option === 'B') return `${base} border-[#06b6d4]/35 bg-[#ecfeff] text-[#0e7490] shadow-[0_10px_26px_rgba(6,182,212,0.14)]`
  if (kind === 'type') return `${base} border-[#ff2f6d]/24 bg-[#fff1f5] text-[#be123c] shadow-[0_10px_28px_rgba(255,47,109,0.12)]`
  return `${base} border-[#ff2f6d]/24 bg-white text-[#be123c] ring-1 ring-[#ff2f6d]/10 shadow-[0_10px_28px_rgba(255,47,109,0.11)]`
}

function CompactWeaponRow({ weapon, onOpenWeapon }) {
  const preview = weapon.shortDescription || weapon.refinements?.[0]?.effect || weapon.quote || 'Data coming soon.'
  return (
    <button
      type="button"
      onClick={() => onOpenWeapon(weapon.slug)}
      className="compact-row card-premium interactive-soft group grid w-full gap-3 rounded-[24px] p-3 text-left md:grid-cols-[68px_minmax(150px,1.1fr)_82px_100px_132px_minmax(180px,1.3fr)_auto] md:items-center"
    >
      <CompactWeaponIcon weapon={weapon} />
      <div className="min-w-0">
        <p className="text-base font-bold leading-tight tracking-tight text-[#111111] transition group-hover:text-[#be123c]">{weapon.name}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">Arc</p>
      </div>
      <div className="flex flex-wrap gap-2 md:block">
        <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span>
      </div>
      <div>
        <WeaponTypeBadge type={weapon.type} />
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
        <CompactMetric label={weapon.mainStat?.type || 'ATK'} value={weapon.mainStat?.value || 'Data coming soon'} />
        <CompactMetric label={weapon.subStat?.type || 'Sub Stat'} value={weapon.subStat?.value || 'Data coming soon'} />
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-[#6b7280]">{preview}</p>
      <span className="inline-flex items-center justify-between gap-2 rounded-full bg-[#ff2f6d]/8 px-3 py-2 text-sm font-semibold text-[#ff2f6d] transition group-hover:bg-[#ff2f6d] group-hover:text-white">
        View
        <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      </span>
    </button>
  )
}

function WeaponTypeBadge({ type }) {
  const icon = getTypeIcon(type)
  return (
    <span className={`${badgeClass('type', type)} inline-flex items-center gap-1.5`}>
      {icon ? (
        <GameIconBadge kind="arc" value={type} label={type} assetIcon={icon} size="sm" />
      ) : null}
      {type}
    </span>
  )
}

function CompactWeaponIcon({ weapon }) {
  const [imgError, setImgError] = useState(false)
  const image = getWeaponAsset(weapon?.name) || weapon?.icon || weapon?.image || ''
  const onImgError = useCallback(() => setImgError(true), [])
  const bg = compactWeaponGlow(weapon?.rarity)
  if (image && !imgError) {
    return (
      <div className={`h-[76px] w-[76px] overflow-hidden rounded-[20px] border border-white/80 ${bg} ring-1 ring-black/[0.04]`}>
        <img src={image} alt={weapon.name} className="h-full w-full object-contain p-2.5" loading="lazy" onError={onImgError} />
      </div>
    )
  }

  return (
    <div className={`flex h-[76px] w-[76px] items-center justify-center rounded-[20px] border border-white/80 ${bg} text-lg font-bold tracking-tight text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_28px_rgba(0,0,0,0.045)] ring-1 ring-black/[0.04]`}>
      {weaponInitials(weapon?.name)}
    </div>
  )
}

function compactWeaponGlow(rarity) {
  if (rarity === 'S') return 'bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.18),transparent_36%),radial-gradient(circle_at_82%_28%,rgba(251,191,36,0.12),transparent_34%),linear-gradient(135deg,#ffffff,#fff7ed)]'
  if (rarity === 'A') return 'bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.16),transparent_36%),radial-gradient(circle_at_82%_28%,rgba(217,70,239,0.12),transparent_34%),linear-gradient(135deg,#ffffff,#faf5ff)]'
  return 'bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.16),transparent_36%),radial-gradient(circle_at_82%_28%,rgba(14,165,233,0.12),transparent_34%),linear-gradient(135deg,#ffffff,#ecfeff)]'
}

function CompactMetric({ label, value }) {
  return (
    <div className="rounded-[14px] border border-black/[0.055] bg-[#fafafa] px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  )
}

function makeOptions(values) {
  const unique = [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))
  return ['All', ...unique]
}

function sortWeapons(list, sortBy) {
  const next = [...list]
  switch (sortBy) {
    case 'name-desc':
      next.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'rarity':
      next.sort((a, b) => (rarityOrder[a.rarity] ?? 99) - (rarityOrder[b.rarity] ?? 99) || a.name.localeCompare(b.name))
      break
    case 'type':
      next.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
      break
    case 'sub-stat':
      next.sort((a, b) => (a.subStat?.type || '').localeCompare(b.subStat?.type || '') || a.name.localeCompare(b.name))
      break
    case 'main-atk-desc':
      next.sort((a, b) => numericStat(b.mainStat?.value) - numericStat(a.mainStat?.value) || a.name.localeCompare(b.name))
      break
    case 'main-atk-asc':
      next.sort((a, b) => numericStat(a.mainStat?.value) - numericStat(b.mainStat?.value) || a.name.localeCompare(b.name))
      break
    case 'release':
      next.sort((a, b) => {
        const aTime = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const bTime = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
        return bTime - aTime || a.name.localeCompare(b.name)
      })
      break
    case 'name':
    default:
      next.sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  return next
}

function numericStat(value) {
  const parsed = Number.parseFloat(String(value || '').replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}
