import { characters } from './characters.js'
import { weapons } from './weapons.js'
import { baseCartridgeSets as cartridges } from './cartridges.js'
import { MODULE_SHAPES as moduleShapes } from './moduleCatalog.js'
import { modulePieces } from './modulePieces.js'
import { vehicles } from './vehicles.js'
import { officialTierList as tierList } from './tierList.js'
import { baseCodes as codes } from './codes.js'
import { baseNews as news } from './news.js'
import { mediaRegistry as media } from './mediaRegistry.js'
import { mediaEntityAliases as mediaAliases } from './mediaAliases.js'

export const exportDataIndex = {
  characters,
  weapons,
  cartridges,
  moduleShapes,
  modulePieces,
  vehicles,
  tierList,
  codes,
  news,
  media,
  mediaAliases,
}

export function getExportDataSnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    version: 1,
    data: exportDataIndex,
  }
}
