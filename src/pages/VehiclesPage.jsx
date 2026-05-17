import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CarFront, Edit3 } from 'lucide-react'
import VehicleSelectorRail from '../components/vehicles/VehicleSelectorRail.jsx'
import VehicleShowcase from '../components/vehicles/VehicleShowcase.jsx'
import VehicleStatsPanel from '../components/vehicles/VehicleStatsPanel.jsx'
import { vehicleSearchText, vehicleTypes as baseVehicleTypes } from '../data/vehicles.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import VehicleEditor from '../admin/VehicleEditor.jsx'
import PageAdminActions, { AdminAddButton } from '../components/ui/PageAdminActions.jsx'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getVehicles } from '../repositories/unified/vehiclesRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'

export default function VehiclesPage({ topbarQuery = '' }) {
  const { isAdminMode, mergedVehicles, createVehicleOverride, saveVehicleOverride, deleteVehicleOverride } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiVehicles, error, loading, reload } = useAsyncData(
    () => getVehicles(mergedVehicles),
    [apiMode, mergedVehicles],
    { enabled: apiMode, initialData: [] },
  )
  const vehicles = apiMode ? apiVehicles || [] : mergedVehicles
  const effectiveAdminMode = isAdminMode && !apiMode
  const [activeId, setActiveId] = useState(vehicles[0]?.id || '')
  const [direction, setDirection] = useState(1)
  const [typeFilter, setTypeFilter] = useState('All')
  const [editing, setEditing] = useState(null)
  const touchStart = useRef(null)
  const vehicleTypes = useMemo(() => ['All', ...Array.from(new Set([...(baseVehicleTypes || []).filter((item) => item !== 'All'), ...vehicles.map((vehicle) => vehicle.type).filter(Boolean)]))], [vehicles])

  const filteredVehicles = useMemo(() => {
    const tokens = String(topbarQuery || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
    return vehicles.filter((vehicle) => {
      if (typeFilter !== 'All' && vehicle.type !== typeFilter) return false
      if (!tokens.length) return true
      const haystack = vehicleSearchText(vehicle)
      return tokens.every((token) => haystack.includes(token))
    })
  }, [topbarQuery, typeFilter, vehicles])

  const activeIndex = Math.max(0, filteredVehicles.findIndex((vehicle) => vehicle.id === activeId))
  const activeVehicle = filteredVehicles[activeIndex] || filteredVehicles[0] || vehicles[0]

  useEffect(() => {
    if (!filteredVehicles.length) return
    if (!filteredVehicles.some((vehicle) => vehicle.id === activeId)) {
      setActiveId(filteredVehicles[0].id)
    }
  }, [activeId, filteredVehicles])

  const goToIndex = useCallback((nextIndex) => {
    if (!filteredVehicles.length) return
    const normalized = (nextIndex + filteredVehicles.length) % filteredVehicles.length
    setDirection(normalized >= activeIndex ? 1 : -1)
    setActiveId(filteredVehicles[normalized].id)
  }, [activeIndex, filteredVehicles])

  const previous = useCallback(() => goToIndex(activeIndex - 1), [activeIndex, goToIndex])
  const next = useCallback(() => goToIndex(activeIndex + 1), [activeIndex, goToIndex])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, previous])

  const selectVehicle = (id) => {
    const nextIndex = filteredVehicles.findIndex((vehicle) => vehicle.id === id)
    setDirection(nextIndex >= activeIndex ? 1 : -1)
    setActiveId(id)
  }

  const onTouchStart = (event) => {
    touchStart.current = event.touches?.[0]?.clientX ?? null
  }

  const onTouchEnd = (event) => {
    const start = touchStart.current
    const end = event.changedTouches?.[0]?.clientX
    touchStart.current = null
    if (start == null || end == null) return
    const delta = end - start
    if (Math.abs(delta) < 42) return
    if (delta > 0) previous()
    else next()
  }

  return (
    <div className="space-y-7 pb-6">
      <Seo title="Vehicles" description="Browse NTE vehicles by category, price, speed, acceleration, durability, and handling." />
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
            <CarFront className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            Premium transport showroom
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Vehicles</h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
              Browse all vehicles, prices, performance profiles, and handling characteristics in one cinematic catalog.
            </p>
          </div>
        </div>
        <PageAdminActions className="lg:flex-col lg:items-end">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <SummaryPill label="Vehicles" value={vehicles.length} />
            <SummaryPill label="Fastest" value={`${Math.max(0, ...vehicles.map((vehicle) => vehicle.maxSpeed || 0))} km/h`} />
            <SummaryPill label="Types" value={vehicleTypes.length - 1} />
          </div>
          {effectiveAdminMode ? <AdminAddButton label="Add Vehicle" onClick={() => setEditing({})} /> : null}
        </PageAdminActions>
      </header>

      <section className="rounded-[22px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.045)] sm:p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`rounded-full border px-3.5 py-2 text-sm font-bold transition ${
                  typeFilter === type
                    ? 'border-[#ff2f6d]/16 bg-[#fff7fa] text-[#be526b] shadow-sm'
                    : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white hover:text-[#111111]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <span className="w-fit rounded-full border border-black/[0.06] bg-white px-3 py-2 text-sm font-bold text-[#6b7280] shadow-sm">
            <span className="text-[#111111] tabular-nums">{filteredVehicles.length}</span> visible
          </span>
        </div>
      </section>

      {loading ? (
        <EmptyState title="Loading vehicles" description="Fetching vehicle data from the local API." />
      ) : error ? (
        <EmptyState title="Vehicles failed to load" description={error.message || 'The local API did not return vehicle data.'} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : filteredVehicles.length ? (
        <>
          <VehicleShowcase
            vehicle={activeVehicle}
            index={activeIndex}
            total={filteredVehicles.length}
            direction={direction}
            onPrevious={previous}
            onNext={next}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
          {effectiveAdminMode ? (
            <div className="flex justify-end">
              <button type="button" onClick={() => setEditing(activeVehicle)} className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/90 px-4 py-2 text-sm font-bold text-[#111111] shadow-sm transition hover:text-[#ff2f6d]">
                <Edit3 className="h-4 w-4" />
                Edit Vehicle
              </button>
            </div>
          ) : null}
          <VehicleStatsPanel vehicle={activeVehicle} />
          <VehicleSelectorRail vehicles={filteredVehicles} activeId={activeVehicle.id} onSelect={selectVehicle} />
        </>
      ) : (
        <EmptyState title="No vehicles found" description="No vehicles match the current search or type filter." />
      )}
      {effectiveAdminMode ? <VehicleEditor
        vehicle={editing?.id ? editing : null}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSave={(vehicle) => {
          if (editing?.id) saveVehicleOverride(editing.id, vehicle)
          else createVehicleOverride(vehicle)
        }}
        onDelete={(id) => {
          deleteVehicleOverride(id)
          setActiveId(vehicles.find((vehicle) => vehicle.id !== id)?.id || '')
        }}
      /> : null}
    </div>
  )
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-[#111111] shadow-sm ring-1 ring-black/[0.06]">
      <p className="text-[11px] font-bold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums">{value}</p>
    </div>
  )
}
