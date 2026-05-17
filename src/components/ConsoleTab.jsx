import ModuleShape from './ModuleShape.jsx'
import CartridgeIcon from './cartridges/CartridgeIcon.jsx'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { SECTION_FALLBACKS } from '../data/characterSchema.js'
import { getModuleColor, getModuleShape } from '../data/moduleCatalog.js'
import { getCartridgeById } from '../data/cartridges.js'
import { normalizeConsole } from '../data/consoleBlocks.js'
import {
  getCartridgeModuleShapeRefs,
  normalizeBlockedCells,
  normalizePlacements,
} from '../utils/moduleShapeRefs.js'
import { getWeaponAsset } from '../utils/assetHelpers.js'
import { weaponInitials } from './weapons/weaponStyle.js'

const BLOCKED_STYLE = {
  backgroundColor: '#eef0f3',
  backgroundImage:
    'repeating-linear-gradient(135deg, rgba(107, 114, 128, 0.13) 0px, rgba(107, 114, 128, 0.13) 4px, rgba(255, 255, 255, 0.42) 4px, rgba(255, 255, 255, 0.42) 9px)',
}

function keyOf(row, col) {
  return `${row},${col}`
}

function placementCells(placement) {
  const baseRow = Number(placement?.row) || 0
  const baseCol = Number(placement?.col) || 0
  const shape = getModuleShape(placement?.moduleShapeId || placement?.shapeId)
  if (!shape?.matrix) return []
  return shape.matrix.flatMap((matrixRow, rowOffset) =>
    matrixRow.map((cell, colOffset) => (cell ? [baseRow + rowOffset, baseCol + colOffset] : null)).filter(Boolean),
  )
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111111]">{value || 'Data coming soon'}</p>
    </div>
  )
}

function BulletList({ items }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-[#6b7280]">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ff2f6d]/70" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function resolveCartridge(consoleData, cartridges) {
  const id = consoleData?.mainCartridgeId
  const nameSlug = slugify(consoleData?.mainCartridgeName)
  return cartridges?.find((item) =>
    item.id === id ||
    item.slug === id ||
    item.sourceId === id ||
    item.id === nameSlug ||
    item.slug === nameSlug ||
    slugify(item.name) === nameSlug
  ) || getCartridgeById(id) || getCartridgeById(nameSlug) || null
}

function resolveWeapon(consoleData, weapons) {
  const id = consoleData?.arcId
  const nameSlug = slugify(consoleData?.arcName)
  return weapons?.find((item) =>
    item.id === id ||
    item.slug === id ||
    item.sourceId === id ||
    item.id === nameSlug ||
    item.slug === nameSlug ||
    slugify(item.name) === nameSlug
  ) || null
}

function IconInfoButton({ label, value, image, initials, disabled, onClick, children }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-xs font-bold text-[#111111] ring-1 ring-black/[0.05]">
        {children || (image ? <img src={image} alt="" className="h-full w-full object-contain p-1.5" loading="lazy" /> : initials)}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-[#111111]">{value || 'Data coming soon'}</p>
      </div>
    </div>
  )

  return (
    <button type="button" disabled={disabled} onClick={onClick} className="rounded-2xl bg-[#fafafa] px-4 py-3 text-left ring-1 ring-black/[0.04] transition duration-200 enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:bg-white enabled:hover:shadow-sm disabled:cursor-default">
      {content}
    </button>
  )
}

function cartridgeCompatiblePieces(cartridge, fallbackPieces = []) {
  return getCartridgeModuleShapeRefs(cartridge, fallbackPieces)
}

function CompatibleModules({ pieces, onOpenModule }) {
  if (!pieces?.length) return null
  return (
    <div className="mt-5">
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Compatible Modules</h4>
      <p className="mb-3 text-xs leading-relaxed text-[#9ca3af]">These pieces are pulled from the selected cartridge and activate its set bonuses.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {pieces.map((piece) => (
          <button key={piece.id} type="button" disabled={!piece.moduleShapeId || !onOpenModule} onClick={() => onOpenModule?.(piece.moduleShapeId, piece.preferredRarity || 'S')} className="flex items-center justify-between gap-3 rounded-2xl bg-[#fafafa] px-4 py-3 text-left ring-1 ring-black/[0.04] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-white enabled:hover:shadow-sm disabled:cursor-default">
            <div className="flex min-w-0 items-center gap-3">
              {piece.moduleShapeId ? <ModuleShape shapeId={piece.moduleShapeId} rarity={piece.preferredRarity || 'S'} size={13} /> : <span className="flex h-10 w-14 items-center justify-center rounded-xl border border-dashed border-black/[0.08] bg-white text-[10px] font-semibold text-[#9ca3af]">Pending</span>}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#111111]">{piece.label}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{piece.moduleType}</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-100">
              {piece.preferredRarity || 'S'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ConsoleGrid({ grid }) {
  if (!grid) return null
  const blocked = new Set(normalizeBlockedCells(grid.blockedCells).map(([row, col]) => keyOf(row, col)))
  const placed = new Map()

  normalizePlacements(grid.placements).forEach((placement) => {
    placementCells(placement).forEach(([row, col]) => {
      placed.set(keyOf(row, col), placement)
    })
  })

  const cells = []
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const key = keyOf(row, col)
      cells.push({ key, isBlocked: blocked.has(key), placement: placed.get(key) })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3">
        {[
          ['Placed Module', 'bg-amber-400'],
          ['Blocked Cell', 'blocked'],
          ['Empty Cell', 'bg-[#fbfbfa]'],
        ].map(([label, className]) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium text-[#111111]">
            <span className={['h-3 w-3 rounded-sm ring-1 ring-black/[0.08]', className === 'blocked' ? '' : className].join(' ')} style={className === 'blocked' ? BLOCKED_STYLE : undefined} />
            {label}
          </div>
        ))}
      </div>

      <div
        className="mx-auto grid w-full max-w-[min(100%,420px)] rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-5"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`, gap: '6px' }}
      >
        {cells.map(({ key, isBlocked, placement }) => {
          if (isBlocked) return <div key={key} className="aspect-square rounded-lg ring-1 ring-black/[0.06]" style={BLOCKED_STYLE} />
          if (placement) {
            const color = getModuleColor(placement.colorKey || placement.rarity)
            return (
              <div key={key} className="aspect-square rounded-lg ring-1 ring-black/[0.06]">
                <div className="h-full w-full rounded-lg" style={{ backgroundColor: color.hex }} />
              </div>
            )
          }
          return <div key={key} className="aspect-square rounded-lg bg-[#fbfbfa] ring-1 ring-black/[0.055]" />
        })}
      </div>

      {normalizePlacements(grid.placements).length ? (
        <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Placed Modules</h4>
          <div className="flex flex-wrap gap-3">
            {normalizePlacements(grid.placements).map((placement) => (
              <div key={placement.id} className="flex items-center gap-2 rounded-2xl bg-[#fafafa] px-3 py-2 ring-1 ring-black/[0.04]">
                <ModuleShape shapeId={placement.moduleShapeId} rarity={placement.rarity} colorKey={placement.colorKey} size={10} compact />
                <span className="text-xs font-semibold text-[#6b7280]">{getModuleShape(placement.moduleShapeId)?.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function ConsoleTab({ character, consoleSetup, onOpenCartridge, onOpenWeapon, onOpenModule }) {
  const { mergedCartridges, mergedWeapons } = useAdminMode()
  const consoleData = normalizeConsole(character || { consoleSetup })

  if (!consoleData) {
    return <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{SECTION_FALLBACKS.console}</p>
  }

  const cartridge = resolveCartridge(consoleData, mergedCartridges)
  const weapon = resolveWeapon(consoleData, mergedWeapons)
  const compatiblePieces = cartridgeCompatiblePieces(cartridge, consoleData.requiredPieces)
  const cartridgeBonuses = cartridge?.bonuses?.length ? cartridge.bonuses : consoleData.cartridgeBonuses
  const weaponImage = weapon ? getWeaponAsset(weapon.name) || weapon.icon || weapon.image || '' : ''

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-[#111111]">{consoleData.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{consoleData.description || 'Data coming soon'}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <IconInfoButton label="Main Cartridge" value={cartridge?.name || consoleData.mainCartridgeName} disabled={!cartridge || !onOpenCartridge} onClick={() => onOpenCartridge?.(cartridge.slug || cartridge.id)}>
            {cartridge ? <CartridgeIcon cartridge={cartridge} rarity={consoleData.rarityPriority || 'S'} className="h-10 w-10" /> : null}
          </IconInfoButton>
          <IconInfoButton label="Arc" value={weapon?.name || consoleData.arcName} image={weaponImage} initials={weaponInitials(weapon?.name || consoleData.arcName)} disabled={!(weapon || consoleData.arcId) || !onOpenWeapon} onClick={() => onOpenWeapon?.(weapon?.slug || weapon?.id || consoleData.arcId)} />
          <InfoBlock label="Rarity Priority" value={consoleData.rarityPriority} />
          <InfoBlock label={consoleData.trait.title || 'Console Trait'} value={consoleData.trait.description} />
        </div>

        {cartridgeBonuses?.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {cartridgeBonuses.map((bonus) => (
              <div key={`${bonus.pieces}-${bonus.text}`} className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm leading-relaxed text-[#6b7280] ring-1 ring-black/[0.04]">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ff2f6d]">{bonus.pieces}-Piece Bonus</p>
                {bonus.text}
              </div>
            ))}
          </div>
        ) : null}

        <CompatibleModules pieces={compatiblePieces} onOpenModule={onOpenModule} />

        {consoleData.notes?.length ? (
          <div className="mt-5 rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
            <BulletList items={consoleData.notes} />
          </div>
        ) : null}
      </section>

      <ConsoleGrid grid={consoleData.grid} />
    </div>
  )
}
