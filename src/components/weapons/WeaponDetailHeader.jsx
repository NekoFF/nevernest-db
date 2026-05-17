import WeaponImagePlaceholder from './WeaponImagePlaceholder.jsx'
import { badgeClass, rarityAccent } from './weaponStyle.js'
import { getTypeIcon } from '../../utils/assetHelpers.js'

export default function WeaponDetailHeader({ weapon }) {
  const typeIcon = getTypeIcon(weapon.type)

  return (
    <section className="relative isolate overflow-hidden rounded-[34px] border border-white/75 bg-white/78 p-4 shadow-[0_24px_78px_rgba(0,0,0,0.068)] ring-1 ring-black/[0.04] backdrop-blur-xl lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6 lg:p-5">
      <div className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${rarityAccent(weapon.rarity)} blur-3xl`} />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[#06b6d4]/10 blur-3xl" />
      <div className="relative flex flex-col justify-center px-1 py-2 lg:px-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span>
          <span className={`${badgeClass('type', weapon.type)} inline-flex items-center gap-1.5`}>
            {typeIcon ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/[0.04]">
                <img src={typeIcon} alt="" className="h-3.5 w-3.5 object-contain" loading="lazy" />
              </span>
            ) : null}
            {weapon.type}
          </span>
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[#111111] sm:text-5xl">{weapon.name}</h1>
        {weapon.quote ? (
          <div className="mt-4 max-w-3xl rounded-[22px] border border-white/75 bg-white/58 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
            <p className="text-sm italic leading-7 text-[#5b6472] sm:text-base">"{weapon.quote}"</p>
          </div>
        ) : (
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#6b7280]">Weapon details and artwork are being prepared.</p>
        )}
      </div>
      <div className="relative mt-4 lg:mt-0">
        <WeaponImagePlaceholder weapon={weapon} large />
      </div>
    </section>
  )
}
