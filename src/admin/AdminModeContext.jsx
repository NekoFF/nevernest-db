import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { characters as baseCharacters } from '../data/characters.js'
import { weapons as baseWeapons } from '../data/weapons.js'
import { vehicles as baseVehicles } from '../data/vehicles.js'
import { baseCartridgeSets, mergeCartridgeSetsWithOverrides, findCartridgeByIdInList } from '../data/cartridges.js'
import { baseCodes, mergeCodesWithOverrides } from '../data/codes.js'
import { baseNews, mergeNewsWithOverrides } from '../data/news.js'
import { officialTierList, normalizeTierList } from '../data/tierList.js'
import {
  clearCartridgeOverride as clearCartridgeOverrideStorage,
  clearCharacterOverride as clearOverrideStorage,
  createCartridgeOverride as createCartridgeOverrideStorage,
  createCharacterOverride as createCharacterOverrideStorage,
  createCodeOverride as createCodeOverrideStorage,
  createVehicleOverride as createVehicleOverrideStorage,
  createWeaponOverride as createWeaponOverrideStorage,
  deleteCartridgeOverride as deleteCartridgeOverrideStorage,
  deleteCharacterOverride as deleteCharacterOverrideStorage,
  getCartridgeOverrides,
  getCharacterOverrides,
  getCodeOverrides,
  getNewsOverrides,
  getOfficialTierListOverride,
  getVehicleOverrides,
  getWeaponOverrides,
  deleteVehicleOverride as deleteVehicleOverrideStorage,
  deleteWeaponOverride as deleteWeaponOverrideStorage,
  deleteCodeOverride as deleteCodeOverrideStorage,
  deleteNewsOverride as deleteNewsOverrideStorage,
  exportAdminData,
  exportCartridgeAdminData,
  getAdminStorageStatus,
  importAdminData,
  mergeItemsWithOverrides,
  mergeCharactersWithOverrides,
  readAdminMode,
  resetAdminData,
  saveCartridgeOverride as saveCartridgeOverrideStorage,
  saveCharacterOverride as saveOverrideStorage,
  saveCodeOverride as saveCodeOverrideStorage,
  saveNewsOverride as saveNewsOverrideStorage,
  saveVehicleOverride as saveVehicleOverrideStorage,
  saveWeaponOverride as saveWeaponOverrideStorage,
  saveOfficialTierListOverride as saveOfficialTierListOverrideStorage,
  createNewsOverride as createNewsOverrideStorage,
  clearOfficialTierListOverride as clearOfficialTierListOverrideStorage,
  writeAdminMode,
} from './adminDataStore.js'
import { hasAdminUrlFlag, isBrowserAdminModeAvailable } from './adminModeGate.js'

const AdminModeContext = createContext(null)
const EMPTY_COLLECTION_OVERRIDES = Object.freeze({ entries: {}, created: [], deleted: [] })

export function AdminModeProvider({ children }) {
  const adminModeAvailable = isBrowserAdminModeAvailable
  const [isAdminMode, setIsAdminMode] = useState(() => adminModeAvailable && (readAdminMode() || hasAdminUrlFlag()))
  const [overrides, setOverrides] = useState(() => adminModeAvailable ? getCharacterOverrides() : {})
  const [cartridgeOverrides, setCartridgeOverrides] = useState(() => adminModeAvailable ? getCartridgeOverrides() : EMPTY_COLLECTION_OVERRIDES)
  const [weaponOverrides, setWeaponOverrides] = useState(() => adminModeAvailable ? getWeaponOverrides() : EMPTY_COLLECTION_OVERRIDES)
  const [vehicleOverrides, setVehicleOverrides] = useState(() => adminModeAvailable ? getVehicleOverrides() : EMPTY_COLLECTION_OVERRIDES)
  const [codeOverrides, setCodeOverrides] = useState(() => adminModeAvailable ? getCodeOverrides() : EMPTY_COLLECTION_OVERRIDES)
  const [newsOverrides, setNewsOverrides] = useState(() => adminModeAvailable ? getNewsOverrides() : EMPTY_COLLECTION_OVERRIDES)
  const [tierListOverride, setTierListOverride] = useState(() => adminModeAvailable ? getOfficialTierListOverride() : null)

  const mergedCharacters = useMemo(() => mergeCharactersWithOverrides(baseCharacters, overrides), [overrides])
  const mergedCartridges = useMemo(() => mergeCartridgeSetsWithOverrides(baseCartridgeSets, cartridgeOverrides), [cartridgeOverrides])
  const mergedWeapons = useMemo(() => mergeItemsWithOverrides(baseWeapons, weaponOverrides), [weaponOverrides])
  const mergedVehicles = useMemo(() => mergeItemsWithOverrides(baseVehicles, vehicleOverrides), [vehicleOverrides])
  const mergedCodes = useMemo(() => mergeCodesWithOverrides(baseCodes, codeOverrides), [codeOverrides])
  const mergedNews = useMemo(() => mergeNewsWithOverrides(baseNews, newsOverrides), [newsOverrides])
  const mergedOfficialTierList = useMemo(() => normalizeTierList(tierListOverride || officialTierList, officialTierList), [tierListOverride])
  const adminStorageStatus = useMemo(
    () => getAdminStorageStatus(),
    [overrides, cartridgeOverrides, weaponOverrides, vehicleOverrides, codeOverrides, newsOverrides, tierListOverride],
  )

  const enableAdminMode = useCallback(() => {
    if (!adminModeAvailable) return
    writeAdminMode(true)
    setIsAdminMode(true)
  }, [adminModeAvailable])

  const disableAdminMode = useCallback(() => {
    if (adminModeAvailable) writeAdminMode(false)
    setIsAdminMode(false)
  }, [adminModeAvailable])

  const toggleAdminMode = useCallback(() => {
    if (!adminModeAvailable) return
    setIsAdminMode((prev) => {
      const next = !prev
      writeAdminMode(next)
      return next
    })
  }, [adminModeAvailable])

  const saveCharacterOverride = useCallback((id, data) => {
    if (!adminModeAvailable) return
    const next = saveOverrideStorage(id, data)
    setOverrides(next)
  }, [adminModeAvailable])

  const createCharacterOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = createCharacterOverrideStorage(data, baseCharacters)
    setOverrides(next)
  }, [adminModeAvailable])

  const deleteCharacterOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = deleteCharacterOverrideStorage(id)
    setOverrides(next)
  }, [adminModeAvailable])

  const clearCharacterOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = clearOverrideStorage(id)
    setOverrides(next)
  }, [adminModeAvailable])

  const saveCartridgeOverride = useCallback((id, data) => {
    if (!adminModeAvailable) return
    const next = saveCartridgeOverrideStorage(id, data)
    setCartridgeOverrides(next)
  }, [adminModeAvailable])

  const createCartridgeOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = createCartridgeOverrideStorage(data, baseCartridgeSets)
    setCartridgeOverrides(next)
  }, [adminModeAvailable])

  const deleteCartridgeOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = deleteCartridgeOverrideStorage(id)
    setCartridgeOverrides(next)
  }, [adminModeAvailable])

  const clearCartridgeOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = clearCartridgeOverrideStorage(id)
    setCartridgeOverrides(next)
  }, [adminModeAvailable])

  const saveWeaponOverride = useCallback((id, data) => {
    if (!adminModeAvailable) return
    const next = saveWeaponOverrideStorage(id, data)
    setWeaponOverrides(next)
  }, [adminModeAvailable])

  const createWeaponOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = createWeaponOverrideStorage(data, baseWeapons)
    setWeaponOverrides(next)
  }, [adminModeAvailable])

  const deleteWeaponOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = deleteWeaponOverrideStorage(id)
    setWeaponOverrides(next)
  }, [adminModeAvailable])

  const saveVehicleOverride = useCallback((id, data) => {
    if (!adminModeAvailable) return
    const next = saveVehicleOverrideStorage(id, data)
    setVehicleOverrides(next)
  }, [adminModeAvailable])

  const createVehicleOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = createVehicleOverrideStorage(data, baseVehicles)
    setVehicleOverrides(next)
  }, [adminModeAvailable])

  const deleteVehicleOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = deleteVehicleOverrideStorage(id)
    setVehicleOverrides(next)
  }, [adminModeAvailable])

  const saveCodeOverride = useCallback((id, data) => {
    if (!adminModeAvailable) return
    const next = saveCodeOverrideStorage(id, data)
    setCodeOverrides(next)
  }, [adminModeAvailable])

  const createCodeOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = createCodeOverrideStorage(data)
    setCodeOverrides(next)
  }, [adminModeAvailable])

  const deleteCodeOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = deleteCodeOverrideStorage(id)
    setCodeOverrides(next)
  }, [adminModeAvailable])

  const saveNewsOverride = useCallback((id, data) => {
    if (!adminModeAvailable) return
    const next = saveNewsOverrideStorage(id, data)
    setNewsOverrides(next)
  }, [adminModeAvailable])

  const createNewsOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = createNewsOverrideStorage(data)
    setNewsOverrides(next)
  }, [adminModeAvailable])

  const deleteNewsOverride = useCallback((id) => {
    if (!adminModeAvailable) return
    const next = deleteNewsOverrideStorage(id)
    setNewsOverrides(next)
  }, [adminModeAvailable])

  const saveOfficialTierListOverride = useCallback((data) => {
    if (!adminModeAvailable) return
    const next = saveOfficialTierListOverrideStorage(normalizeTierList(data, officialTierList))
    setTierListOverride(next)
  }, [adminModeAvailable])

  const clearOfficialTierListOverride = useCallback(() => {
    if (!adminModeAvailable) return
    const next = clearOfficialTierListOverrideStorage()
    setTierListOverride(next)
  }, [adminModeAvailable])

  const getCharacterByIdMerged = useCallback(
    (id) => mergedCharacters.find((c) => c.id === id) ?? null,
    [mergedCharacters],
  )

  const getCartridgeByIdMerged = useCallback(
    (id) => findCartridgeByIdInList(mergedCartridges, id),
    [mergedCartridges],
  )

  const getWeaponByIdMerged = useCallback(
    (id) => mergedWeapons.find((weapon) => weapon.id === id || weapon.slug === id) ?? null,
    [mergedWeapons],
  )

  const getVehicleByIdMerged = useCallback(
    (id) => mergedVehicles.find((vehicle) => vehicle.id === id) ?? null,
    [mergedVehicles],
  )

  const exportAllAdminData = useCallback(() => adminModeAvailable ? exportAdminData() : null, [adminModeAvailable])
  const exportCartridgeOnlyAdminData = useCallback(() => adminModeAvailable ? exportCartridgeAdminData() : null, [adminModeAvailable])

  const importAllAdminData = useCallback((payload, options) => {
    if (!adminModeAvailable) return
    importAdminData(payload, options)
    setOverrides(getCharacterOverrides())
    setCartridgeOverrides(getCartridgeOverrides())
    setWeaponOverrides(getWeaponOverrides())
    setVehicleOverrides(getVehicleOverrides())
    setCodeOverrides(getCodeOverrides())
    setNewsOverrides(getNewsOverrides())
    setTierListOverride(getOfficialTierListOverride())
  }, [adminModeAvailable])

  const resetAllAdminData = useCallback(() => {
    if (!adminModeAvailable) return
    resetAdminData()
    setOverrides(getCharacterOverrides())
    setCartridgeOverrides(getCartridgeOverrides())
    setWeaponOverrides(getWeaponOverrides())
    setVehicleOverrides(getVehicleOverrides())
    setCodeOverrides(getCodeOverrides())
    setNewsOverrides(getNewsOverrides())
    setTierListOverride(getOfficialTierListOverride())
  }, [adminModeAvailable])

  const value = useMemo(
    () => ({
      isBrowserAdminModeAvailable: adminModeAvailable,
      isAdminMode,
      enableAdminMode,
      disableAdminMode,
      toggleAdminMode,
      mergedCharacters,
      mergedCartridges,
      mergedWeapons,
      mergedVehicles,
      mergedCodes,
      mergedNews,
      mergedOfficialTierList,
      adminStorageStatus,
      getCharacterByIdMerged,
      getCartridgeByIdMerged,
      getWeaponByIdMerged,
      getVehicleByIdMerged,
      saveCharacterOverride,
      createCharacterOverride,
      deleteCharacterOverride,
      clearCharacterOverride,
      saveCartridgeOverride,
      createCartridgeOverride,
      deleteCartridgeOverride,
      clearCartridgeOverride,
      saveWeaponOverride,
      createWeaponOverride,
      deleteWeaponOverride,
      saveVehicleOverride,
      createVehicleOverride,
      deleteVehicleOverride,
      saveCodeOverride,
      createCodeOverride,
      deleteCodeOverride,
      saveNewsOverride,
      createNewsOverride,
      deleteNewsOverride,
      saveOfficialTierListOverride,
      clearOfficialTierListOverride,
      exportAllAdminData,
      exportCartridgeOnlyAdminData,
      importAllAdminData,
      resetAllAdminData,
    }),
    [
      adminModeAvailable,
      isAdminMode,
      enableAdminMode,
      disableAdminMode,
      toggleAdminMode,
      mergedCharacters,
      mergedCartridges,
      mergedWeapons,
      mergedVehicles,
      mergedCodes,
      mergedNews,
      mergedOfficialTierList,
      adminStorageStatus,
      getCharacterByIdMerged,
      getCartridgeByIdMerged,
      getWeaponByIdMerged,
      getVehicleByIdMerged,
      saveCharacterOverride,
      createCharacterOverride,
      deleteCharacterOverride,
      clearCharacterOverride,
      saveCartridgeOverride,
      createCartridgeOverride,
      deleteCartridgeOverride,
      clearCartridgeOverride,
      saveWeaponOverride,
      createWeaponOverride,
      deleteWeaponOverride,
      saveVehicleOverride,
      createVehicleOverride,
      deleteVehicleOverride,
      saveCodeOverride,
      createCodeOverride,
      deleteCodeOverride,
      saveNewsOverride,
      createNewsOverride,
      deleteNewsOverride,
      saveOfficialTierListOverride,
      clearOfficialTierListOverride,
      exportAllAdminData,
      exportCartridgeOnlyAdminData,
      importAllAdminData,
      resetAllAdminData,
    ],
  )

  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>
}

export function useAdminMode() {
  const ctx = useContext(AdminModeContext)
  if (!ctx) throw new Error('useAdminMode must be used within AdminModeProvider')
  return ctx
}
