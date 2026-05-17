export default function EmptyState({
  eyebrow = 'No results',
  title = 'Nothing to show',
  description = 'Try adjusting your filters or search.',
  action = null,
  className = '',
}) {
  return (
    <section className={['rounded-[28px] border border-dashed border-black/[0.08] bg-white/82 px-6 py-12 text-center shadow-[0_18px_55px_rgba(0,0,0,0.045)]', className].filter(Boolean).join(' ')}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff2f6d]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-[#111111]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6b7280]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  )
}

