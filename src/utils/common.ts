import dayjs from "dayjs"
import type { Bank } from "../stores/banksStore"

export const generateId = () => {
  const dateString = dayjs().format('YYYYMMDD-HHmmss')
  const randomString = Math.random().toString(36).slice(2, 6)
  return `${dateString}-${randomString}`
}

export const moveArrElement = <T extends { id: ID }, ID = string | number>(
  arr: T[],
  id: ID,
  direction: 'up' | 'down'
): T[] => {
  const idx = arr.findIndex(item => item.id === id)
  if (idx === -1) return arr // не найден
  if (direction === 'up') {
    if (idx === 0) return arr // уже в начале
    const result = arr.slice()
    const tmp = result[idx - 1]
    result[idx - 1] = result[idx]
    result[idx] = tmp
    return result
  } else {
    if (idx === arr.length - 1) return arr
    const result = arr.slice()
    const tmp = result[idx + 1]
    result[idx + 1] = result[idx]
    result[idx] = tmp
    return result
  }
}


// dates

export const getMonthTitleFromId = (id: string, uppercaseFirstLetter: boolean = false) => {
  const monthString = dayjs(id).format('MMMM YYYY')
  return uppercaseFirstLetter ? monthString.slice(0, 1).toUpperCase() + monthString.slice(1) : monthString
}


// banks

export const getBankDataFromId = (id: string, banks: Bank[]) => {
  return banks.find(bank => bank.id === id)
}

export const sortBanksByIds = (aId: string, bId: string, banks: Bank[]) => {
  const aSortOrder = banks.find(bank => bank.id === aId)?.sortOrder ?? 0
  const bSortOrder = banks.find(bank => bank.id === bId)?.sortOrder ?? 0
  return aSortOrder - bSortOrder
}