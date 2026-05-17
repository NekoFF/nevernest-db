import ConsoleGrid from './ConsoleGrid.jsx'
import RequiredPieces from './RequiredPieces.jsx'
import { SECTION_FALLBACKS } from '../data/characterSchema.js'

const PLACEHOLDER = 'Data coming soon'
const RARITY_NOTE =
  'Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options.'

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111111]">{value || PLACEHOLDER}</p>
    </div>
  )
}

function BulletList({ items }) {
  if (!items?.length) return null

  return (
    <ul className="space-y-2 text-sm leading-relaxed text-[#6b7280]">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ff2f6d]/70" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ConsoleSetupTemplate({ consoleSetup }) {
  if (!consoleSetup) {
    return (
      <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">
        {SECTION_FALLBACKS.console}
      </p>
    )
  }

  const requiredPieces = consoleSetup.requiredPieces || []
  const placedPieces = consoleSetup.grid?.placedPieces || []
  const rarityPriority = consoleSetup.rarityPriority || ['S', 'A', 'B']

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-[#111111]">{consoleSetup.title || 'Console Setup'}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{consoleSetup.description || PLACEHOLDER}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <InfoBlock label="Main Cartridge" value={consoleSetup.mainCartridge} />
          <InfoBlock label="Arc" value={consoleSetup.arc} />
          <InfoBlock label="Rarity Priority" value={rarityPriority.join(' > ')} />
        </div>

        {consoleSetup.cartridgeEffects?.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {consoleSetup.cartridgeEffects.map((effect) => (
              <div key={effect} className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm leading-relaxed text-[#6b7280] ring-1 ring-black/[0.04]">
                {effect}
              </div>
            ))}
          </div>
        ) : null}

        <RequiredPieces pieces={requiredPieces} placedPieces={placedPieces} />

        <p className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-xs leading-relaxed text-cyan-900">
          {consoleSetup.rarityNote || RARITY_NOTE}
        </p>

        {consoleSetup.notes?.length ? (
          <div className="mt-5 rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
            <BulletList items={consoleSetup.notes} />
          </div>
        ) : null}
      </section>

      <ConsoleGrid consoleGrid={consoleSetup.grid} requiredPieces={requiredPieces} />
    </div>
  )
}
