export default function StatItem({ icon: Icon, label, value, onClick }) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2 rounded-2xl border border-black/[0.06] bg-white/70 px-2.5 py-3 text-left shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#ff2f6d]/12 hover:bg-white/86 hover:shadow-[0_14px_34px_rgba(0,0,0,0.07)] sm:gap-2.5 sm:px-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff2f6d]/10 text-[#ff2f6d] transition group-hover:shadow-[0_0_0_4px_rgba(255,47,109,0.06)]">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="whitespace-nowrap text-[10.5px] font-semibold leading-tight text-[#6b7280] sm:text-[11px]">{label}</p>
        <p className="min-w-0 truncate text-base font-bold leading-tight tracking-tight text-[#111111] tabular-nums">
          {value}
        </p>
      </div>
    </Component>
  )
}
