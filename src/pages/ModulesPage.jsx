import { useEffect, useMemo, useRef, useState } from 'react'
import { Blocks, SlidersHorizontal } from 'lucide-react'
import CartridgeCard from '../components/cartridges/CartridgeCard.jsx'
import CartridgeIcon from '../components/cartridges/CartridgeIcon.jsx'
import { categoryBadgeClass, rarityBadgeClass, rarityOrder } from '../components/cartridges/cartridgeStyle.js'
import { cartridges } from '../data/cartridges.js'
import { getModuleShapeOptions, modulePieces as staticModulePieces } from '../data/modulePieces.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import ModuleShape from '../components/ModuleShape.jsx'
import { getElementIcon } from '../utils/assetHelpers.js'
import SummaryCounters from '../components/ui/SummaryCounters.jsx'
import GameIconBadge from '../components/ui/GameIconBadge.jsx'
import FilterControlBar from '../components/ui/FilterControlBar.jsx'
import CartridgeEditor from '../admin/CartridgeEditor.jsx'
import PageAdminActions, { AdminAddButton } from '../components/ui/PageAdminActions.jsx'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getCartridges, getModulePieceForShapeAndRarity, getModulePieces, getModuleShapes } from '../repositories/unified/modulesRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'
import { apiCountValue, apiFailureDescription } from '../utils/apiDisplay.js'
import { DISCOVERY_SOURCE_OPTIONS, matchesDiscoverySourceStatus } from '../utils/sourceStatusFilters.js'

const contentOptions = ['All', 'Cartridges', 'Modules']
const rarityOptions = ['S', 'A', 'B']
const moduleTypeOptions = ['All', 'II', 'III', 'IV']
const categoryOptions = ['All', 'damage', 'defense', 'healing', 'break', 'utility', 'support']
const elementOptions = ['All', 'Cosmos', 'Anima', 'Incantation', 'Chaos', 'Psyche', 'Lakshana', 'Cognitive']
const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'category', label: 'Bonus type' },
  { value: 'default', label: 'Default order' },
]

export default function ModulesPage({ topbarQuery = '', onOpenCartridge, onOpenModule }) {
  const { isAdminMode, mergedCartridges, createCartridgeOverride } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiModuleData, error, loading, reload } = useAsyncData(
    async () => {
      const [apiCartridges, apiModuleShapes, apiModulePieces] = await Promise.all([
        getCartridges(mergedCartridges),
        getModuleShapes(),
        getModulePieces(),
      ])
      return { cartridges: apiCartridges, moduleShapes: apiModuleShapes, modulePieces: apiModulePieces }
    },
    [apiMode, mergedCartridges],
    { enabled: apiMode, initialData: { cartridges: [], moduleShapes: [], modulePieces: [] } },
  )
  const cartridgeData = apiMode ? apiModuleData?.cartridges || [] : mergedCartridges || cartridges
  const moduleShapes = apiMode ? apiModuleData?.moduleShapes || [] : getModuleShapeOptions()
  const modulePieces = apiMode ? apiModuleData?.modulePieces || [] : staticModulePieces
  const effectiveAdminMode = isAdminMode && !apiMode
  const [contentType, setContentType] = useState('All')
  const [rarity, setRarity] = useState('S')
  const [moduleType, setModuleType] = useState(['All'])
  const [category, setCategory] = useState(['All'])
  const [element, setElement] = useState(['All'])
  const [sourceStatus, setSourceStatus] = useState(['All'])
  const [sortBy, setSortBy] = useState('rarity')
  const [viewMode, setViewMode] = useState('grid')
  const [showMiniFilters, setShowMiniFilters] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const filterRef = useRef(null)

  const filtered = useMemo(() => {
    const searchText = [topbarQuery].filter(Boolean).join(' ').trim().toLowerCase()
    const result = cartridgeData.filter((cartridge) => {
      if (!isAllSelected(category) && !category.includes(cartridge.bonusCategory)) return false
      if (!isAllSelected(element) && !element.includes(cartridge.element)) return false
      if (!isAllSelected(sourceStatus) && !sourceStatus.some((status) => matchesDiscoverySourceStatus(cartridge.sourceStatus || cartridge.dataStatus, status))) return false
      if (!searchText) return true
      const haystack = [
        cartridge.id,
        cartridge.slug,
        cartridge.name,
        cartridge.theme,
        cartridge.bonusCategory,
        cartridge.element,
        cartridge.description,
        ...(cartridge.bonuses || []).map((bonus) => bonus.text),
        cartridge.dataStatus,
        cartridge.sourceStatus,
      ].join(' ').toLowerCase()
      return searchText.split(/\s+/).every((token) => haystack.includes(token))
    })
    return sortCartridges(result, sortBy)
  }, [topbarQuery, category, element, sourceStatus, sortBy, cartridgeData])

  const filteredModulePieces = useMemo(() => {
    const searchText = [topbarQuery].filter(Boolean).join(' ').trim().toLowerCase()
    return moduleShapes.map((shape) => getModulePieceForShapeAndRarity(modulePieces, shape.id, rarity)).filter(Boolean).filter((piece) => {
      if (!isAllSelected(moduleType) && !moduleType.includes(piece.moduleType)) return false
      if (!isAllSelected(sourceStatus) && !sourceStatus.some((status) => matchesDiscoverySourceStatus(piece.sourceStatus || 'needs_review', status))) return false
      if (!searchText) return true
      const haystack = [
        piece.id,
        piece.name,
        piece.shapeName,
        piece.moduleType,
        piece.shapeId,
        piece.rarity,
        ...(piece.mainStats || []).map((row) => `${row.statId} ${row.stat?.name || ''} ${row.formattedValue || ''}`),
      ].join(' ').toLowerCase()
      return searchText.split(/\s+/).every((token) => haystack.includes(token))
    })
  }, [modulePieces, moduleShapes, moduleType, rarity, sourceStatus, topbarQuery])

  const showCartridges = contentType === 'All' || contentType === 'Cartridges'
  const showPieces = contentType === 'All' || contentType === 'Modules'
  const apiLoadFailed = apiMode && Boolean(error)

  const selectedRarity = rarity
  const moduleShapeCount = moduleShapes.length
  const visibleResultCount = (showCartridges ? filtered.length : 0) + (showPieces ? filteredModulePieces.length : 0)
  const counts = useMemo(() => ({
    total: cartridgeData.length + moduleShapeCount,
    cartridges: cartridgeData.length,
    modules: moduleShapeCount,
    S: cartridgeData.filter((item) => item.availableRarities?.includes('S')).length,
    A: cartridgeData.filter((item) => item.availableRarities?.includes('A')).length,
    B: cartridgeData.filter((item) => item.availableRarities?.includes('B')).length,
  }), [cartridgeData, moduleShapeCount])

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

  return (
    <div className="space-y-7 pb-6">
      <Seo title="Modules and Cartridges" description="Browse NTE cartridge sets and console modules by rarity, shape, element, and set bonus." />
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
            <Blocks className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            {apiLoadFailed ? 'API data unavailable' : loading && apiMode ? 'Loading API data' : `${counts.cartridges} cartridge sets + ${counts.modules} module shapes indexed`}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Modules / Cartridges Database</h1>
          <p className="text-base leading-relaxed text-[#6b7280] sm:text-lg">
            Browse cartridge sets and console modules, compare rarity variants, shapes, set bonuses, and max stat values.
          </p>
        </div>
        <PageAdminActions className="lg:flex-col lg:items-end">
          <SummaryCounters
            items={[
              { label: 'Items', value: apiCountValue(apiMode, loading, error, counts.total) },
              { label: 'Shapes', value: apiCountValue(apiMode, loading, error, counts.modules) },
              { label: 'S', value: apiCountValue(apiMode, loading, error, counts.S), tone: 's' },
              { label: 'A', value: apiCountValue(apiMode, loading, error, counts.A), tone: 'a' },
            ]}
          />
          {effectiveAdminMode ? <AdminAddButton label="Add Cartridge" onClick={() => setEditorOpen(true)} /> : null}
        </PageAdminActions>
      </header>

      <div className="space-y-2.5">
        <FilterControlBar
          resultCount={visibleResultCount}
          sortValue={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClearAll={() => {
            setContentType('All')
            setRarity('S')
            setModuleType(['All'])
            setCategory(['All'])
            setElement(['All'])
            setSourceStatus(['All'])
            setSortBy('rarity')
            setViewMode('grid')
          }}
        />

        <section ref={filterRef} className="surface-glass-strong rounded-[22px] p-3.5 sm:p-4">
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <ChipGroup label="Content" value={contentType} onChange={setContentType} options={contentOptions} compact />
            <ChipGroup label="Rarity" value={rarity} onChange={setRarity} options={rarityOptions} compact />
            {showPieces ? <ChipGroup label="Type" value={moduleType} onChange={setModuleType} options={moduleTypeOptions} compact multiple /> : null}
            {showCartridges ? <ChipGroup label="Bonus" value={category} onChange={setCategory} options={categoryOptions} compact multiple /> : null}
            {showCartridges ? <ChipGroup label="Element" value={element} onChange={setElement} options={elementOptions} compact useAssetIcons multiple /> : null}
            <ChipGroup label="Source" value={sourceStatus} onChange={setSourceStatus} options={DISCOVERY_SOURCE_OPTIONS.map((item) => item.label)} compact multiple valueMap={Object.fromEntries(DISCOVERY_SOURCE_OPTIONS.map((item) => [item.label, item.value]))} />
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-bold text-[#9ca3af]">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            <span><span className="text-[#111111] tabular-nums">{visibleResultCount}</span> result{visibleResultCount === 1 ? '' : 's'}</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#6b7280]">
            Compatible cartridge shapes are shown when present. Additional set pairings will be added as exact in-game shape references are completed.
          </p>
        </section>
      </div>

      <ModulesMiniFilters
        show={showMiniFilters}
        rarity={rarity}
        setRarity={setRarity}
        element={element}
        setElement={setElement}
        contentType={contentType}
        setContentType={setContentType}
      />

      {loading ? (
        <EmptyState title="Loading modules" description="Fetching cartridge and module data from the local API." />
      ) : error ? (
        <EmptyState title="Modules failed to load" description={apiFailureDescription(error, 'The local API did not return module data.')} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : visibleResultCount === 0 ? (
        <EmptyState title="No modules or cartridges found" description="No cartridge sets or module pieces match the current search and filters." />
      ) : showCartridges && filtered.length === 0 && !showPieces ? (
        <EmptyState title="No cartridges found" description="No cartridges match your filters." />
      ) : showCartridges && viewMode === 'grid' ? (
        <div className="dense-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((cartridge) => <CartridgeCard key={cartridge.id} cartridge={cartridge} rarity={selectedRarity} onOpenCartridge={onOpenCartridge} />)}
        </div>
      ) : showCartridges ? (
        <div className="space-y-3">
          {filtered.map((cartridge) => <CompactCartridgeRow key={cartridge.id} cartridge={cartridge} rarity={selectedRarity} onOpenCartridge={onOpenCartridge} />)}
        </div>
      ) : null}

      {!loading && !error && visibleResultCount > 0 && showPieces ? (
        filteredModulePieces.length ? (
          viewMode === 'grid' ? (
          <div className="dense-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredModulePieces.map((piece) => <ModulePieceCard key={piece.id} piece={piece} onOpenModule={onOpenModule} />)}
          </div>
          ) : (
            <div className="space-y-3">
              {filteredModulePieces.map((piece) => <CompactModulePieceRow key={piece.id} piece={piece} onOpenModule={onOpenModule} />)}
            </div>
          )
        ) : (
          <EmptyState title="No module pieces found" description="No module pieces match your filters." />
        )
      ) : null}

      {effectiveAdminMode ? (
        <CartridgeEditor
          cartridge={editorOpen ? EMPTY_CARTRIDGE : null}
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={(_id, data) => createCartridgeOverride(data)}
        />
      ) : null}
    </div>
  )
}

const EMPTY_CARTRIDGE = {
  id: '',
  slug: '',
  name: '',
  theme: '',
  element: '',
  bonusCategory: 'support',
  description: '',
  image: '',
  icon: '',
  availableRarities: ['B', 'A', 'S'],
  bonuses: [],
  compatibleModuleShapeIds: [],
  compatibleModules: [],
}

function sortCartridges(items, sortBy) {
  return [...items].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'rarity') return highestRarityRank(a) - highestRarityRank(b) || String(a.bonusCategory).localeCompare(String(b.bonusCategory)) || a.name.localeCompare(b.name)
    if (sortBy === 'category') return String(a.bonusCategory).localeCompare(String(b.bonusCategory)) || a.name.localeCompare(b.name)
    return 0
  })
}

function highestRarityRank(item) {
  const ranks = Array.isArray(item.availableRarities) && item.availableRarities.length ? item.availableRarities : ['S']
  return Math.min(...ranks.map((rank) => rarityOrder[rank] ?? 99))
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

function ChipGroup({ label, value, onChange, options, compact = false, useAssetIcons = false, multiple = false, valueMap = {} }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const icon = useAssetIcons && option !== 'All' ? getElementIcon(option) : null
          const optionValue = valueMap[option] || option
          const active = Array.isArray(value) ? value.includes(optionValue) : value === optionValue
          return (
          <button key={option} type="button" onClick={() => onChange(multiple ? toggleFilterValue(value, optionValue) : optionValue)} className={`filter-pill-compact inline-flex items-center gap-1.5 rounded-full border ${compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'} font-semibold capitalize transition ${active ? (optionValue === 'All' ? 'border-[#ff2f6d]/20 bg-[#fff7fa] text-[#be526b]' : 'border-[#ff2f6d]/25 bg-[#ff2f6d]/10 text-[#be123c]') : 'border-black/[0.06] bg-white text-[#6b7280] hover:-translate-y-0.5 hover:border-[#ff2f6d]/14 hover:bg-[#fff7fa] hover:text-[#be123c] hover:shadow-sm'}`}>
            {icon ? <GameIconBadge kind="element" value={option} label={option} assetIcon={icon} size="sm" /> : null}
            {option}
          </button>
        )})}
      </div>
    </div>
  )
}

function ModulesMiniFilters({ show, rarity, setRarity, element, setElement, contentType, setContentType }) {
  const toggleElement = (nextElement) => setElement(toggleFilterValue(element, nextElement))

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
              onClick={() => setRarity(rank)}
              className={`h-8 rounded-full border px-3 text-xs font-black transition ${
                rarity === rank
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
          {[
            ['All', 'Both'],
            ['Cartridges', 'Cartridge'],
            ['Modules', 'Module'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setContentType(value)}
              className={`h-8 shrink-0 rounded-full border px-3 text-xs font-bold capitalize transition ${
                contentType === value ? 'border-[#ff2f6d]/25 bg-[#fff1f5] text-[#be123c]' : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white'
              }`}
            >
              {label}
            </button>
          ))}
          <MiniDivider />
          {elementOptions.filter((option) => option !== 'All').map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleElement(option)}
              title={option}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                element.includes(option) ? 'border-[#ff2f6d]/25 bg-[#fff1f5] text-[#be123c]' : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white'
              }`}
            >
              <GameIconBadge kind="element" value={option} label={option} assetIcon={getElementIcon(option)} size="sm" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniDivider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-black/[0.08]" aria-hidden />
}

function ModulePieceCard({ piece, onOpenModule }) {
  const mainStats = piece.mainStats || []
  const shapeLabel = piece.shapeName || `Type ${piece.moduleType} Module`
  return (
    <button type="button" onClick={() => onOpenModule?.(piece.shapeId, piece.rarity)} className="card-premium interactive-soft group flex h-full flex-col rounded-[26px] p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#ff2f6d]/30">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-[#fafafa] ring-1 ring-black/[0.05]">
          <ModuleShape shapeId={piece.shapeId} rarity={piece.rarity} size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${rarityBadgeClass(piece.rarity)}`}>{piece.rarity}</span>
            <span className="rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">Type {piece.moduleType}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-bold tracking-tight text-[#111111]">{shapeLabel}</h3>
          <p className="mt-1 text-xs font-semibold text-[#9ca3af]">{piece.cellCount} blocks</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-[#fafafa] px-3 py-3 ring-1 ring-black/[0.04]">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Locked main stats</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {mainStats.map((row) => (
            <span key={row.statId} className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-[#111111] ring-1 ring-black/[0.05]">
              <span className="block text-[10px] uppercase tracking-wide text-[#9ca3af]">{row.stat?.name || row.statId}</span>
              <span className="mt-0.5 block text-sm">{row.formattedValue}</span>
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

function CompactModulePieceRow({ piece, onOpenModule }) {
  const mainStats = piece.mainStats || []
  const shapeLabel = piece.shapeName || `Type ${piece.moduleType} Module`
  return (
    <button type="button" onClick={() => onOpenModule?.(piece.shapeId, piece.rarity)} className="compact-row card-premium grid w-full gap-3 rounded-[22px] p-3 text-left transition hover:border-[#ff2f6d]/15 hover:bg-white sm:grid-cols-[52px_minmax(0,1fr)_80px_92px_minmax(150px,0.9fr)_auto] sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fafafa] ring-1 ring-black/[0.05]">
        <ModuleShape shapeId={piece.shapeId} rarity={piece.rarity} size={9} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold text-[#111111]">{shapeLabel}</p>
        <p className="truncate text-xs font-semibold text-[#9ca3af]">{piece.cellCount} blocks</p>
      </div>
      <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold ${rarityBadgeClass(piece.rarity)}`}>{piece.rarity}</span>
      <span className="w-fit rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">Type {piece.moduleType}</span>
      <div className="flex flex-wrap gap-2">
        {mainStats.map((row) => (
          <span key={row.statId} className="rounded-full bg-[#fafafa] px-2.5 py-1 text-xs font-bold text-[#111111] ring-1 ring-black/[0.05]">
            <span className="text-[#9ca3af]">{row.stat?.name || row.statId}</span> {row.formattedValue}
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold text-[#ff2f6d]">View</span>
    </button>
  )
}

function CompactCartridgeRow({ cartridge, rarity, onOpenCartridge }) {
  const elementIcon = getElementIcon(cartridge.element || cartridge.theme)
  return (
    <button type="button" onClick={() => onOpenCartridge?.(cartridge.slug)} className="compact-row card-premium grid w-full gap-3 rounded-[22px] p-3 text-left transition hover:border-[#ff2f6d]/15 hover:bg-white sm:grid-cols-[52px_minmax(0,1.1fr)_62px_98px_110px_minmax(0,1.4fr)_auto] sm:items-center">
      <CartridgeIcon cartridge={cartridge} rarity={rarity} className="h-12 w-12" />
      <div className="min-w-0">
        <p className="truncate font-bold text-[#111111]">{cartridge.name}</p>
        <p className="truncate text-xs font-semibold text-[#9ca3af]">Console Cartridge</p>
      </div>
      <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold ${rarityBadgeClass(rarity)}`}>{rarity}</span>
      <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${categoryBadgeClass(cartridge.bonusCategory)}`}>{cartridge.bonusCategory}</span>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">
        {elementIcon ? <GameIconBadge kind="element" value={cartridge.element || cartridge.theme} label={cartridge.element || cartridge.theme} assetIcon={elementIcon} size="sm" /> : null}
        {cartridge.theme}
      </span>
      <p className="line-clamp-1 text-sm text-[#6b7280]">{cartridge.bonuses?.[0]?.text}</p>
      <span className="text-sm font-semibold text-[#ff2f6d]">View</span>
    </button>
  )
}
