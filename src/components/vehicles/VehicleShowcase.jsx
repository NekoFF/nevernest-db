import { Gem, Gauge, Shield, Sparkles, Timer } from 'lucide-react'
import VehicleNavControls from './VehicleNavControls.jsx'
import VehicleStage from './VehicleStage.jsx'
import { currencyClass, formatPrice, statValue } from './vehicleFormat.js'

export default function VehicleShowcase({
  vehicle,
  index,
  total,
  direction,
  onPrevious,
  onNext,
  onTouchStart,
  onTouchEnd,
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[34px] border border-black/[0.055] bg-white/88 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.075)] sm:p-4 lg:p-5"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <VehicleNavControls onPrevious={onPrevious} onNext={onNext} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(340px,0.75fr)] xl:items-stretch">
        <VehicleStage vehicle={vehicle} direction={direction} />
        <aside key={`${vehicle.id}-info`} className="relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.66))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_18px_52px_rgba(0,0,0,0.055)] backdrop-blur-xl animate-[showInfo_300ms_ease_both]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#ff2f6d]/8 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-bold text-[#ff2f6d]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                Showroom
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs font-bold text-amber-800">Signature spec</span>
              <span className="rounded-full border border-black/[0.06] bg-[#fafafa] px-3 py-1.5 text-xs font-bold text-[#6b7280]">{index + 1} / {total}</span>
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#9ca3af]">{vehicle.type}</p>
            <h1 className="mt-1 break-words text-4xl font-black tracking-tight text-[#111111] sm:text-5xl xl:text-[3.25rem] xl:leading-none">{vehicle.name}</h1>
            <p className="mt-4 text-sm leading-7 text-[#5f6673] sm:text-base">{vehicle.description}</p>
            <div className="mt-5 rounded-[24px] border border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.74))] p-4 shadow-[0_14px_34px_rgba(245,158,11,0.10)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9ca3af]">Acquisition</p>
                  <p className="mt-1 text-xl font-black tracking-tight text-[#111111]">{formatPrice(vehicle)}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${currencyClass(vehicle.currency)}`}>
                  <Gem className="h-5 w-5" strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <MiniStat icon={Gauge} label="Speed" value={vehicle?.maxSpeed} suffix="km/h" />
            <MiniStat icon={Timer} label="Accel" value={vehicle?.acceleration} />
            <MiniStat icon={Shield} label="Durability" value={vehicle?.durability} />
          </div>
        </aside>
      </div>
      <style>{`
        @keyframes showInfo {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function MiniStat({ icon: Icon, label, value, suffix = '' }) {
  return (
    <div className="rounded-2xl border border-black/[0.055] bg-white/84 px-3 py-3 shadow-sm">
      <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-[#fff1f5] text-[#be526b] ring-1 ring-[#ff2f6d]/10">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 whitespace-nowrap text-[13px] font-black leading-tight text-[#111111] sm:text-sm xl:text-[15px]">{statValue(value, suffix ? ` ${suffix}` : '')}</p>
    </div>
  )
}
