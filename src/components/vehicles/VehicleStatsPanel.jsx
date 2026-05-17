import { handlingLabels } from './vehicleFormat.js'

export default function VehicleStatsPanel({ vehicle }) {
  return (
    <section>
      <div className="rounded-[28px] border border-black/[0.055] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,250,250,0.88))] p-4 shadow-[0_18px_52px_rgba(0,0,0,0.055)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#111111]">Handling Profile</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Secondary tuning values, tuned on a restrained 0-10 showroom scale.</p>
          </div>
          <span className="rounded-full border border-black/[0.06] bg-[#fafafa] px-3 py-1 text-xs font-bold text-[#6b7280]">0-10</span>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {handlingLabels.map(([key, label]) => (
            <HandlingBar key={key} label={label} value={vehicle.handling?.[key]} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HandlingBar({ label, value }) {
  const known = value != null
  const percent = known ? Math.max(0, Math.min(100, Number(value) * 10)) : 0
  return (
    <div className="rounded-[20px] border border-black/[0.045] bg-white/70 px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#111111]">{label}</span>
        <span className="rounded-full bg-[#fff7fa] px-2.5 py-1 text-xs font-black text-[#be526b] ring-1 ring-[#ff2f6d]/10">{known ? value : '--'}</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#eef0f3] ring-1 ring-black/[0.035]">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#be526b,#e7a35f)] shadow-[0_0_14px_rgba(190,82,107,0.12)] transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-[#c0c4cc]">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  )
}
