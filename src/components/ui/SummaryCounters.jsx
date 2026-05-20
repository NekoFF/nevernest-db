function toneClass(tone) {
  if (tone === 's') return 'summary-counter-s'
  if (tone === 'a') return 'summary-counter-a'
  if (tone === 'b') return 'summary-counter-b'
  return 'text-[#111111]'
}

export default function SummaryCounters({ items, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end ${className}`}>
      {items.map((item) => (
        <div key={item.label} className={`summary-counter-compact summary-counter-tile rounded-2xl px-4 py-3 ${toneClass(item.tone)} min-w-0`}>
          <p className="text-[11px] font-bold uppercase tracking-wide opacity-70">{item.label}</p>
          <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
