function toneClass(tone) {
  if (tone === 's') return 'bg-amber-50 text-amber-700 ring-amber-100'
  if (tone === 'a') return 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100'
  if (tone === 'b') return 'bg-sky-50 text-sky-700 ring-sky-100'
  return 'bg-white text-[#111111] ring-black/[0.06]'
}

export default function SummaryCounters({ items, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end ${className}`}>
      {items.map((item) => (
        <div key={item.label} className={`rounded-2xl px-4 py-3 shadow-sm ring-1 ${toneClass(item.tone)}`}>
          <p className="text-[11px] font-bold uppercase tracking-wide opacity-70">{item.label}</p>
          <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
