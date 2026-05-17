import { useState } from 'react'
import { ArrowLeft, Blocks, Pencil } from 'lucide-react'
import ModuleShape from '../components/ModuleShape.jsx'
import CartridgeIcon from '../components/cartridges/CartridgeIcon.jsx'
import { categoryBadgeClass, rarityBadgeClass, rarityGlow } from '../components/cartridges/cartridgeStyle.js'
import { cartridgeRarities, getCartridgeBySlug, getCartridgeStatRows } from '../data/cartridges.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import CartridgeEditor from '../admin/CartridgeEditor.jsx'
import { getElementIcon } from '../utils/assetHelpers.js'
import GameIconBadge from '../components/ui/GameIconBadge.jsx'
import SourceStatusBadge from '../components/ui/SourceStatusBadge.jsx'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import NotFoundState from '../components/ui/NotFoundState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getCartridgeByIdOrSlug } from '../repositories/unified/modulesRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'

export default function CartridgeDetailPage({ slug, onBack }) {
  const { isAdminMode, getCartridgeByIdMerged, saveCartridgeOverride, deleteCartridgeOverride } = useAdminMode()
  const apiMode = isApiMode()
  const baseCartridge = getCartridgeBySlug(slug)
  const staticCartridge = getCartridgeByIdMerged(baseCartridge?.id || slug) || baseCartridge
  const { data: apiCartridge, error, loading, reload } = useAsyncData(
    () => getCartridgeByIdOrSlug([], slug),
    [apiMode, slug],
    { enabled: apiMode && Boolean(slug), initialData: null },
  )
  const cartridge = apiMode ? apiCartridge : staticCartridge
  const effectiveAdminMode = isAdminMode && !apiMode
  const [rarity, setRarity] = useState('S')
  const [editorOpen, setEditorOpen] = useState(false)

  if (loading) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Loading cartridge" description="Fetching cartridge data from the local API." />
        <BackButton onBack={onBack} />
        <EmptyState title="Loading cartridge" description="Fetching cartridge data from the local API." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Cartridge failed to load" description="The local API did not return this cartridge." />
        <BackButton onBack={onBack} />
        <EmptyState title="Cartridge failed to load" description={error.message || 'The local API did not return this cartridge.'} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      </div>
    )
  }

  if (!cartridge) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Cartridge not found" description="This cartridge route does not match an entry in the current NTE database." />
        <BackButton onBack={onBack} />
        <NotFoundState title="Cartridge not found" description="This module route does not match a cartridge in the current database." />
      </div>
    )
  }

  const mainRows = getCartridgeStatRows(rarity, 'main')
  const subRows = getCartridgeStatRows(rarity, 'sub')
  const elementIcon = getElementIcon(cartridge.element || cartridge.theme)

  return (
    <div className="relative isolate space-y-5 pb-6">
      <Seo title={cartridge.name} description={`${cartridge.name} cartridge set bonuses, compatible modules, and stat values for the NTE Community Database.`} />
      <div className={`pointer-events-none absolute inset-x-[-80px] -top-28 -z-10 h-[520px] bg-gradient-to-br ${rarityGlow(rarity)} opacity-90 blur-3xl [mask-image:radial-gradient(ellipse_at_center,black_0%,black_42%,transparent_74%)]`} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackButton onBack={onBack} />
        {effectiveAdminMode ? (
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/85 px-4 py-2 text-sm font-semibold text-[#111111] shadow-[0_10px_28px_rgba(0,0,0,0.045)] backdrop-blur transition hover:border-[#ff2f6d]/18 hover:bg-white hover:text-[#be123c]"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            Edit Cartridge
          </button>
        ) : null}
      </div>

      <section className="overflow-hidden rounded-[34px] border border-white/70 bg-white/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-7">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${rarityBadgeClass(rarity)}`}>{rarity} Rank</span>
              <span className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${categoryBadgeClass(cartridge.bonusCategory)}`}>{cartridge.bonusCategory}</span>
              {cartridge.element ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-[#6b7280]">
                  {elementIcon ? <GameIconBadge kind="element" value={cartridge.element} label={cartridge.element} assetIcon={elementIcon} size="sm" /> : null}
                  {cartridge.element}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#111111] sm:text-5xl">{cartridge.name}</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#6b7280]">{cartridge.description}</p>
            <div className="mt-5 inline-flex rounded-full border border-black/[0.06] bg-[#fafafa] p-1 shadow-inner">
              {cartridgeRarities.filter((item) => cartridge.availableRarities?.includes(item)).map((item) => (
                <button key={item} type="button" onClick={() => setRarity(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${rarity === item ? 'bg-white text-[#ff2f6d] shadow-sm' : 'text-[#6b7280] hover:text-[#111111]'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CartridgeIcon cartridge={cartridge} rarity={rarity} className="h-56 w-56 rounded-[34px]" />
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.75fr)]">
        <section className="rounded-[28px] border border-black/[0.06] bg-white/90 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.055)] sm:p-5">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Set Data</h2>
          <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
            {cartridge.bonuses?.map((bonus) => (
              <article key={bonus.pieces} className="rounded-[18px] border border-black/[0.05] bg-[#fafafa] p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#ff2f6d] ring-1 ring-black/[0.05]">{bonus.pieces}-Piece Bonus</span>
                  <SourceStatusBadge status={bonus.sourceStatus || cartridge.sourceStatus} />
                </div>
                <p className="text-sm leading-5 text-[#4b5563]">{bonus.text || bonus.effectText || 'Data coming soon.'}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Compatible Modules</h2>
          <p className="mt-1 text-xs text-[#9ca3af]">{cartridge.compatibleModules?.some((module) => module.moduleShapeId) ? cartridge.compatibleModulesStatus : 'Shape pending'}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {cartridge.compatibleModules?.length ? cartridge.compatibleModules.map((module) => (
              <div key={module.slot} className="rounded-[18px] border border-black/[0.05] bg-[#fafafa] p-3 text-center">
                {module.moduleShapeId ? <ModuleShape shapeId={module.moduleShapeId} rarity={rarity} size={13} /> : <div className="flex h-[52px] items-center justify-center rounded-2xl border border-dashed border-black/[0.08] bg-white text-xs font-semibold text-[#9ca3af]">Shape pending</div>}
                <p className="mt-3 text-xs font-bold text-[#111111]">Slot {module.slot}</p>
                <p className="mt-1 break-all text-[11px] text-[#9ca3af]">{module.moduleShapeId || 'Shape pending'}</p>
              </div>
            )) : <p className="col-span-2 rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-6 text-center text-sm text-[#9ca3af]">Shape pending</p>}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
        <div className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-[#ff2f6d]" strokeWidth={1.8} aria-hidden />
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Level 20 Stat Value Preview</h2>
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <StatTable title="Main stat max values" rows={mainRows} />
          <StatTable title="Sub stat max values" rows={subRows} />
        </div>
      </section>
      {effectiveAdminMode ? <CartridgeEditor
        cartridge={cartridge}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={saveCartridgeOverride}
        onDelete={(id) => {
          deleteCartridgeOverride(id)
          onBack?.()
        }}
      /> : null}
    </div>
  )
}

function StatTable({ title, rows }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#fafafa]">
      <div className="border-b border-black/[0.05] bg-white px-4 py-3 text-sm font-bold text-[#111111]">{title}</div>
      <div className="divide-y divide-black/[0.05]">
        {rows.length ? rows.map((row) => (
          <div key={row.statId} className="grid grid-cols-[minmax(0,1fr)_90px] gap-3 px-4 py-3 text-sm">
            <span className="font-semibold text-[#4b5563]">{row.stat?.name || row.statId}</span>
            <span className="text-right font-black text-[#111111]">{row.formattedValue}</span>
          </div>
        )) : <p className="px-4 py-6 text-sm text-[#9ca3af]">Data coming soon.</p>}
      </div>
    </div>
  )
}

function BackButton({ onBack }) {
  return (
    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-sm font-semibold text-[#111111] shadow-[0_10px_28px_rgba(0,0,0,0.045)] backdrop-blur transition hover:border-[#ff2f6d]/18 hover:bg-white hover:text-[#be123c]">
      <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      Back to Modules
    </button>
  )
}
