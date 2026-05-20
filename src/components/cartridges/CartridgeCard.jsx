import ModuleShape from '../ModuleShape.jsx'
import CartridgeIcon from './CartridgeIcon.jsx'
import { categoryBadgeClass, rarityBadgeClass } from './cartridgeStyle.js'
import { getElementIcon } from '../../utils/assetHelpers.js'
import GameIconBadge from '../ui/GameIconBadge.jsx'

export default function CartridgeCard({ cartridge, rarity = 'S', onOpenCartridge }) {
  const twoPiece = cartridge.bonuses?.find((bonus) => bonus.pieces === 2)?.text || 'Data coming soon.'
  const fourPiece = cartridge.bonuses?.find((bonus) => bonus.pieces === 4)?.text || 'Data coming soon.'
  const elementIcon = getElementIcon(cartridge.element || cartridge.theme)
  const open = () => onOpenCartridge?.(cartridge.slug)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          open()
        }
      }}
      className="card-premium interactive-soft group flex h-full cursor-pointer flex-col rounded-[26px] p-4 outline-none transition focus-visible:border-[#ff2f6d]/30 focus-visible:shadow-[0_0_0_4px_rgba(255,47,109,0.10),0_24px_70px_rgba(0,0,0,0.075)]"
    >
      <div className="flex items-start gap-4">
        <CartridgeIcon cartridge={cartridge} rarity={rarity} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${rarityBadgeClass(rarity)}`}>{rarity}</span>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${categoryBadgeClass(cartridge.bonusCategory)}`}>{cartridge.bonusCategory}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-bold text-[#6b7280]">
              {elementIcon ? <GameIconBadge kind="element" value={cartridge.element || cartridge.theme} label={cartridge.element || cartridge.theme} assetIcon={elementIcon} size="sm" /> : null}
              {cartridge.theme || cartridge.element || 'Element'}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-bold tracking-tight text-[#111111]">{cartridge.name}</h3>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-6 text-[#6b7280]">
        <p className="line-clamp-2"><span className="font-bold text-[#111111]">2pc:</span> {twoPiece}</p>
        <p className="line-clamp-2"><span className="font-bold text-[#111111]">4pc:</span> {fourPiece}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-[#fafafa] px-3 py-2 ring-1 ring-black/[0.04]">
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Shapes</span>
        {cartridge.compatibleModules?.some((module) => module.moduleShapeId) ? cartridge.compatibleModules.slice(0, 4).map((module) => (
          module.moduleShapeId ? (
            <ModuleShape key={`${cartridge.id}-${module.slot}`} shapeId={module.moduleShapeId} rarity={rarity} size={8} compact />
          ) : (
            <span key={`${cartridge.id}-${module.slot}`} className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#9ca3af] ring-1 ring-black/[0.05]">Pending</span>
          )
        )) : <span className="text-xs font-semibold text-[#9ca3af]">Shape pending</span>}
      </div>
    </article>
  )
}
