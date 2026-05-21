import { ArrowRight } from 'lucide-react'
import WeaponImagePlaceholder from './WeaponImagePlaceholder.jsx'
import { badgeClass } from './weaponStyle.js'
import { getTypeIcon } from '../../utils/assetHelpers.js'
import GameIconBadge from '../ui/GameIconBadge.jsx'

export default function WeaponCard({ weapon, onOpenWeapon }) {
  const preview = weapon.shortDescription || weapon.refinements?.[0]?.effect || weapon.quote || 'Data coming soon.'

  return (
    <button
      type="button"
      onClick={() => onOpenWeapon(weapon.slug)}
      className="card-premium interactive-soft group flex h-full flex-col rounded-[28px] p-2.5 text-left outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-[#ff2f6d]/30"
    >
      <WeaponImagePlaceholder weapon={weapon} />

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span>
          <TypeBadge type={weapon.type} />
        </div>

        <h2 className="mt-2.5 text-[17px] font-bold leading-tight tracking-tight text-[#111111] transition group-hover:text-[#be123c]">{weapon.name}</h2>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Metric label={weapon.mainStat?.type || 'Main Stat'} value={weapon.mainStat?.value || 'Data coming soon'} />
          <Metric label={weapon.subStat?.type || 'Sub Stat'} value={weapon.subStat?.value || 'Data coming soon'} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b7280]">{preview}</p>

        <div className="mt-auto flex items-center justify-between pt-4 text-sm font-semibold text-[#ff2f6d]">
          <span>View details</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff2f6d]/8 transition group-hover:bg-[#ff2f6d] group-hover:text-white">
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden />
          </span>
        </div>
      </div>
    </button>
  )
}

function TypeBadge({ type }) {
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

function Metric({ label, value }) {
  return (
    <div className="rounded-[15px] border border-black/[0.055] bg-[#fafafa] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  )
}
