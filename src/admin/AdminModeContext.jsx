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

const AdminModeContext = createContext(null)

export function AdminModeProvider({ children }) {
  const [isAdminMode, setIsAdminMode] = useState(() => readAdminMode())
  const [overrides, setOverrides] = useState(() => getCharacterOverrides())
  const [cartridgeOverrides, setCartridgeOverrides] = useState(() => getCartridgeOverrides())
  const [weaponOverrides, setWeaponOverrides] = useState(() => getWeaponOverrides())
  const [vehicleOverrides, setVehicleOverrides] = useState(() => getVehicleOverrides())
  const [codeOverrides, setCodeOverrides] = useState(() => getCodeOverrides())
  const [newsOverrides, setNewsOverrides] = useState(() => getNewsOverrides())
  const [tierListOverride, setTierListOverride] = useState(() => getOfficialTierListOverride())

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
    writeAdminMode(true)
    setIsAdminMode(true)
  }, [])

  const disableAdminMode = useCallback(() => {
    writeAdminMode(false)
    setIsAdminMode(false)
  }, [])

  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => {
      const next = !prev
      writeAdminMode(next)
      return next
    })
  }, [])

  const saveCharacterOverride = useCallback((id, data) => {
    const next = saveOverrideStorage(id, data)
    setOverrides(next)
  }, [])

  const createCharacterOverride = useCallback((data) => {
    const next = createCharacterOverrideStorage(data, baseCharacters)
    setOverrides(next)
  }, [])

  const deleteCharacterOverride = useCallback((id) => {
    const next = deleteCharacterOverrideStorage(id)
    setOverrides(next)
  }, [])

  const clearCharacterOverride = useCallback((id) => {
    const next = clearOverrideStorage(id)
    setOverrides(next)
  }, [])

  const saveCartridgeOverride = useCallback((id, data) => {
    const next = saveCartridgeOverrideStorage(id, data)
    setCartridgeOverrides(next)
  }, [])

  const createCartridgeOverride = useCallback((data) => {
    const next = createCartridgeOverrideStorage(data, baseCartridgeSets)
    setCartridgeOverrides(next)
  }, [])

  const deleteCartridgeOverride = useCallback((id) => {
    const next = deleteCartridgeOverrideStorage(id)
    setCartridgeOverrides(next)
  }, [])

  const clearCartridgeOverride = useCallback((id) => {
    const next = clearCartridgeOverrideStorage(id)
    setCartridgeOverrides(next)
  }, [])

  const saveWeaponOverride = useCallback((id, data) => {
    const next = saveWeaponOverrideStorage(id, data)
    setWeaponOverrides(next)
  }, [])

  const createWeaponOverride = useCallback((data) => {
    const next = createWeaponOverrideStorage(data, baseWeapons)
    setWeaponOverrides(next)
  }, [])

  const deleteWeaponOverride = useCallback((id) => {
    const next = deleteWeaponOverrideStorage(id)
    setWeaponOverrides(next)
  }, [])

  const saveVehicleOverride = useCallback((id, data) => {
    const next = saveVehicleOverrideStorage(id, data)
    setVehicleOverrides(next)
  }, [])

  const createVehicleOverride = useCallback((data) => {
    const next = createVehicleOverrideStorage(data, baseVehicles)
    setVehicleOverrides(next)
  }, [])

  const deleteVehicleOverride = useCallback((id) => {
    const next = deleteVehicleOverrideStorage(id)
    setVehicleOverrides(next)
  }, [])

  const saveCodeOverride = useCallback((id, data) => {
    const next = saveCodeOverrideStorage(id, data)
    setCodeOverrides(next)
  }, [])

  const createCodeOverride = useCallback((data) => {
    const next = createCodeOverrideStorage(data)
    setCodeOverrides(next)
  }, [])

  const deleteCodeOverride = useCallback((id) => {
    const next = deleteCodeOverrideStorage(id)
    setCodeOverrides(next)
  }, [])

  const saveNewsOverride = useCallback((id, data) => {
    const next = saveNewsOverrideStorage(id, data)
    setNewsOverrides(next)
  }, [])

  const createNewsOverride = useCallback((data) => {
    const next = createNewsOverrideStorage(data)
    setNewsOverrides(next)
  }, [])

  const deleteNewsOverride = useCallback((id) => {
    const next = deleteNewsOverrideStorage(id)
    setNewsOverrides(next)
  }, [])

  const saveOfficialTierListOverride = useCallback((data) => {
    const next = saveOfficialTierListOverrideStorage(normalizeTierList(data, officialTierList))
    setTierListOverride(next)
  }, [])

  const clearOfficialTierListOverride = useCallback(() => {
    const next = clearOfficialTierListOverrideStorage()
    setTierListOverride(next)
  }, [])

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

  const exportAllAdminData = useCallback(() => exportAdminData(), [])
  const exportCartridgeOnlyAdminData = useCallback(() => exportCartridgeAdminData(), [])

  const importAllAdminData = useCallback((payload, options) => {
    importAdminData(payload, options)
    setOverrides(getCharacterOverrides())
    setCartridgeOverrides(getCartridgeOverrides())
    setWeaponOverrides(getWeaponOverrides())
    setVehicleOverrides(getVehicleOverrides())
    setCodeOverrides(getCodeOverrides())
    setNewsOverrides(getNewsOverrides())
    setTierListOverride(getOfficialTierListOverride())
  }, [])

  const resetAllAdminData = useCallback(() => {
    resetAdminData()
    setOverrides(getCharacterOverrides())
    setCartridgeOverrides(getCartridgeOverrides())
    setWeaponOverrides(getWeaponOverrides())
    setVehicleOverrides(getVehicleOverrides())
    setCodeOverrides(getCodeOverrides())
    setNewsOverrides(getNewsOverrides())
    setTierListOverride(getOfficialTierListOverride())
  }, [])

  const value = useMemo(
    () => ({
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
