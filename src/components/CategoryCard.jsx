import { ArrowUpRight, Blocks, Disc3, Package, Users, LayoutGrid, Trophy, CarFront, BookOpen, MessagesSquare, Gift, Newspaper } from 'lucide-react'
import { ModuleBlocksIcon, WeaponArcIcon } from './ui/NteCategoryIcons.jsx'

const iconMap = {
  users: Users,
  sword: WeaponArcIcon,
  package: ModuleBlocksIcon,
  disc: WeaponArcIcon,
  blocks: ModuleBlocksIcon,
  'layout-grid': LayoutGrid,
  trophy: Trophy,
  'car-front': CarFront,
  'book-open': BookOpen,
  'messages-square': MessagesSquare,
  gift: Gift,
  newspaper: Newspaper,
}

export default function CategoryCard({ title, description, accent, icon, status, onOpen }) {
  const Icon = iconMap[icon] || Package

  return (
    <button
      type="button"
      onClick={onOpen}
      className="category-card-premium card-premium interactive-soft group relative flex min-h-[180px] w-full overflow-hidden rounded-[24px] p-5 text-left active:translate-y-0 sm:p-6"
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-4 pr-2 sm:pr-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d] transition group-hover:scale-105 group-hover:bg-[#ff2f6d]/12 group-hover:shadow-[0_10px_26px_rgba(255,47,109,0.16)]">
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          {status ? (
            <span className="pill-glass px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">
              {status}
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <h3 className="break-words text-lg font-semibold leading-tight tracking-tight text-[#111111]">{title}</h3>
          <p className="max-w-[28rem] text-sm leading-6 text-[#6b7280] line-clamp-3">{description}</p>
        </div>
        <div className="mt-auto flex items-center gap-1 text-sm font-medium text-[#ff2f6d]">
          <span className="transition group-hover:translate-x-0.5">Open</span>
          <ArrowUpRight
            className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute -right-6 top-6 h-40 w-40 rounded-[28px] bg-gradient-to-br ${accent} blur-[1px]`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 bottom-[-20%] h-48 w-48 rounded-full bg-gradient-to-tr from-white via-white/20 to-transparent opacity-80"
        aria-hidden
      />
      <Icon
        className="pointer-events-none absolute -right-1 top-14 h-20 w-20 text-white/55 opacity-70 transition duration-300 group-hover:scale-105 group-hover:opacity-90"
        strokeWidth={1.45}
        aria-hidden
      />
    </button>
  )
}
