import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell, Cat, ChevronDown, Menu, Palette, Search, Settings } from 'lucide-react'
import { useAdminMode } from '../admin/AdminModeContext.jsx'

const CATEGORY_ORDER = ['character', 'weapon', 'cartridge', 'modulePiece', 'vehicle', 'code', 'news', 'guide']

function groupedSuggestions(items = []) {
  const groups = new Map()
  items.forEach((item) => {
    const key = item.category || 'other'
    if (!groups.has(key)) groups.set(key, { key, label: item.categoryLabel || key, items: [] })
    groups.get(key).items.push(item)
  })
  return [...groups.values()].sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.key)
    const bIndex = CATEGORY_ORDER.indexOf(b.key)
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
  })
}

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
  const { isBrowserAdminModeAvailable, isAdminMode, enableAdminMode, disableAdminMode } = useAdminMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const wrapRef = useRef(null)
  const menuRef = useRef(null)
  const notificationRef = useRef(null)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const shortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') return 'Ctrl'
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'Cmd' : 'Ctrl'
  }, [])

  useEffect(() => {
    const onDoc = (event) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false)
      }
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
        setSearchOpen(Boolean(searchValue.trim()))
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchValue])

  useEffect(() => {
    if (!menuOpen) return undefined
    const updateMenuPosition = () => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuPosition({
        top: Math.round(rect.bottom + 10),
        right: Math.max(16, Math.round(window.innerWidth - rect.right)),
      })
    }
    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [menuOpen])

  useEffect(() => {
    setSearchOpen(Boolean(searchValue.trim()))
  }, [searchValue])

  const chooseSuggestion = (item) => {
    onSuggestionSelect?.(item)
    setSearchOpen(false)
  }

  const suggestionGroups = groupedSuggestions(suggestions.slice(0, 12))
  const hasSearchQuery = Boolean(searchValue.trim())
  const accountMenu = menuOpen ? (
    <div
      ref={menuRef}
      className="floating-glass fixed z-[1000] w-[min(230px,calc(100vw-2rem))] overflow-hidden rounded-2xl py-1.5"
      style={{ top: menuPosition?.top ?? 76, right: menuPosition?.right ?? 16 }}
    >
      {isBrowserAdminModeAvailable ? (
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
      ) : null}
      {isBrowserAdminModeAvailable && isAdminMode ? (
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
      <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold text-[#9ca3af] opacity-85">
        <span>Sign in</span>
        <span className="badge-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">Later</span>
      </button>
      <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold text-[#9ca3af] opacity-85">
        <span>Saved Builds</span>
        <span className="badge-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">Later</span>
      </button>
      <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold text-[#9ca3af] opacity-85">
        <span>Profile</span>
        <span className="badge-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">Later</span>
      </button>
      <button type="button" disabled className="flex w-full cursor-not-allowed items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-[#9ca3af] opacity-85">
        <Palette className="h-4 w-4" strokeWidth={1.75} />
        Theme
        <span className="badge-soft ml-auto px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">Later</span>
      </button>
      <button type="button" disabled className="flex w-full cursor-not-allowed items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-[#9ca3af] opacity-85">
        <Settings className="h-4 w-4" strokeWidth={1.75} />
        Settings
        <span className="badge-soft ml-auto px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">Later</span>
      </button>
      <p className="mt-1 bg-white/35 px-4 py-2.5 text-xs leading-5 text-[#9ca3af]">Account system planned for a later version.</p>
    </div>
  ) : null

  return (
    <>
    <header className={sticky ? 'topbar-compact sticky top-4 z-[80]' : 'relative z-20'}>
      <div className="topbar-inner surface-glass-strong flex items-center gap-2 rounded-[22px] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-5">
        <button
          type="button"
          className="control-glass inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[#111111] lg:hidden"
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
            onFocus={() => setSearchOpen(Boolean(searchValue.trim()))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && suggestions[0]) {
                event.preventDefault()
                chooseSuggestion(suggestions[0])
              }
            }}
            placeholder={placeholder}
            className="premium-input h-11 w-full rounded-full pl-11 pr-4 text-sm text-[#111111] outline-none transition placeholder:text-[#9ca3af] sm:pr-24"
          />
          <span className="pill-glass pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-medium text-[#9ca3af] sm:flex">
            <span className="text-[10px]">{shortcutLabel}</span>K
          </span>

          {searchOpen ? (
            <div className="floating-glass fixed left-4 right-4 top-[76px] z-[90] max-h-[min(70vh,420px)] overflow-y-auto rounded-[22px] p-2 [scrollbar-width:none] sm:absolute sm:left-0 sm:right-0 sm:top-[calc(100%+8px)] [&::-webkit-scrollbar]:hidden">
              {suggestionGroups.length ? suggestionGroups.map((group) => (
                <div key={group.key} className="py-1">
                  <div className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#9ca3af]">{group.label}</div>
                  {group.items.map((item) => (
                    <button
                      key={`${item.category}-${item.id}`}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseSuggestion(item)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-[#fafafa] focus-visible:bg-[#fafafa] focus-visible:outline-none"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fafafa] ring-1 ring-black/[0.05]">
                        {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" /> : <Search className="h-4 w-4 text-[#ff2f6d]" strokeWidth={1.8} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#111111]">{item.name}</span>
                        <span className="mt-0.5 block truncate text-xs font-semibold text-[#9ca3af]">{item.meta || item.categoryLabel}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )) : hasSearchQuery ? (
                <div className="rounded-2xl bg-[#fafafa] px-4 py-5 text-center ring-1 ring-black/[0.04]">
                  <p className="text-sm font-bold text-[#111111]">No matching results</p>
                  <p className="mt-1 text-xs leading-5 text-[#6b7280]">Try a character, weapon, module shape, code, vehicle type, or news category.</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isBrowserAdminModeAvailable && isAdminMode ? (
            <span className="hidden rounded-full bg-[#111111] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:inline-flex">
              Admin Mode
            </span>
          ) : null}

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="control-glass relative inline-flex h-10 w-10 items-center justify-center rounded-2xl text-[#6b7280] transition hover:text-[#111111]"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-4 w-4" strokeWidth={1.75} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ff2f6d]" />
            </button>
            {notificationsOpen ? (
              <div className="floating-glass absolute right-0 top-[calc(100%+8px)] z-[90] w-[min(280px,calc(100vw-2rem))] rounded-2xl p-4">
                  <p className="text-sm font-bold text-[#111111]">Notifications</p>
                <div className="mt-3 rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/[0.05]">
                  <div className="mb-3 h-1.5 w-12 rounded-full bg-[#ff2f6d]/20" />
                  <p className="text-sm font-semibold text-[#111111]">Notifications later</p>
                  <p className="mt-1 text-xs leading-5 text-[#6b7280]">No live account or alert system in this version.</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              onClick={() => {
                if (!menuOpen) {
                  const rect = wrapRef.current?.getBoundingClientRect()
                  if (rect) {
                    setMenuPosition({
                      top: Math.round(rect.bottom + 10),
                      right: Math.max(16, Math.round(window.innerWidth - rect.right)),
                    })
                  }
                }
                setMenuOpen((open) => !open)
              }}
              className="control-glass flex items-center gap-1 rounded-full py-1 pl-1 pr-2 transition hover:bg-white"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-[#111111]" aria-hidden>
                <Cat className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <ChevronDown className={`h-4 w-4 text-[#9ca3af] transition ${menuOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden />
            </button>

          </div>
        </div>
      </div>
    </header>
    {accountMenu && typeof document !== 'undefined' ? createPortal(accountMenu, document.body) : null}
    </>
  )
}
