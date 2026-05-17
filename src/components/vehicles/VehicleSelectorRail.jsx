import { getVehicleAsset } from '../../utils/assetHelpers.js'
import { currencyClass, formatCompactPrice } from './vehicleFormat.js'

export default function VehicleSelectorRail({ vehicles, activeId, onSelect }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-black/[0.055] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,250,250,0.88))] p-3 shadow-[0_18px_52px_rgba(0,0,0,0.055)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />
      <div className="flex scroll-smooth gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {vehicles.map((vehicle) => {
          const image = getVehicleAsset(vehicle.assetKey)
          const active = vehicle.id === activeId
          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => onSelect(vehicle.id)}
              className={`grid min-w-[178px] gap-2 rounded-[22px] border p-2 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm ${
                active ? 'border-[#ff2f6d]/22 bg-[linear-gradient(180deg,#fff7fa,#ffffff)] shadow-[0_16px_42px_rgba(255,47,109,0.13)] ring-2 ring-[#ff2f6d]/8' : 'border-black/[0.06] bg-white/72'
              }`}
            >
              <div className="relative flex h-[88px] items-center justify-center overflow-hidden rounded-[18px] bg-white ring-1 ring-black/[0.04]">
                <div className="absolute inset-x-4 bottom-2 h-5 rounded-full bg-black/10 blur-md" />
                {image ? <img src={image} alt="" className="relative z-10 max-h-20 w-full object-contain px-2 drop-shadow-[0_10px_12px_rgba(0,0,0,0.12)]" loading="lazy" /> : null}
              </div>
              <div className="min-w-0 px-1">
                <p className="truncate text-sm font-black text-[#111111]">{vehicle.name}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-[#9ca3af]">{vehicle.type}</span>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black ${currencyClass(vehicle.currency)}`}>{formatCompactPrice(vehicle)}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
