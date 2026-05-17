import { useState } from 'react'
import { ArrowLeft, Boxes, Gauge } from 'lucide-react'
import ModuleShape from '../components/ModuleShape.jsx'
import { rarityBadgeClass } from '../components/cartridges/cartridgeStyle.js'
import { getModuleShape } from '../data/moduleCatalog.js'
import {
  getModuleMainStats,
  getModulePieceByShapeAndRarity,
  getModulePossibleSubStats,
  getModuleRarityColor,
  MODULE_MAX_LEVEL,
  MODULE_RARITIES,
} from '../data/modulePieces.js'
import Seo from '../components/Seo.jsx'
import NotFoundState from '../components/ui/NotFoundState.jsx'

export default function ModuleDetailPage({ shapeId, initialRarity = 'S', onBack }) {
  const shape = getModuleShape(shapeId)
  const [rarity, setRarity] = useState(MODULE_RARITIES.includes(initialRarity) ? initialRarity : 'S')
  const piece = getModulePieceByShapeAndRarity(shapeId, rarity)

  if (!piece || shape?.isPlaceholder) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Module not found" description="This module route does not match a real console module shape." />
        <BackButton onBack={onBack} />
        <NotFoundState title="Module not found" description="This module route does not match a real console module shape." />
      </div>
    )
  }

  const mainStats = getModuleMainStats(piece)
  const possibleSubStats = getModulePossibleSubStats(piece)
  const rarityColor = getModuleRarityColor(rarity)

  return (
    <div className="relative isolate space-y-5 pb-6">
      <Seo title={`Type ${piece.moduleType} Module`} description={`Type ${piece.moduleType} ${rarity}-rank module shape and stat preview for the NTE Community Database.`} />
      <div className="pointer-events-none absolute inset-x-[-80px] -top-28 -z-10 h-[520px] opacity-90 blur-3xl [mask-image:radial-gradient(ellipse_at_center,black_0%,black_42%,transparent_74%)]" style={{ background: `radial-gradient(circle at 50% 0%, ${rarityColor.hex}33, transparent 62%)` }} />
      <BackButton onBack={onBack} />

      <section className="overflow-hidden rounded-[34px] border border-white/70 bg-white/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-7">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${rarityBadgeClass(rarity)}`}>{rarity} Rank Module</span>
              <span className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-[#6b7280]">Type {piece.moduleType}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-[#6b7280]">
                <Gauge className="h-3.5 w-3.5" strokeWidth={1.8} />
                MAX • Lv. {MODULE_MAX_LEVEL}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#111111] sm:text-5xl">Type {piece.moduleType} Module</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#6b7280]">Console Module. Activate by placing it into a Console.</p>
            <div className="mt-5 inline-flex rounded-full border border-black/[0.06] bg-[#fafafa] p-1 shadow-inner">
              {MODULE_RARITIES.map((item) => (
                <button key={item} type="button" onClick={() => setRarity(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${rarity === item ? 'bg-white text-[#ff2f6d] shadow-sm' : 'text-[#6b7280] hover:text-[#111111]'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-[34px] border border-black/[0.05] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_70px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-[-20%] blur-2xl" style={{ background: `radial-gradient(circle, ${rarityColor.hex}33, transparent 62%)` }} />
              <ModuleShape shapeId={shapeId} rarity={rarity} size={30} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.75fr)_minmax(380px,1fr)]">
        <section className="rounded-[28px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Main Stats</h2>
          <p className="mt-1 text-xs text-[#9ca3af]">Fixed for every module piece.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {mainStats.map((row) => (
              <div key={row.statId} className="rounded-[20px] border border-black/[0.05] bg-[#fafafa] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{row.stat?.name || row.statId}</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-[#111111]">{row.formattedValue}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Console Shape</h2>
          <div className="mt-4 flex min-h-[150px] items-center justify-center rounded-[24px] bg-[#fafafa] ring-1 ring-black/[0.04]">
            <ModuleShape shapeId={shapeId} rarity={rarity} size={24} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label="Cells" value={piece.cellCount} />
            <Info label="Shape" value={shape.name} />
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-[#ff2f6d]" strokeWidth={1.8} />
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Possible Sub Stats</h2>
        </div>
        <p className="mt-1 text-xs text-[#9ca3af]">Values are max level and scale by cell count.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {possibleSubStats.map((row) => (
            <div key={row.statId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border border-black/[0.05] bg-[#fafafa] px-4 py-3">
              <span className="font-semibold text-[#4b5563]">{row.stat?.name || row.statId}</span>
              <span className="font-black text-[#111111]">{row.formattedValue}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-black/[0.05]">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 font-semibold text-[#111111]">{value}</p>
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
