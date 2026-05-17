import {
  Home,
  Users,
  Disc3,
  Blocks,
  CarFront,
  Calculator,
  LayoutGrid,
  Trophy,
  BookOpen,
  Gift,
  Newspaper,
  MessagesSquare,
  Heart,
  Sun,
  Moon,
  ChevronsLeft,
  MessageCircle,
  Settings,
} from 'lucide-react'
import { ModuleBlocksIcon, WeaponArcIcon } from './ui/NteCategoryIcons.jsx'

const navItems = [
  { id: 'home', label: 'Home', icon: Home, page: 'home' },
  { id: 'characters', label: 'Characters', icon: Users, page: 'characters' },
  { id: 'weapons', label: 'Weapons', icon: WeaponArcIcon, page: 'weapons' },
  { id: 'modules', label: 'Modules', icon: ModuleBlocksIcon, page: 'modules' },
  { id: 'vehicles', label: 'Vehicles', icon: CarFront, page: 'vehicles' },
  { id: 'build-planner', label: 'Build Planner', icon: Calculator, page: 'build-planner' },
  { id: 'apartments', label: 'Apartments', icon: LayoutGrid, page: 'apartments' },
  { id: 'tier', label: 'Tier List', icon: Trophy, page: 'tier-list' },
  { id: 'guides', label: 'Guides', icon: BookOpen, page: 'guides' },
  { id: 'codes', label: 'Codes', icon: Gift, page: 'codes' },
  { id: 'news', label: 'News', icon: Newspaper, page: 'news' },
  { id: 'community', label: 'Community', icon: MessagesSquare, page: 'community' },
  // TODO: Restore Bookmarks when user accounts/local saved profiles are implemented.
]

export default function Sidebar({ mobileOpen, onClose, activePage, onNavigate }) {
  const showDevAdmin = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_ADMIN_PANEL === '1'

  return (
    <aside
      className={[
        'z-50 flex w-[min(292px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.07)] transition-transform duration-300',
        'fixed left-4 top-4 h-[calc(100vh-2rem)] max-w-[320px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2.5rem)]',
        'lg:relative lg:left-auto lg:top-auto lg:h-full lg:w-[284px] lg:max-w-none lg:translate-x-0 lg:shadow-[0_22px_70px_rgba(0,0,0,0.06)]',
      ].join(' ')}
      aria-label="Primary"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-2 pt-6 lg:px-6 lg:pt-7">
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#111111]">NTE</div>
          <div className="mt-1 text-xs leading-snug text-[#6b7280]">
            Neverness To Everness
            <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff2f6d]">
              Database
            </span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl border border-black/[0.06] bg-[#fafafa] px-2.5 py-1 text-xs font-medium text-[#6b7280] shadow-sm lg:hidden"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <nav className="scrollbar-hide mx-2 mt-2 flex-1 space-y-1 overflow-y-auto px-2 pb-4 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.page != null && activePage === item.page
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.page) onNavigate(item.page)
                onClose()
              }}
              className={[
                'group flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm font-medium transition',
                active
                  ? 'bg-[#ff2f6d]/10 text-[#ff2f6d]'
                  : 'text-[#6b7280] hover:bg-black/[0.03] hover:text-[#111111]',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-[18px] w-[18px] shrink-0 transition',
                  active ? 'text-[#ff2f6d]' : 'text-[#9ca3af] group-hover:text-[#111111]',
                ].join(' ')}
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{item.label}</span>
            </button>
          )
        })}
        {showDevAdmin && (
          <button
            type="button"
            onClick={() => {
              onNavigate('dev-admin')
              onClose()
            }}
            className={[
              'group flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm font-medium transition',
              activePage === 'dev-admin'
                ? 'bg-amber-500/10 text-amber-600'
                : 'text-[#6b7280] hover:bg-black/[0.03] hover:text-[#111111]',
            ].join(' ')}
          >
            <Settings
              className={[
                'h-[18px] w-[18px] shrink-0 transition',
                activePage === 'dev-admin' ? 'text-amber-600' : 'text-[#9ca3af] group-hover:text-[#111111]',
              ].join(' ')}
              strokeWidth={1.75}
              aria-hidden
            />
            <span>Dev Admin</span>
          </button>
        )}
      </nav>

      <div className="mt-auto shrink-0 space-y-3 border-t border-black/[0.05] bg-white/80 px-5 py-5 backdrop-blur-sm lg:px-6">
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-[#6b7280]">
          {[
            ['about', 'About'],
            ['disclaimer', 'Disclaimer'],
            ['privacy', 'Privacy'],
            ['contact', 'Contact'],
          ].map(([page, label]) => (
            <button
              key={page}
              type="button"
              onClick={() => {
                onNavigate(page)
                onClose()
              }}
              className="rounded-xl border border-black/[0.05] bg-white px-2.5 py-2 transition hover:bg-[#fafafa] hover:text-[#111111]"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="rounded-[14px] border border-black/[0.06] bg-[#fafafa] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
              <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#111111]">Join our Discord</p>
              <p className="text-xs text-[#6b7280]">12,840 members online</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-black/[0.06] bg-white px-4 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
        >
          <Heart className="h-4 w-4 text-[#ff2f6d]" strokeWidth={1.75} aria-hidden />
          Support project
        </button>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="inline-flex rounded-[14px] border border-black/[0.06] bg-[#fafafa] p-1 shadow-sm">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#ff2f6d]/10 text-[#ff2f6d]"
              aria-label="Light mode (preview)"
            >
              <Sun className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#9ca3af]"
              aria-label="Dark mode (coming soon)"
            >
              <Moon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-black/[0.06] bg-white text-[#6b7280] shadow-sm transition hover:text-[#111111]"
            aria-label="Collapse sidebar (visual)"
          >
            <ChevronsLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  )
}
