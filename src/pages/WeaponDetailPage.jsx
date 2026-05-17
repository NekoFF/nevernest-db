import { useState } from 'react'
import { ArrowLeft, Edit3 } from 'lucide-react'
import WeaponDetailHeader from '../components/weapons/WeaponDetailHeader.jsx'
import WeaponGrowthTable from '../components/weapons/WeaponGrowthTable.jsx'
import WeaponMetricsCard from '../components/weapons/WeaponMetricsCard.jsx'
import WeaponRefinementList from '../components/weapons/WeaponRefinementList.jsx'
import { rarityAccent } from '../components/weapons/weaponStyle.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import WeaponEditor from '../admin/WeaponEditor.jsx'
import Seo from '../components/Seo.jsx'
import NotFoundState from '../components/ui/NotFoundState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getWeaponByIdOrSlugUnified } from '../repositories/unified/weaponsRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'

export default function WeaponDetailPage({ slug, onBack }) {
  const { isAdminMode, getWeaponByIdMerged, saveWeaponOverride, deleteWeaponOverride } = useAdminMode()
  const [editorOpen, setEditorOpen] = useState(false)
  const apiMode = isApiMode()
  const effectiveAdminMode = isAdminMode && !apiMode
  const { data: apiWeapon, error, loading, reload } = useAsyncData(
    () => getWeaponByIdOrSlugUnified([], slug),
    [apiMode, slug],
    { enabled: apiMode, initialData: null },
  )
  const weapon = apiMode ? apiWeapon : getWeaponByIdMerged(slug)

  if (loading) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Loading weapon" description="Loading weapon data from the local API." />
        <DetailTopRow onBack={onBack} />
        <EmptyState eyebrow="Loading" title="Loading weapon" description="Fetching weapon data from the local API." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Weapon failed to load" description="The local API did not return this weapon." />
        <DetailTopRow onBack={onBack} />
        <EmptyState eyebrow="API error" title="Weapon failed to load" description={error.message || 'The local API did not return this weapon.'} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      </div>
    )
  }

  if (!weapon) {
    return (
      <div className="space-y-5 pb-6">
        <Seo title="Weapon not found" description="This weapon route does not match an item in the current NTE database." />
        <DetailTopRow onBack={onBack} />
        <NotFoundState title="Weapon not found" description="This weapon route does not match an item in the current database." />
      </div>
    )
  }

  return (
    <div className="relative isolate space-y-4 pb-6">
      <Seo title={weapon.name} description={`${weapon.name} weapon/arc stats, refinement effects, and growth scaling for the NTE Community Database.`} />
      <div
        className={[
          'pointer-events-none absolute inset-x-[-64px] -top-24 -z-10 h-[560px]',
          'bg-[radial-gradient(circle_at_18%_12%,rgba(255,47,109,0.12),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(6,182,212,0.11),transparent_34%)]',
          '[mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_68%,transparent_100%)]',
        ].join(' ')}
      />
      <div className={`pointer-events-none absolute inset-x-[-80px] -top-32 -z-10 h-[520px] bg-gradient-to-br ${rarityAccent(weapon.rarity)} opacity-80 blur-3xl [mask-image:radial-gradient(ellipse_at_center,black_0%,black_42%,transparent_72%)]`} />
      <DetailTopRow onBack={onBack} isAdminMode={effectiveAdminMode} onEdit={() => setEditorOpen(true)} />
      <WeaponDetailHeader weapon={weapon} />
      <div className="space-y-5 pt-1">
        <WeaponMetricsCard weapon={weapon} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.82fr)]">
          <WeaponRefinementList refinements={weapon.refinements} sourceStatus={weapon.sourceStatus} />
          <WeaponGrowthTable weapon={weapon} />
        </div>
      </div>
      {effectiveAdminMode ? <WeaponEditor
        weapon={weapon}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={(data) => saveWeaponOverride(weapon.id, data)}
        onDelete={(id) => {
          deleteWeaponOverride(id)
          onBack?.()
        }}
      /> : null}
    </div>
  )
}

function DetailTopRow({ onBack, isAdminMode = false, onEdit }) {
  return (
    <div className="relative z-10 flex items-center justify-between gap-3">
      <BackButton onBack={onBack} />
      {isAdminMode ? (
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-sm font-semibold text-[#111111] shadow-[0_10px_28px_rgba(0,0,0,0.045)] backdrop-blur transition hover:border-[#ff2f6d]/18 hover:bg-white hover:text-[#be123c]">
          <Edit3 className="h-4 w-4" strokeWidth={1.8} />
          Edit Weapon
        </button>
      ) : null}
    </div>
  )
}

function BackButton({ onBack }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-sm font-semibold text-[#111111] shadow-[0_10px_28px_rgba(0,0,0,0.045)] backdrop-blur transition hover:border-[#ff2f6d]/18 hover:bg-white hover:text-[#be123c]"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      Back to Weapons
    </button>
  )
}
