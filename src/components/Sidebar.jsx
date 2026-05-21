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
  { id: 'apartments', label: 'Apartments', icon: LayoutGrid, page: 'apartments', status: 'Planned' },
  { id: 'tier', label: 'Tier List', icon: Trophy, page: 'tier-list' },
  { id: 'guides', label: 'Guides', icon: BookOpen, page: 'guides', status: 'Planned' },
  { id: 'codes', label: 'Codes', icon: Gift, page: 'codes' },
  { id: 'news', label: 'News', icon: Newspaper, page: 'news' },
  { id: 'community', label: 'Community', icon: MessagesSquare, page: 'community', status: 'Planned' },
  // TODO: Restore Bookmarks when user accounts/local saved profiles are implemented.
]

export default function Sidebar({ mobileOpen, onClose, activePage, onNavigate }) {
  const showDevAdmin = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_ADMIN_PANEL === '1'

  return (
    <aside
      className={[
        'sidebar-shell surface-elevated z-50 flex w-[min(292px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[24px] transition-transform duration-300',
        'fixed left-4 top-4 h-[calc(100vh-2rem)] max-w-[320px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2.5rem)]',
        'lg:h-[calc(100vh-var(--space-page-y)-var(--space-page-y))] lg:w-[var(--sidebar-width)] lg:max-w-none lg:translate-x-0',
      ].join(' ')}
      aria-label="Primary"
    >
      <div className="sidebar-brand flex shrink-0 items-start justify-between gap-3 px-5 pb-2 pt-5 lg:px-5 lg:pt-5">
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
          className="control-glass rounded-xl px-2.5 py-1 text-xs font-medium text-[#6b7280] lg:hidden"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <nav className="scrollbar-hide mx-2 mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
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
                'sidebar-nav-row group flex w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left text-sm font-medium transition',
                active
                  ? 'active-material text-[#be526b]'
                  : 'text-[#6b7280] hover:bg-black/[0.03] hover:text-[#111111]',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-[18px] w-[18px] shrink-0 transition',
                  active ? 'text-[#be526b]' : 'text-[#9ca3af] group-hover:text-[#111111]',
                ].join(' ')}
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.status ? (
                <span className="badge-soft shrink-0 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#9ca3af]">
                  {item.status}
                </span>
              ) : null}
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
              'sidebar-nav-row group flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm font-medium transition',
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

      <div className="sidebar-footer mt-auto shrink-0 space-y-1.5 bg-white/55 px-3 py-2.5 backdrop-blur-sm">
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
              className="legal-soft-button rounded-xl px-2 py-1.5 text-[10.5px] transition hover:text-[#111111]"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="surface-glass-soft rounded-[14px] px-2.5 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[11px] font-semibold text-[#111111]">Community hub</p>
                <span className="badge-soft px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wide text-[#9ca3af]">Planned</span>
              </div>
              <p className="truncate text-[10.5px] text-[#6b7280]">Links later</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="control-glass flex w-full items-center justify-center gap-2 rounded-[14px] px-3 py-1.5 text-[11px] font-semibold text-[#111111] transition hover:bg-white"
        >
          <Heart className="h-3.5 w-3.5 text-[#ff2f6d]" strokeWidth={1.75} aria-hidden />
          Support later
        </button>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="control-glass inline-flex rounded-[13px] p-0.5">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#ff2f6d]/10 text-[#ff2f6d]"
              aria-label="Light mode (preview)"
            >
              <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-[10px] text-[#9ca3af]"
              aria-label="Dark mode (coming soon)"
            >
              <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
          <button
            type="button"
            className="control-glass flex h-8 w-8 items-center justify-center rounded-[13px] text-[#6b7280] transition hover:text-[#111111]"
            aria-label="Collapse sidebar (visual)"
          >
            <ChevronsLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  )
}
