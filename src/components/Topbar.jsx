import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Cat, ChevronDown, Menu, Palette, Search, Settings } from 'lucide-react'
import { useAdminMode } from '../admin/AdminModeContext.jsx'

export default function Topbar({
  onOpenNav,
  searchValue,
  onSearchChange,
  placeholder = 'Search characters, weapons, modules, guides...',
  suggestions = [],
  onSuggestionSelect,
  onOpenAdminOverview,
  sticky = true,
}) {
  const { isAdminMode, enableAdminMode, disableAdminMode } = useAdminMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const wrapRef = useRef(null)
  const notificationRef = useRef(null)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const shortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') return 'Ctrl'
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'Cmd' : 'Ctrl'
  }, [])

  useEffect(() => {
    const onDoc = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setMenuOpen(false)
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false)
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setNotificationsOpen(false)
        setSearchOpen(false)
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setSearchOpen(Boolean(searchValue.trim() && suggestions.length))
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchValue, suggestions.length])

  useEffect(() => {
    setSearchOpen(Boolean(searchValue.trim() && suggestions.length))
  }, [searchValue, suggestions.length])

  const chooseSuggestion = (item) => {
    onSuggestionSelect?.(item)
    setSearchOpen(false)
  }

  return (
    <header className={sticky ? 'sticky top-4 z-30' : 'relative z-20'}>
      <div className="flex items-center gap-2 rounded-[22px] border border-black/[0.06] bg-white/98 px-3 py-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.07)] sm:gap-3 sm:px-4 sm:py-3 md:px-5">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#111111] shadow-sm lg:hidden"
          onClick={onOpenNav}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="relative min-w-0 flex-1" ref={searchRef}>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <input
            ref={inputRef}
            type="search"
            aria-label="Search"
            value={searchValue}
            onChange={(event) => {
              onSearchChange(event.target.value)
              setSearchOpen(Boolean(event.target.value.trim()))
            }}
            onFocus={() => setSearchOpen(Boolean(searchValue.trim() && suggestions.length))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && suggestions[0]) {
                event.preventDefault()
                chooseSuggestion(suggestions[0])
              }
            }}
            placeholder={placeholder}
            className="h-11 w-full rounded-full border border-black/[0.05] bg-[#fafafa] pl-11 pr-4 text-sm text-[#111111] shadow-inner outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff2f6d]/28 focus:bg-white focus:shadow-[0_10px_40px_rgba(255,47,109,0.07)] sm:pr-24"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-black/[0.06] bg-white px-2 py-0.5 text-[11px] font-medium text-[#9ca3af] shadow-sm sm:flex">
            <span className="text-[10px]">{shortcutLabel}</span>K
          </span>

          {searchOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[min(70vh,420px)] overflow-y-auto rounded-[22px] border border-black/[0.08] bg-white/98 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.14)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.slice(0, 7).map((item) => (
                <button
                  key={`${item.category}-${item.id}`}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseSuggestion(item)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-[#fafafa]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fafafa] ring-1 ring-black/[0.05]">
                    {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" /> : <Search className="h-4 w-4 text-[#ff2f6d]" strokeWidth={1.8} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#111111]">{item.name}</span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-[#9ca3af]">{item.categoryLabel}{item.meta ? ` - ${item.meta}` : ''}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isAdminMode ? (
            <span className="hidden rounded-full bg-[#111111] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:inline-flex">
              Admin Mode
            </span>
          ) : null}

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] shadow-sm transition hover:text-[#111111]"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-4 w-4" strokeWidth={1.75} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ff2f6d]" />
            </button>
            {notificationsOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-black/[0.08] bg-white/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                <p className="text-sm font-bold text-[#111111]">Notifications</p>
                <div className="mt-3 rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/[0.05]">
                  <div className="mb-3 h-1.5 w-12 rounded-full bg-[#ff2f6d]/20" />
                  <p className="text-sm font-semibold text-[#111111]">No notifications yet.</p>
                  <p className="mt-1 text-xs leading-5 text-[#6b7280]">Updates, saved changes, and account alerts will appear here later.</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-1 rounded-full border border-black/[0.06] bg-[#fafafa] py-1 pl-1 pr-2 shadow-sm transition hover:bg-white"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-[#111111]" aria-hidden>
                <Cat className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <ChevronDown className={`h-4 w-4 text-[#9ca3af] transition ${menuOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(230px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-black/[0.08] bg-white/98 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                <button
                  type="button"
                  className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#111111] transition hover:bg-[#fafafa]"
                  onClick={() => {
                    if (isAdminMode) disableAdminMode()
                    else enableAdminMode()
                    setMenuOpen(false)
                  }}
                >
                  {isAdminMode ? 'Exit Admin Mode' : 'Admin Mode'}
                </button>
                {isAdminMode ? (
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#111111] transition hover:bg-[#fafafa]"
                    onClick={() => {
                      setMenuOpen(false)
                      onOpenAdminOverview?.()
                    }}
                  >
                    Admin Overview
                  </button>
                ) : null}
                <button type="button" className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#6b7280] transition hover:bg-[#fafafa]">
                  Sign in later
                </button>
                <button type="button" className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#6b7280] transition hover:bg-[#fafafa]">
                  Saved Builds later
                </button>
                <button type="button" className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#6b7280] transition hover:bg-[#fafafa]">
                  Profile later
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-[#6b7280] transition hover:bg-[#fafafa]">
                  <Palette className="h-4 w-4" strokeWidth={1.75} />
                  Theme
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-[#6b7280] transition hover:bg-[#fafafa]">
                  <Settings className="h-4 w-4" strokeWidth={1.75} />
                  Settings
                </button>
                <p className="border-t border-black/[0.05] px-4 py-2.5 text-xs leading-5 text-[#9ca3af]">Account system coming later.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
