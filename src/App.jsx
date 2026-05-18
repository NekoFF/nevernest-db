import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import CharacterEditModal from './admin/CharacterEditModal.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import { useAdminMode } from './admin/AdminModeContext.jsx'
import { getCharacterAsset, getWeaponAsset, getModuleAsset, getVehicleAsset } from './utils/assetHelpers.js'
import { getCharacterByIdOrSlug, getCharacterRouteSlug } from './repositories/charactersRepository.js'
import NotFoundState from './components/ui/NotFoundState.jsx'
import { getApiConfig } from './api/apiConfig.js'
import { buildGlobalSearchIndex, searchGlobalIndex } from './utils/searchIndex.js'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const CharactersPage = lazy(() => import('./pages/CharactersPage.jsx'))
const CharacterDetailPage = lazy(() => import('./pages/CharacterDetailPage.jsx'))
const WeaponsPage = lazy(() => import('./pages/WeaponsPage.jsx'))
const WeaponDetailPage = lazy(() => import('./pages/WeaponDetailPage.jsx'))
const ModulesPage = lazy(() => import('./pages/ModulesPage.jsx'))
const CartridgeDetailPage = lazy(() => import('./pages/CartridgeDetailPage.jsx'))
const ModuleDetailPage = lazy(() => import('./pages/ModuleDetailPage.jsx'))
const CodesPage = lazy(() => import('./pages/CodesPage.jsx'))
const TierListPage = lazy(() => import('./pages/TierListPage.jsx'))
const VehiclesPage = lazy(() => import('./pages/VehiclesPage.jsx'))
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'))
const GuidesPage = lazy(() => import('./pages/GuidesPage.jsx'))
const BuildPlannerPage = lazy(() => import('./pages/BuildPlannerPage.jsx'))
const LegalInfoPage = lazy(() => import('./pages/LegalInfoPage.jsx'))
const DevAdminPage = lazy(() => import('./pages/DevAdminPage.jsx'))

function routeFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'dev' && parts[1] === 'admin') return { page: 'dev-admin' }
  if (parts[0] === 'admin-dev') return { page: 'dev-admin' }
  if (parts[0] === 'weapons' && parts[1]) {
    return { page: 'weapon-detail', selectedWeaponSlug: decodeURIComponent(parts[1]) }
  }
  if (parts[0] === 'weapons') return { page: 'weapons', selectedWeaponSlug: null }
  if (parts[0] === 'modules' && parts[1]) {
    if (parts[1] === 'pieces' && parts[2]) {
      return { page: 'module-detail', selectedModuleShapeId: decodeURIComponent(parts[2]), selectedModuleRarity: parts[3] ? decodeURIComponent(parts[3]).toUpperCase() : 'S' }
    }
    return { page: 'cartridge-detail', selectedCartridgeSlug: decodeURIComponent(parts[1]) }
  }
  if (parts[0] === 'modules') return { page: 'modules', selectedCartridgeSlug: null, selectedModuleShapeId: null, selectedModuleRarity: 'S' }
  if (parts[0] === 'apartments') return { page: 'apartments' }
  if (parts[0] === 'tier-list') return { page: 'tier-list' }
  if (parts[0] === 'vehicles') return { page: 'vehicles' }
  if (parts[0] === 'build-planner') return { page: 'build-planner' }
  if (parts[0] === 'guides') return { page: 'guides' }
  if (parts[0] === 'codes') return { page: 'codes' }
  if (parts[0] === 'news') return { page: 'news' }
  if (parts[0] === 'community') return { page: 'community' }
  if (['about', 'disclaimer', 'privacy', 'contact'].includes(parts[0])) return { page: parts[0] }
  if (parts[0] === 'characters' && parts[1]) {
    return { page: 'character-detail', selectedCharacterId: decodeURIComponent(parts[1]), selectedWeaponSlug: null }
  }
  if (parts[0] === 'characters') return { page: 'characters', selectedCharacterId: null, selectedWeaponSlug: null }
  return { page: 'home', selectedWeaponSlug: null, selectedCartridgeSlug: null }
}

function pushPath(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
}

function scrollPageTop() {
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
}

export default function App() {
  const {
    isAdminMode,
    getCharacterByIdMerged,
    saveCharacterOverride,
    createCharacterOverride,
    deleteCharacterOverride,
    clearCharacterOverride,
    mergedCharacters,
    mergedCartridges,
    mergedWeapons,
    mergedVehicles,
    mergedCodes,
    mergedNews,
  } = useAdminMode()
  const initialRoute = routeFromPath(window.location.pathname)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [page, setPage] = useState(initialRoute.page)
  const [selectedCharacterId, setSelectedCharacterId] = useState(initialRoute.selectedCharacterId || null)
  const [selectedWeaponSlug, setSelectedWeaponSlug] = useState(initialRoute.selectedWeaponSlug)
  const [selectedCartridgeSlug, setSelectedCartridgeSlug] = useState(initialRoute.selectedCartridgeSlug)
  const [selectedModuleShapeId, setSelectedModuleShapeId] = useState(initialRoute.selectedModuleShapeId)
  const [selectedModuleRarity, setSelectedModuleRarity] = useState(initialRoute.selectedModuleRarity || 'S')
  const [topbarSearch, setTopbarSearch] = useState('')
  const [editCharacterId, setEditCharacterId] = useState(null)
  const [addingCharacter, setAddingCharacter] = useState(false)
  const [adminOverviewOpen, setAdminOverviewOpen] = useState(false)
  const apiConfig = getApiConfig()
  const showApiModeIndicator = import.meta.env?.DEV && apiConfig.dataSource === 'api'

  const navigate = (target) => {
    setSelectedCharacterId(null)
    setSelectedWeaponSlug(null)
    setSelectedCartridgeSlug(null)
    setSelectedModuleShapeId(null)
    setPage(target)
    pushPath(target === 'home' ? '/' : `/${target}`)
    scrollPageTop()
  }

  const openCharacter = (id) => {
    const character = getCharacterByIdOrSlug(mergedCharacters, id)
    const routeId = getCharacterRouteSlug(character || { id })
    setSelectedCharacterId(routeId)
    setSelectedWeaponSlug(null)
    setSelectedCartridgeSlug(null)
    setSelectedModuleShapeId(null)
    setPage('character-detail')
    pushPath(`/characters/${encodeURIComponent(routeId)}`)
    scrollPageTop()
  }

  const backFromDetail = () => {
    setSelectedCharacterId(null)
    setPage('characters')
    pushPath('/characters')
    scrollPageTop()
  }

  const openWeapon = (slug) => {
    setSelectedCharacterId(null)
    setSelectedWeaponSlug(slug)
    setSelectedCartridgeSlug(null)
    setPage('weapon-detail')
    pushPath(`/weapons/${encodeURIComponent(slug)}`)
    scrollPageTop()
  }

  const backFromWeaponDetail = () => {
    setSelectedWeaponSlug(null)
    setPage('weapons')
    pushPath('/weapons')
    scrollPageTop()
  }

  const openCartridge = (slug) => {
    setSelectedCharacterId(null)
    setSelectedWeaponSlug(null)
    setSelectedModuleShapeId(null)
    setSelectedCartridgeSlug(slug)
    setPage('cartridge-detail')
    pushPath(`/modules/${encodeURIComponent(slug)}`)
    scrollPageTop()
  }

  const backFromCartridgeDetail = () => {
    setSelectedCartridgeSlug(null)
    setPage('modules')
    pushPath('/modules')
    scrollPageTop()
  }

  const openModule = (shapeId, rarity = 'S') => {
    setSelectedCharacterId(null)
    setSelectedWeaponSlug(null)
    setSelectedCartridgeSlug(null)
    setSelectedModuleShapeId(shapeId)
    setSelectedModuleRarity(rarity)
    setPage('module-detail')
    pushPath(`/modules/pieces/${encodeURIComponent(shapeId)}/${encodeURIComponent(rarity)}`)
    scrollPageTop()
  }

  const backFromModuleDetail = () => {
    setSelectedModuleShapeId(null)
    setPage('modules')
    pushPath('/modules')
    scrollPageTop()
  }

  useEffect(() => {
    const onPopState = () => {
      const next = routeFromPath(window.location.pathname)
      setPage(next.page)
      setSelectedWeaponSlug(next.selectedWeaponSlug)
      setSelectedCartridgeSlug(next.selectedCartridgeSlug)
      setSelectedModuleShapeId(next.selectedModuleShapeId)
      setSelectedModuleRarity(next.selectedModuleRarity || 'S')
      setSelectedCharacterId(next.selectedCharacterId || null)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const sidebarActive = page === 'character-detail' ? 'characters' : page === 'weapon-detail' ? 'weapons' : page === 'cartridge-detail' || page === 'module-detail' ? 'modules' : page
  const searchPlaceholder = page === 'characters' || page === 'character-detail'
    ? 'Search characters...'
    : page === 'weapons' || page === 'weapon-detail'
      ? 'Search weapons...'
      : page === 'modules' || page === 'cartridge-detail' || page === 'module-detail'
        ? 'Search modules and cartridges...'
        : page === 'codes'
          ? 'Search codes...'
          : page === 'tier-list'
            ? 'Search tier list characters...'
            : page === 'vehicles'
              ? 'Search vehicles...'
              : page === 'news'
                ? 'Search news...'
                : page === 'build-planner'
                  ? 'Search planner data...'
                  : page === 'guides'
                    ? 'Search guide categories...'
                    : 'Search characters, weapons, modules, guides...'

  const globalSearchIndex = useMemo(() => buildGlobalSearchIndex({
    characters: mergedCharacters,
    weapons: mergedWeapons,
    cartridges: mergedCartridges,
    vehicles: mergedVehicles,
    codes: mergedCodes,
    news: mergedNews,
    imageResolvers: {
      character: (character) => getCharacterAsset(character.name),
      weapon: (weapon) => getWeaponAsset(weapon.name),
      cartridge: (cartridge) => getModuleAsset(cartridge.name),
      vehicle: (vehicle) => getVehicleAsset(vehicle.assetKey),
    },
  }), [mergedCharacters, mergedWeapons, mergedCartridges, mergedVehicles, mergedCodes, mergedNews])

  const searchSuggestions = useMemo(() => {
    const query = topbarSearch.trim()
    if (!query) return []
    const inScope = (category) => {
      if (page === 'characters' || page === 'character-detail') return category === 'character'
      if (page === 'weapons' || page === 'weapon-detail') return category === 'weapon'
      if (page === 'modules' || page === 'cartridge-detail' || page === 'module-detail') return category === 'cartridge' || category === 'modulePiece'
      if (page === 'codes') return category === 'code'
      if (page === 'tier-list') return category === 'character'
      if (page === 'vehicles') return category === 'vehicle'
      if (page === 'news') return category === 'news'
      if (page === 'build-planner') return ['character', 'weapon', 'cartridge', 'modulePiece'].includes(category)
      if (page === 'guides') return category === 'guide'
      return true
    }
    return searchGlobalIndex(globalSearchIndex.filter((item) => inScope(item.category)), query, 18)
  }, [globalSearchIndex, page, topbarSearch])

  const openSearchSuggestion = (item) => {
    setTopbarSearch('')
    if (item.category === 'character') openCharacter(item.id)
    else if (item.category === 'weapon') openWeapon(item.id)
    else if (item.category === 'cartridge') openCartridge(item.id)
    else if (item.category === 'modulePiece') openModule(item.shapeId || item.id, item.rarity || 'S')
    else if (item.category === 'code') {
      setTopbarSearch(item.name)
      navigate('codes')
    }
    else if (item.category === 'vehicle') {
      setTopbarSearch(item.name)
      navigate('vehicles')
    }
    else if (item.category === 'news') {
      setTopbarSearch(item.name)
      navigate('news')
    }
    else if (item.category === 'guide') {
      setTopbarSearch(item.name)
      navigate('guides')
    }
  }

  const editCharacter = editCharacterId ? getCharacterByIdMerged(editCharacterId) : null
  const selectedCharacter = selectedCharacterId ? getCharacterByIdOrSlug(mergedCharacters, selectedCharacterId) : null

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f7] text-[#111111]">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-0 w-full max-w-[1720px] flex-1 flex-col gap-5 px-4 pb-16 pt-5 md:px-7 md:pt-6 lg:flex-row lg:items-start lg:gap-8 lg:px-10 lg:pt-8">
        <div className="w-0 shrink-0 lg:sticky lg:top-6 lg:z-30 lg:h-[calc(100vh-48px)] lg:w-[300px] lg:shrink-0 lg:self-start">
          <div className="h-full">
            <Sidebar
              mobileOpen={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
              activePage={sidebarActive}
              onNavigate={navigate}
            />
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 lg:gap-6">
          <Topbar
            onOpenNav={() => setMobileNavOpen(true)}
            searchValue={topbarSearch}
            onSearchChange={setTopbarSearch}
            placeholder={searchPlaceholder}
            suggestions={searchSuggestions}
            onSuggestionSelect={openSearchSuggestion}
            onOpenAdminOverview={() => setAdminOverviewOpen(true)}
            sticky={page !== 'vehicles'}
          />

          <main className="min-h-0 flex-1 pb-6">
            <Suspense fallback={<RouteLoadingFallback />}>
              {page === 'home' ? <HomePage onNavigate={navigate} /> : null}
              {page === 'characters' ? (
                <CharactersPage
                  topbarQuery={topbarSearch}
                  onOpenCharacter={openCharacter}
                  onAdminEditCharacter={(id) => setEditCharacterId(id)}
                  onAdminAddCharacter={() => setAddingCharacter(true)}
                />
              ) : null}
              {page === 'weapons' ? (
                <WeaponsPage
                  topbarQuery={topbarSearch}
                  onOpenWeapon={openWeapon}
                  weapons={mergedWeapons}
                />
              ) : null}
              {page === 'weapon-detail' ? (
                <WeaponDetailPage
                  slug={selectedWeaponSlug}
                  onBack={backFromWeaponDetail}
                  weapons={mergedWeapons}
                />
              ) : null}
              {page === 'modules' ? (
                <ModulesPage
                  topbarQuery={topbarSearch}
                  onOpenCartridge={openCartridge}
                  onOpenModule={openModule}
                />
              ) : null}
              {page === 'cartridge-detail' ? (
                <CartridgeDetailPage
                  slug={selectedCartridgeSlug}
                  onBack={backFromCartridgeDetail}
                />
              ) : null}
              {page === 'module-detail' ? (
                <ModuleDetailPage
                  shapeId={selectedModuleShapeId}
                  initialRarity={selectedModuleRarity}
                  onBack={backFromModuleDetail}
                />
              ) : null}
              {page === 'codes' ? <CodesPage topbarQuery={topbarSearch} /> : null}
              {page === 'tier-list' ? <TierListPage topbarQuery={topbarSearch} /> : null}
              {page === 'vehicles' ? <VehiclesPage topbarQuery={topbarSearch} /> : null}
              {page === 'build-planner' ? <BuildPlannerPage /> : null}
              {page === 'news' ? <NewsPage topbarQuery={topbarSearch} /> : null}
              {page === 'guides' ? <GuidesPage /> : null}
              {page === 'dev-admin' ? <DevAdminPage /> : null}
              {['about', 'disclaimer', 'privacy', 'contact'].includes(page) ? <LegalInfoPage page={page} /> : null}
              {page === 'character-detail' && selectedCharacterId ? (
                <CharacterDetailPage
                  characterId={selectedCharacter?.id || selectedCharacterId}
                  onBack={backFromDetail}
                  onOpenCharacter={openCharacter}
                  onOpenWeapon={openWeapon}
                  onOpenCartridge={openCartridge}
                  onOpenModule={openModule}
                  onAdminEditCharacter={(id) => setEditCharacterId(id)}
                />
              ) : null}
              {page === 'character-detail' && !selectedCharacterId ? (
                <NotFoundState
                  title="Character not found"
                  description="This character route is missing an id. Return to Characters and choose an entry from the database."
                  action={<button type="button" onClick={() => navigate('characters')} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Back to Characters</button>}
                />
              ) : null}
              {['apartments', 'community'].includes(page) ? (
                <PlaceholderPage page={page} onBack={() => navigate('home')} />
              ) : null}
            </Suspense>
          </main>
        </div>
      </div>

      <CharacterEditModal
        character={editCharacter}
        open={Boolean(editCharacterId) || addingCharacter}
        onClose={() => { setEditCharacterId(null); setAddingCharacter(false) }}
        onSave={(id, data) => {
          saveCharacterOverride(id, data)
        }}
        onCreate={(data) => {
          createCharacterOverride(data)
        }}
        onDelete={(id) => {
          deleteCharacterOverride(id)
          setSelectedCharacterId(null)
          setPage('characters')
          pushPath('/characters')
        }}
        onResetOverride={(id) => {
          clearCharacterOverride(id)
        }}
      />
      <AdminDashboard open={isAdminMode && adminOverviewOpen} onClose={() => setAdminOverviewOpen(false)} />
      {showApiModeIndicator ? (
        <div className="fixed bottom-3 right-3 z-[120] rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#6b7280] shadow-sm backdrop-blur">
          API mode
        </div>
      ) : null}
    </div>
  )
}

function RouteLoadingFallback() {
  return (
    <section className="rounded-[28px] border border-black/[0.06] bg-white/92 px-6 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.055)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">Loading</p>
      <h1 className="mt-3 text-2xl font-black tracking-tight text-[#111111]">Preparing database view</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6b7280]">Loading the selected section and keeping the current workspace ready.</p>
    </section>
  )
}

function PlaceholderPage({ page, onBack }) {
  const contentMap = {
    apartments: {
      eyebrow: 'Planned section',
      title: 'Apartments',
      description: 'Housing and city-life references are planned, but data and source policy are still pending. This page is intentionally parked until verified sources are ready.',
    },
    community: {
      eyebrow: 'Planned section',
      title: 'Community',
      description: 'Community tools are planned later after privacy, moderation, and account safety are ready. No public accounts, comments, or submissions are enabled.',
    },
    'tier-list': {
      eyebrow: 'Coming later',
      title: 'Tier List',
      description: 'This section is being prepared and will plug into the same database style when data is ready.',
    },
    vehicles: {
      eyebrow: 'Coming later',
      title: 'Vehicles',
      description: 'This section is being prepared and will plug into the same database style when data is ready.',
    },
    guides: {
      eyebrow: 'Coming later',
      title: 'Guides',
      description: 'This section is being prepared and will plug into the same database style when data is ready.',
    },
    codes: {
      eyebrow: 'Coming later',
      title: 'Codes',
      description: 'This section is being prepared and will plug into the same database style when data is ready.',
    },
    news: {
      eyebrow: 'Coming later',
      title: 'News',
      description: 'This section is being prepared and will plug into the same database style when data is ready.',
    },
  }
  const content = contentMap[page] || {
    eyebrow: 'Coming later',
    title: 'Section',
    description: 'This section is being prepared and will plug into the same database style when data is ready.',
  }
  return (
    <section className="rounded-[28px] border border-black/[0.06] bg-white/92 px-6 py-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.055)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">{content.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111111]">{content.title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6b7280]">{content.description}</p>
      <button type="button" onClick={onBack} className="mt-6 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
        Back Home
      </button>
    </section>
  )
}
