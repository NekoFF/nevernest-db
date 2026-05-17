import { cloneTierList, normalizeTierList } from '../data/tierList.js'

export function getTierList(sourceData, fallback) {
  return normalizeTierList(sourceData, fallback)
}

export function cloneTierListForEdit(sourceData) {
  return cloneTierList(sourceData)
}

